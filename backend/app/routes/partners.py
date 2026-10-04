import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import ChannelPartner
from ..schemas import ChannelPartnerOut

router = APIRouter(prefix="/partners", tags=["Channel Partners"])

@router.get("", response_model=List[ChannelPartnerOut])
def list_partners(
    state: Optional[str] = Query(None, description="Filter by State"),
    district: Optional[str] = Query(None, description="Filter by District"),
    partner_type: Optional[str] = Query(None, description="Filter by Partner Type"),
    scheme_id: Optional[str] = Query(None, description="Filter by Scheme ID supported"),
    q: Optional[str] = Query(None, description="Text search"),
    db: Session = Depends(get_db)
):
    query = db.query(ChannelPartner).filter(ChannelPartner.is_authorized == True)

    if state:
        query = query.filter(ChannelPartner.state.ilike(f"%{state}%"))
    if district:
        query = query.filter(ChannelPartner.district.ilike(f"%{district}%"))
    if partner_type:
        query = query.filter(ChannelPartner.partner_type.ilike(f"%{partner_type}%"))
    if scheme_id:
        query = query.filter(
            or_(
                ChannelPartner.supported_schemes.ilike(f"%{scheme_id}%"),
                ChannelPartner.supported_schemes.ilike("%Pan-India%")
            )
        )
    if q:
        query = query.filter(
            or_(
                ChannelPartner.name.ilike(f"%{q}%"),
                ChannelPartner.address.ilike(f"%{q}%"),
                ChannelPartner.district.ilike(f"%{q}%")
            )
        )

    return query.all()

@router.get("/nearby", response_model=List[ChannelPartnerOut])
def get_nearby_partners(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(50.0, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    """Find authorized channel partners within distance radius using Haversine formula."""
    partners = db.query(ChannelPartner).filter(
        ChannelPartner.is_authorized == True,
        ChannelPartner.latitude.isnot(None),
        ChannelPartner.longitude.isnot(None)
    ).all()

    def haversine_dist(lat1, lon1, lat2, lon2):
        r = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c

    nearby = []
    for p in partners:
        dist = haversine_dist(lat, lng, p.latitude, p.longitude)
        if dist <= radius_km:
            nearby.append(p)

    return nearby
