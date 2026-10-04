from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    username: Optional[str] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    role: str = "citizen"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username_or_email: Optional[str] = None
    email: Optional[str] = None
    password: str

class AdminSendOTPInput(BaseModel):
    username: str
    name: str
    email: str
    phone_number: str
    location: str

class AdminRegisterInput(BaseModel):
    username: str
    name: str
    email: str
    phone_number: str
    location: str
    password: str
    otp: str

class AdminStatusOut(BaseModel):
    can_register: bool
    admin_exists: bool
    registered_admin_name: Optional[str] = None
    registered_admin_email: Optional[str] = None
    registered_admin_username: Optional[str] = None
    message: str

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool = True
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- User Profile Schemas ---
class UserProfileInput(BaseModel):
    name: str = "Demo User"
    age: int = Field(28, ge=18, le=100)
    gender: str = "Male"  # Male, Female, Transgender, Other
    mobile: str = "9876543210"
    state: str = "Tamil Nadu"
    district: str = "Namakkal"
    social_category: str = "SC"  # SC, ST, OBC, Minority, General, EWS
    annual_family_income: float = Field(250000.0, ge=0)
    location_type: str = "Rural"  # Rural, Urban, Semi-Urban
    education_level: str = "10th Pass"
    occupation: str = "Entrepreneur"
    business_status: str = "New / Proposed"
    business_type: str = "Manufacturing"  # Manufacturing, Service, Trading / Retail, Agri-Allied
    project_category: str = "Tailoring / Garments"
    project_description: str = "Small tailoring business and custom garment stitching unit with motorized sewing machines."
    estimated_project_cost: float = Field(300000.0, ge=1000)
    loan_requirement: float = Field(250000.0, ge=0)
    purpose_of_funding: str = "Machinery / Equipment"
    is_disabled: bool = False
    is_minority: bool = False
    is_women_entrepreneur: bool = False
    is_artisan: bool = False
    is_student: bool = False
    preferred_language: str = "en"

class UserProfileOut(UserProfileInput):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Scheme Schemas ---
class SchemeBenefitOut(BaseModel):
    id: int
    title: str
    benefit_type: str
    amount: str
    description: str
    class Config:
        from_attributes = True

class SchemeDocumentOut(BaseModel):
    id: int
    doc_name: str
    doc_type: str
    is_mandatory: bool
    description: str
    issuing_authority: str
    class Config:
        from_attributes = True

class SchemeStepOut(BaseModel):
    id: int
    step_number: int
    title: str
    instruction: str
    portal_url: Optional[str] = None
    class Config:
        from_attributes = True

class SchemeSourceOut(BaseModel):
    id: int
    source_name: str
    official_url: str
    guideline_url: str
    last_verified_date: str
    verification_status: str
    disclaimer: str
    class Config:
        from_attributes = True

class ChannelPartnerSummary(BaseModel):
    id: int
    name: str
    partner_type: str
    state: str
    district: str
    contact_phone: str
    website: str
    is_authorized: bool
    class Config:
        from_attributes = True

class SchemeOut(BaseModel):
    id: int
    scheme_id: str
    official_scheme_name: str
    short_description: str
    ministry: str
    department: str
    target_beneficiaries: str
    eligible_categories: str
    gender_eligibility: str
    age_eligibility: str
    minimum_age: int
    maximum_age: int
    income_limit: Optional[float] = None
    income_period: str
    location_eligibility: str
    rural_urban_eligibility: str
    occupation_eligibility: str
    business_type: str
    project_type: str
    education_requirements: str
    loan_amount: str
    min_loan_amount: float
    max_loan_amount: float
    financial_assistance: str
    subsidy_details: str
    subsidy_percentage: float
    max_subsidy_amount: float
    interest_rate: str
    margin_money: str
    repayment_period: str
    moratorium: str
    collateral_requirement: str
    project_cost_limit: float
    benefits: str
    required_documents: str
    application_mode: str
    application_steps: str
    official_application_portal: str
    application_portal_name: str
    application_tracking_available: bool
    tracking_url: str
    tracking_instructions: str
    channel_partner_requirement: bool
    channel_partner_types: str
    official_helpline: str
    official_email: str
    official_source_url: str
    official_guideline_url: str
    last_verified_date: str
    verification_status: str
    class Config:
        from_attributes = True

class SchemeDetailOut(SchemeOut):
    benefits_list: List[SchemeBenefitOut] = []
    documents_list: List[SchemeDocumentOut] = []
    steps_list: List[SchemeStepOut] = []
    sources_list: List[SchemeSourceOut] = []
    partners: List[ChannelPartnerSummary] = []
    class Config:
        from_attributes = True

# --- Recommendation & Match Schemas ---
class MatchScoreFactor(BaseModel):
    factor_name: str
    score: float
    max_score: float
    status: str  # PASS, PARTIAL, FAIL
    comment: str

class SchemeMatchResult(BaseModel):
    scheme: SchemeOut
    match_score: int  # 0 - 100
    eligibility_status: str  # "ELIGIBLE", "CONDITIONALLY_ELIGIBLE", "NOT_ELIGIBLE"
    why_it_matches: List[str]  # e.g., ["✓ Annual income of ₹2,50,000 is well within the ₹3,00,000 ceiling"]
    potential_missing_requirements: List[str]  # e.g., ["⚠ Valid SC Caste Certificate from competent Revenue Authority required"]
    required_documents: List[str]
    score_breakdown: List[MatchScoreFactor]
    recommended_channel_partners: List[ChannelPartnerSummary] = []

class RecommendationResponse(BaseModel):
    total_schemes_analyzed: int
    eligible_schemes_count: int
    user_summary: Dict[str, Any]
    recommendations: List[SchemeMatchResult]
    disclaimer: str = (
        "Recommendations are informational and based on official scheme information available at the time of verification. "
        "Final eligibility, sanction, disbursement and approval are determined by the concerned government department, bank or authorized channel partner."
    )

# --- Channel Partner Schemas ---
class ChannelPartnerOut(BaseModel):
    id: int
    name: str
    partner_type: str
    state: str
    district: str
    address: str
    contact_phone: str
    contact_email: str
    website: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    supported_schemes: str
    is_authorized: bool
    class Config:
        from_attributes = True

# --- Application Tracking Schemas ---
class ApplicationCreate(BaseModel):
    scheme_id: str
    scheme_name: str
    application_ref_number: str
    applied_portal: str
    tracking_url: str
    notes: Optional[str] = ""

class ApplicationOut(BaseModel):
    id: int
    user_id: int
    scheme_id: str
    scheme_name: str
    application_ref_number: str
    applied_portal: str
    applied_date: datetime
    status: str
    notes: Optional[str] = ""
    tracking_url: str
    class Config:
        from_attributes = True

# --- Admin Schemas ---
class SchemeStatusUpdate(BaseModel):
    verification_status: str  # "Verified", "Needs Review", "Outdated"
    notes: Optional[str] = None

class AdminStatsOut(BaseModel):
    total_schemes: int
    active_verified_schemes: int
    schemes_needing_review: int
    outdated_schemes: int
    total_users: int
    total_channel_partners: int
    total_applications_recorded: int
    last_system_verification: str

class AuditLogOut(BaseModel):
    id: int
    admin_email: Optional[str] = None
    action: str
    entity_type: str
    entity_id: str
    details: str
    timestamp: datetime
    class Config:
        from_attributes = True
