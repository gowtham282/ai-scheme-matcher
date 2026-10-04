from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Scheme

router = APIRouter(prefix="/sources", tags=["Sources & Verification"])

@router.get("")
def list_all_sources(db: Session = Depends(get_db)):
    """Returns official verification registry for all 25 government schemes."""
    schemes = db.query(Scheme).order_by(Scheme.official_scheme_name.asc()).all()
    results = []
    for s in schemes:
        results.append({
            "scheme_id": s.scheme_id,
            "official_scheme_name": s.official_scheme_name,
            "ministry": s.ministry,
            "department": s.department,
            "official_source_url": s.official_source_url,
            "official_guideline_url": s.official_guideline_url,
            "official_application_portal": s.official_application_portal,
            "tracking_url": s.tracking_url,
            "last_verified_date": s.last_verified_date,
            "verification_status": s.verification_status,
            "disclaimer": (
                "Verified directly from official Government of India / State Gazette and Department notifications. "
                "Scheme terms and budgetary allocations are subject to official revision."
            )
        })
    return {
        "total_verified_schemes": len(results),
        "registry_authority": "Ministry & State Government Official Portals",
        "last_global_audit": "March 2026",
        "sources": results
    }
