import json
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Scheme, Recommendation, User
from ..schemas import UserProfileInput, RecommendationResponse
from ..ai_matcher import rank_and_explain_schemes
from ..auth import get_current_user

router = APIRouter(prefix="/recommendations", tags=["Smart Scheme Matcher"])

@router.post("", response_model=RecommendationResponse)
def match_and_recommend(
    profile_in: UserProfileInput,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Executes the Hybrid Recommendation Engine:
    1. Deterministic Rule-Based Eligibility Check
    2. NLP Free-Text Semantic Similarity
    3. Multi-Factor Weighted Fit Scoring (0-100)
    4. Transparent Explainability & Document Generation
    """
    schemes = db.query(Scheme).all()

    recommendations = rank_and_explain_schemes(profile_in, schemes)
    eligible_count = sum(1 for r in recommendations if r["eligibility_status"] in ["ELIGIBLE", "CONDITIONALLY_ELIGIBLE"])

    # Persist recommendation snapshot if user is logged in
    if current_user:
        rec_entry = Recommendation(
            user_id=current_user.id,
            profile_snapshot=json.dumps(profile_in.dict()),
            matches_json=json.dumps([
                {"scheme_id": r["scheme"].scheme_id, "score": r["match_score"], "status": r["eligibility_status"]}
                for r in recommendations
            ])
        )
        db.add(rec_entry)
        db.commit()

    return {
        "total_schemes_analyzed": len(schemes),
        "eligible_schemes_count": eligible_count,
        "user_summary": {
            "name": profile_in.name,
            "category": profile_in.social_category,
            "location": f"{profile_in.district}, {profile_in.state} ({profile_in.location_type})",
            "annual_income": profile_in.annual_family_income,
            "project_category": profile_in.project_category,
            "estimated_project_cost": profile_in.estimated_project_cost,
            "loan_requirement": profile_in.loan_requirement
        },
        "recommendations": recommendations,
        "disclaimer": (
            "Recommendations are informational and based on official scheme information available at the time of verification. "
            "Final eligibility, sanction, disbursement and approval are determined by the concerned government department, bank or authorized channel partner."
        )
    }

@router.get("/demo", response_model=RecommendationResponse)
def get_demo_recommendations(db: Session = Depends(get_db)):
    """Instant 1-Click execution for the SIH 2026 Demo Profile (Tamil Nadu / Namakkal / SC / Tailoring)."""
    demo_profile = UserProfileInput(
        name="Demo User (Marginalized Entrepreneur)",
        age=28,
        gender="Male",
        mobile="9876543210",
        state="Tamil Nadu",
        district="Namakkal",
        social_category="SC",
        annual_family_income=250000.0,
        location_type="Rural",
        education_level="10th Pass",
        occupation="Entrepreneur",
        business_status="New / Proposed",
        business_type="Manufacturing",
        project_category="Tailoring / Garments",
        project_description="Small tailoring business and custom garment stitching unit with motorized sewing machines.",
        estimated_project_cost=300000.0,
        loan_requirement=250000.0,
        purpose_of_funding="Machinery / Equipment",
        is_disabled=False,
        is_minority=False,
        is_women_entrepreneur=False,
        is_artisan=True,
        is_student=False,
        preferred_language="en"
    )
    return match_and_recommend(demo_profile, current_user=None, db=db)
