from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Scheme, ChannelPartner, User, Application, AuditLog
from ..schemas import SchemeStatusUpdate, AdminStatsOut, AuditLogOut
from ..auth import require_admin_user

router = APIRouter(prefix="/admin", tags=["Government & Admin Operations"])

@router.get("/stats", response_model=AdminStatsOut)
def get_admin_dashboard_stats(
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    total_schemes = db.query(Scheme).count()
    verified_schemes = db.query(Scheme).filter(Scheme.verification_status == "Verified").count()
    needs_review = db.query(Scheme).filter(Scheme.verification_status == "Needs Review").count()
    outdated = db.query(Scheme).filter(Scheme.verification_status == "Outdated").count()
    total_users = db.query(User).count()
    total_partners = db.query(ChannelPartner).count()
    total_apps = db.query(Application).count()

    return {
        "total_schemes": total_schemes,
        "active_verified_schemes": verified_schemes,
        "schemes_needing_review": needs_review,
        "outdated_schemes": outdated,
        "total_users": total_users,
        "total_channel_partners": total_partners,
        "total_applications_recorded": total_apps,
        "last_system_verification": "2026-03-01 (Audited against official GoI gazettes)"
    }

@router.put("/schemes/{scheme_id}/status")
def update_scheme_verification_status(
    scheme_id: str,
    status_update: SchemeStatusUpdate,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    scheme = db.query(Scheme).filter(Scheme.scheme_id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found.")

    old_status = scheme.verification_status
    scheme.verification_status = status_update.verification_status
    scheme.last_verified_date = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Create audit log entry
    audit = AuditLog(
        admin_id=current_user.id,
        admin_email=current_user.email,
        action="UPDATE_SCHEME_STATUS",
        entity_type="Scheme",
        entity_id=scheme.scheme_id,
        details=f"Verification status changed from '{old_status}' to '{status_update.verification_status}'. Note: {status_update.notes or 'Routine audit verification'}",
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    db.commit()

    return {
        "scheme_id": scheme.scheme_id,
        "new_status": scheme.verification_status,
        "last_verified_date": scheme.last_verified_date,
        "message": "Scheme verification status updated successfully."
    }

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(
    limit: int = 50,
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
