from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Application, Scheme, User
from ..schemas import ApplicationCreate, ApplicationOut
from ..auth import require_current_user

router = APIRouter(prefix="/applications", tags=["Application Tracking"])

@router.get("", response_model=List[ApplicationOut])
def get_user_applications(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.applied_date.desc()).all()

@router.post("", response_model=ApplicationOut)
def record_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    """Store citizen application reference number to provide guided official portal tracking."""
    app_rec = Application(
        user_id=current_user.id,
        scheme_id=app_in.scheme_id,
        scheme_name=app_in.scheme_name,
        application_ref_number=app_in.application_ref_number.strip(),
        applied_portal=app_in.applied_portal,
        tracking_url=app_in.tracking_url,
        notes=app_in.notes,
        status="Recorded (Track via Official External Portal)"
    )
    db.add(app_rec)
    db.commit()
    db.refresh(app_rec)
    return app_rec

@router.get("/{app_id}/tracking-guide")
def get_application_tracking_guide(
    app_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    app_rec = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()

    if not app_rec:
        raise HTTPException(status_code=404, detail="Application record not found.")

    scheme = db.query(Scheme).filter(Scheme.scheme_id == app_rec.scheme_id).first()

    return {
        "application_ref_number": app_rec.application_ref_number,
        "scheme_name": app_rec.scheme_name,
        "official_tracking_portal_name": scheme.application_portal_name if scheme else "Official Portal",
        "official_tracking_url": app_rec.tracking_url,
        "is_external_portal": True,
        "external_portal_notice": "External Government Portal: Real-time application tracking takes place on the designated Government of India / State Government server.",
        "tracking_instructions": scheme.tracking_instructions if scheme else "Navigate to the official portal, input your application reference number, and complete OTP/captcha authentication to view live status.",
        "required_credentials": [
            "Application / Acknowledgment Reference Number",
            "Registered Mobile Number (for OTP verification)",
            "Aadhaar Number (if portal requires biometric/UIDAI OTP)"
        ]
    }
