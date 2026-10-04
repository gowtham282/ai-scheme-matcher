from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Scheme
from ..schemas import UserProfileInput
from ..eligibility_engine import evaluate_scheme_eligibility

router = APIRouter(prefix="/eligibility", tags=["Eligibility Checker"])

class QuickEligibilityRequest(BaseModel):
    scheme_id: Optional[str] = None
    age: int = 28
    social_category: str = "SC"
    annual_family_income: float = 250000.0
    state: str = "Tamil Nadu"
    gender: str = "Male"
    location_type: str = "Rural"
    project_cost: float = 300000.0
    business_type: str = "Manufacturing"
    is_women: bool = False
    is_artisan: bool = False

@router.post("/check")
def check_eligibility(req: QuickEligibilityRequest, db: Session = Depends(get_db)):
    """Fast-check eligibility against a single target scheme or all 25 schemes."""
    # Convert request to pseudo-profile
    class TempProfile:
        pass
    p = TempProfile()
    p.social_category = req.social_category
    p.age = req.age
    p.annual_family_income = req.annual_family_income
    p.gender = req.gender
    p.state = req.state
    p.location_type = req.location_type
    p.estimated_project_cost = req.project_cost
    p.loan_requirement = req.project_cost * 0.8
    p.business_type = req.business_type
    p.project_category = "General"
    p.project_description = "General enterprise"
    p.is_women_entrepreneur = req.is_women or req.gender.lower() == "female"
    p.is_artisan = req.is_artisan
    p.is_minority = req.social_category.upper() == "MINORITY"
    p.is_student = False

    if req.scheme_id:
        scheme = db.query(Scheme).filter(Scheme.scheme_id == req.scheme_id).first()
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found.")
        status, why, missing, factor_checks = evaluate_scheme_eligibility(p, scheme)
        return {
            "scheme_id": scheme.scheme_id,
            "scheme_name": scheme.official_scheme_name,
            "status": status,
            "why_it_matches": why,
            "potential_missing_requirements": missing,
            "factor_checks": factor_checks,
            "official_portal": scheme.official_application_portal
        }
    else:
        schemes = db.query(Scheme).all()
        results = []
        for s in schemes:
            status, why, missing, factor_checks = evaluate_scheme_eligibility(p, s)
            results.append({
                "scheme_id": s.scheme_id,
                "scheme_name": s.official_scheme_name,
                "status": status,
                "why_it_matches": why,
                "potential_missing_requirements": missing,
                "subsidy_details": s.subsidy_details,
                "official_portal": s.official_application_portal
            })
        return {
            "total_evaluated": len(schemes),
            "eligible_count": sum(1 for r in results if r["status"] == "ELIGIBLE"),
            "results": results
        }
