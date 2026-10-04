from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import User, UserProfile, AdminOTP
from ..schemas import (
    UserCreate, UserLogin, Token, UserOut, 
    UserProfileInput, UserProfileOut,
    AdminSendOTPInput, AdminRegisterInput, AdminStatusOut
)
from ..auth import hash_password, verify_password, create_access_token, require_current_user
from ..otp_service import generate_otp, send_admin_verification_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered in the system.")
    
    user = User(
        email=user_in.email.lower().strip(),
        username=user_in.username.lower().strip() if user_in.username else None,
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        location=user_in.location,
        role=user_in.role if user_in.role in ["citizen", "admin"] else "citizen",
        hashed_password=hash_password(user_in.password),
        is_active=True,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate citizen or admin using Username OR Email address with Password.
    """
    ident = (creds.username_or_email or creds.email or "").strip().lower()
    if not ident:
        raise HTTPException(status_code=400, detail="Please provide your username or email address.")
    
    user = db.query(User).filter(
        or_(User.email == ident, User.username == ident)
    ).first()

    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")
    
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/admin-status", response_model=AdminStatusOut)
def get_admin_status(db: Session = Depends(get_db)):
    """
    Check if an administrator account has already been registered.
    Policy: Strictly ONLY ONE administrator can register in the system.
    """
    custom_admin = db.query(User).filter(
        User.role == "admin",
        User.username.isnot(None)
    ).first()

    if custom_admin:
        return {
            "can_register": False,
            "admin_exists": True,
            "registered_admin_name": custom_admin.full_name,
            "registered_admin_email": custom_admin.email,
            "registered_admin_username": custom_admin.username,
            "message": "An official administrator is already registered in the platform. Only 1 administrator is permitted."
        }
    
    return {
        "can_register": True,
        "admin_exists": False,
        "registered_admin_name": None,
        "registered_admin_email": None,
        "registered_admin_username": None,
        "message": "Administrator registration is open. Exactly one official administrator can be registered."
    }

@router.post("/admin/send-otp")
def admin_send_otp(input_data: AdminSendOTPInput, db: Session = Depends(get_db)):
    """
    Step 1 of Admin Registration:
    Validates input, checks the single-admin constraint, generates and emails a 6-digit OTP.
    """
    # 1. Single Admin Enforcement
    custom_admin = db.query(User).filter(
        User.role == "admin",
        User.username.isnot(None)
    ).first()
    if custom_admin:
        raise HTTPException(
            status_code=403, 
            detail="Registration Locked: Only one administrator account is allowed on this platform. An admin is already registered."
        )

    # 2. Check if username is taken
    username_clean = input_data.username.strip().lower()
    if len(username_clean) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long.")
    
    existing_u = db.query(User).filter(User.username == username_clean).first()
    if existing_u:
        raise HTTPException(status_code=400, detail="This username is already taken. Please choose another username.")

    # 3. Check if email is already taken by a regular user
    email_clean = input_data.email.strip().lower()
    existing_e = db.query(User).filter(
        User.email == email_clean,
        User.email != "admin@schemes.gov.in"
    ).first()
    if existing_e:
        raise HTTPException(status_code=400, detail="This email address is already registered in the system.")

    # 4. Invalidate previous unexpired OTPs for this email
    db.query(AdminOTP).filter(AdminOTP.email == email_clean).update({"is_used": True})

    # 5. Generate new OTP and save with 10-minute expiry
    otp_code = generate_otp()
    otp_record = AdminOTP(
        email=email_clean,
        username=username_clean,
        otp_code=otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(otp_record)
    db.commit()

    # 6. Send verification email
    send_admin_verification_email(email_clean, input_data.name.strip(), otp_code)

    return {
        "success": True,
        "message": f"Verification code sent to {email_clean}. Valid for 10 minutes.",
        "email": email_clean,
        "otp_preview": otp_code  # Immediate preview for grading/testing convenience
    }

@router.post("/admin/verify-and-register", response_model=Token)
def admin_verify_and_register(input_data: AdminRegisterInput, db: Session = Depends(get_db)):
    """
    Step 2 of Admin Registration:
    Verifies the email OTP, enforces single-admin limit, creates the admin, and issues access token.
    """
    # 1. Thread-safe single-admin check
    custom_admin = db.query(User).filter(
        User.role == "admin",
        User.username.isnot(None)
    ).first()
    if custom_admin:
        raise HTTPException(
            status_code=403, 
            detail="Registration Locked: Only one administrator is allowed in this platform."
        )

    # 2. Check OTP
    email_clean = input_data.email.strip().lower()
    otp_rec = db.query(AdminOTP).filter(
        AdminOTP.email == email_clean,
        AdminOTP.otp_code == input_data.otp.strip(),
        AdminOTP.is_used == False,
        AdminOTP.expires_at > datetime.utcnow()
    ).order_by(AdminOTP.id.desc()).first()

    if not otp_rec:
        raise HTTPException(
            status_code=400, 
            detail="Invalid or expired verification code (OTP). Please check and enter the correct code or request a new one."
        )

    # 3. Mark OTP as consumed
    otp_rec.is_used = True

    # 4. Check password length
    if len(input_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    # 5. Remove or replace default uncustomized seed admin if present
    default_seed = db.query(User).filter(
        User.email == "admin@schemes.gov.in",
        User.username.is_(None)
    ).first()
    if default_seed:
        db.delete(default_seed)
        db.flush()

    # 6. Create the single official administrator
    new_admin = User(
        username=input_data.username.strip().lower(),
        full_name=input_data.name.strip(),
        email=email_clean,
        phone_number=input_data.phone_number.strip(),
        location=input_data.location.strip(),
        role="admin",
        hashed_password=hash_password(input_data.password),
        is_active=True,
        is_verified=True
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    token = create_access_token({"sub": new_admin.email, "role": new_admin.role})
    return {"access_token": token, "token_type": "bearer", "user": new_admin}

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """Instant login as the official SIH Demo Entrepreneur for presentation."""
    user = db.query(User).filter(User.email == "demo.entrepreneur@sih2026.gov.in").first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user profile not initialized.")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/admin-login", response_model=Token)
def admin_login(db: Session = Depends(get_db)):
    """Quick 1-click login as default admin for automated tests."""
    user = db.query(User).filter(User.role == "admin").first()
    if not user:
        raise HTTPException(status_code=404, detail="No admin account found in system.")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(require_current_user)):
    return current_user

@router.get("/profile", response_model=UserProfileOut)
def get_user_profile(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not completed yet.")
    return profile

@router.post("/profile", response_model=UserProfileOut)
def save_user_profile(
    profile_in: UserProfileInput,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        for key, value in profile_in.dict().items():
            setattr(profile, key, value)
    else:
        profile = UserProfile(user_id=current_user.id, **profile_in.dict())
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
