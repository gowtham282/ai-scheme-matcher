from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import Scheme, SavedScheme, User
from ..schemas import SchemeOut, SchemeDetailOut
from ..auth import require_current_user

router = APIRouter(prefix="/schemes", tags=["Schemes Catalog"])

@router.get("", response_model=List[SchemeOut])
def list_schemes(
    q: Optional[str] = Query(None, description="Search query across name, description, benefits"),
    category: Optional[str] = Query(None, description="Filter by social category (SC, ST, OBC, Minority, General)"),
    ministry: Optional[str] = Query(None, description="Filter by Ministry"),
    state: Optional[str] = Query(None, description="Filter by State or Pan-India"),
    business_type: Optional[str] = Query(None, description="Filter by Business Type"),
    gender: Optional[str] = Query(None, description="Filter by Gender"),
    status: Optional[str] = Query(None, description="Verification status (Verified, Needs Review)"),
    sort_by: Optional[str] = Query("name", description="Sorting: name, loan_high, subsidy_high, verified"),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme)

    if q:
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Scheme.official_scheme_name.ilike(search_pattern),
                Scheme.short_description.ilike(search_pattern),
                Scheme.target_beneficiaries.ilike(search_pattern),
                Scheme.benefits.ilike(search_pattern),
                Scheme.ministry.ilike(search_pattern)
            )
        )

    if category:
        cat_upper = category.upper()
        query = query.filter(
            or_(
                Scheme.eligible_categories.ilike(f"%{cat_upper}%"),
                Scheme.eligible_categories.ilike("%ALL%")
            )
        )

    if ministry:
        query = query.filter(Scheme.ministry.ilike(f"%{ministry}%"))

    if state:
        query = query.filter(
            or_(
                Scheme.location_eligibility.ilike(f"%{state}%"),
                Scheme.location_eligibility == "Pan-India"
            )
        )

    if business_type:
        query = query.filter(
            or_(
                Scheme.business_type.ilike(f"%{business_type}%"),
                Scheme.business_type.ilike("%All%")
            )
        )

    if gender and gender.lower() == "female":
        pass  # Both female-only and all-gender schemes are available to women
    elif gender and (gender.lower() == "male" or "prefer" in gender.lower()):
        query = query.filter(Scheme.gender_eligibility != "Female Only")

    if status:
        query = query.filter(Scheme.verification_status == status)

    # Sorting
    if sort_by == "loan_high":
        query = query.order_by(Scheme.max_loan_amount.desc())
    elif sort_by == "subsidy_high":
        query = query.order_by(Scheme.subsidy_percentage.desc())
    elif sort_by == "verified":
        query = query.order_by(Scheme.last_verified_date.desc())
    else:
        query = query.order_by(Scheme.official_scheme_name.asc())

    return query.all()

@router.get("/{scheme_id_or_id}", response_model=SchemeDetailOut)
def get_scheme_detail(scheme_id_or_id: str, db: Session = Depends(get_db)):
    scheme = None
    if scheme_id_or_id.isdigit():
        scheme = db.query(Scheme).filter(Scheme.id == int(scheme_id_or_id)).first()
    
    if not scheme:
        scheme = db.query(Scheme).filter(Scheme.scheme_id == scheme_id_or_id).first()

    if not scheme:
        raise HTTPException(status_code=404, detail="Government scheme record not found.")

    return scheme

@router.post("/{scheme_id}/save")
def toggle_save_scheme(
    scheme_id: str,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == scheme_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Scheme removed from bookmarks."}
    else:
        saved = SavedScheme(user_id=current_user.id, scheme_id=scheme_id)
        db.add(saved)
        db.commit()
        return {"saved": True, "message": "Scheme saved to bookmarks."}

@router.get("/user/saved", response_model=List[SchemeOut])
def get_user_saved_schemes(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    saved_records = db.query(SavedScheme).filter(SavedScheme.user_id == current_user.id).all()
    saved_ids = [s.scheme_id for s in saved_records]
    if not saved_ids:
        return []
    
    return db.query(Scheme).filter(Scheme.scheme_id.in_(saved_ids)).all()
