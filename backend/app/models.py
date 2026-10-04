from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Association table between schemes and channel partners
scheme_partners = Table(
    "scheme_partners",
    Base.metadata,
    Column("scheme_id", Integer, ForeignKey("schemes.id", ondelete="CASCADE"), primary_key=True),
    Column("partner_id", Integer, ForeignKey("channel_partners.id", ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    role = Column(String(50), default="citizen")  # citizen, admin, government_officer
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="admin")
    saved_schemes = relationship("SavedScheme", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Personal Information
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=False)  # Male, Female, Transgender, Other
    mobile = Column(String(20), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)

    # Socio-Economic & Eligibility
    social_category = Column(String(50), nullable=False)  # SC, ST, OBC, Minority, General, EWS
    annual_family_income = Column(Float, nullable=False)
    location_type = Column(String(50), nullable=False)  # Rural, Urban, Semi-Urban
    education_level = Column(String(100), nullable=False)  # Below 8th, 8th Pass, 10th Pass, 12th Pass, Graduate, Post Graduate, ITI/Diploma
    occupation = Column(String(100), nullable=False)  # Entrepreneur, Artisan, Street Vendor, Farmer, Unemployed, Student, Self-Employed

    # Business / Project Information
    business_status = Column(String(50), nullable=False)  # New / Proposed, Existing
    business_type = Column(String(100), nullable=False)  # Manufacturing, Service, Trading / Retail, Agri-Allied
    project_category = Column(String(100), nullable=False)  # e.g., Tailoring, Food Processing, Handicrafts, IT/Digital, Leather, Carpentry, Welding, etc.
    project_description = Column(Text, nullable=False)
    estimated_project_cost = Column(Float, nullable=False)
    loan_requirement = Column(Float, nullable=False)
    purpose_of_funding = Column(String(150), nullable=False)  # Machinery / Equipment, Working Capital, Expansion, Skill & Setup

    # Special Marginalized Flags
    is_disabled = Column(Boolean, default=False)
    is_minority = Column(Boolean, default=False)
    is_women_entrepreneur = Column(Boolean, default=False)
    is_artisan = Column(Boolean, default=False)
    is_student = Column(Boolean, default=False)

    # Language Preference
    preferred_language = Column(String(20), default="en")  # en, ta, hi

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(String(100), unique=True, index=True, nullable=False)  # e.g. "PMEGP-KVIC-01"
    official_scheme_name = Column(String(500), nullable=False)
    short_description = Column(Text, nullable=False)
    ministry = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)

    # Beneficiary & Eligibility criteria
    target_beneficiaries = Column(Text, nullable=False)  # JSON or comma-separated
    eligible_categories = Column(String(255), nullable=False)  # "SC,ST,OBC,Minority,General,EWS" or "All"
    gender_eligibility = Column(String(100), default="All")  # "All", "Female Only", "Male Only"
    age_eligibility = Column(String(100), nullable=False)  # Summary string e.g. "18 to 55 years"
    minimum_age = Column(Integer, default=18)
    maximum_age = Column(Integer, default=70)
    income_limit = Column(Float, nullable=True)  # None if no limit
    income_period = Column(String(50), default="Per Annum")
    location_eligibility = Column(String(150), default="Pan-India")  # "Pan-India" or specific state
    rural_urban_eligibility = Column(String(50), default="Both")  # "Rural", "Urban", "Both"
    occupation_eligibility = Column(String(255), nullable=False)
    business_type = Column(String(255), nullable=False)  # Manufacturing, Service, Trading, Agri-Allied, All
    project_type = Column(String(255), nullable=False)
    education_requirements = Column(String(255), default="None specified in the official source.")

    # Financial Assistance & Terms
    loan_amount = Column(String(255), nullable=False)
    min_loan_amount = Column(Float, default=0.0)
    max_loan_amount = Column(Float, default=10000000.0)
    financial_assistance = Column(Text, nullable=False)
    subsidy_details = Column(Text, nullable=False)
    subsidy_percentage = Column(Float, default=0.0)
    max_subsidy_amount = Column(Float, default=0.0)
    interest_rate = Column(String(150), nullable=False)
    margin_money = Column(String(150), nullable=False)
    repayment_period = Column(String(100), nullable=False)
    moratorium = Column(String(100), default="Not specified in the official source.")
    collateral_requirement = Column(String(255), default="No collateral required as per official norms.")
    project_cost_limit = Column(Float, default=5000000.0)
    benefits = Column(Text, nullable=False)

    # Documents & Application Process
    required_documents = Column(Text, nullable=False)  # JSON or newline-separated
    application_mode = Column(String(100), default="Online")  # Online, Offline, CSC, Hybrid
    application_steps = Column(Text, nullable=False)  # JSON or step list
    official_application_portal = Column(String(500), nullable=False)
    application_portal_name = Column(String(255), nullable=False)

    # Tracking & Channel Partners
    application_tracking_available = Column(Boolean, default=True)
    tracking_url = Column(String(500), nullable=False)
    tracking_instructions = Column(Text, nullable=False)
    channel_partner_requirement = Column(Boolean, default=True)
    channel_partner_types = Column(String(255), nullable=False)  # e.g., "SCAs, Public Sector Banks, RRBs"

    # Contact & Transparency
    official_helpline = Column(String(255), default="1800-180-6763")
    official_email = Column(String(255), default="Not specified in the official source.")
    official_source_url = Column(String(500), nullable=False)
    official_guideline_url = Column(String(500), nullable=False)
    last_verified_date = Column(String(50), default="2026-03-01")
    verification_status = Column(String(50), default="Verified")  # Verified, Needs Review, Outdated

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    rules = relationship("SchemeEligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    benefits_list = relationship("SchemeBenefit", back_populates="scheme", cascade="all, delete-orphan")
    documents_list = relationship("SchemeDocument", back_populates="scheme", cascade="all, delete-orphan")
    steps_list = relationship("SchemeApplicationStep", back_populates="scheme", cascade="all, delete-orphan")
    sources_list = relationship("SchemeSource", back_populates="scheme", cascade="all, delete-orphan")
    partners = relationship("ChannelPartner", secondary=scheme_partners, back_populates="schemes")


class SchemeEligibilityRule(Base):
    __tablename__ = "scheme_eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    rule_code = Column(String(100), nullable=False)
    field_name = Column(String(100), nullable=False)  # age, category, income, gender, location, project_cost, etc.
    operator = Column(String(20), nullable=False)  # <=, >=, ==, IN, CONTAINS, ANY
    target_value = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    is_mandatory = Column(Boolean, default=True)

    scheme = relationship("Scheme", back_populates="rules")


class SchemeBenefit(Base):
    __tablename__ = "scheme_benefits"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    benefit_type = Column(String(100), nullable=False)  # Subsidy, Loan, Stipend, Toolkit, Interest Subvention
    amount = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)

    scheme = relationship("Scheme", back_populates="benefits_list")


class SchemeDocument(Base):
    __tablename__ = "scheme_documents"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    doc_name = Column(String(255), nullable=False)
    doc_type = Column(String(100), default="Standard")  # Identity, Income, Caste, Project, Residence, Bank
    is_mandatory = Column(Boolean, default=True)
    description = Column(Text, nullable=False)
    issuing_authority = Column(String(255), default="Government of India / State Authority")

    scheme = relationship("Scheme", back_populates="documents_list")


class SchemeApplicationStep(Base):
    __tablename__ = "scheme_application_steps"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    instruction = Column(Text, nullable=False)
    portal_url = Column(String(500), nullable=True)

    scheme = relationship("Scheme", back_populates="steps_list")


class SchemeSource(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    source_name = Column(String(255), nullable=False)
    official_url = Column(String(500), nullable=False)
    guideline_url = Column(String(500), nullable=False)
    last_verified_date = Column(String(50), default="2026-03-01")
    verification_status = Column(String(50), default="Verified")
    disclaimer = Column(Text, default="Information verified from official government gazette and portal. Subject to periodic policy amendments.")

    scheme = relationship("Scheme", back_populates="sources_list")


class ChannelPartner(Base):
    __tablename__ = "channel_partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    partner_type = Column(String(100), nullable=False)  # State Channelizing Agency (SCA), Public Sector Bank, RRB, District Industries Centre (DIC), NBFC-MFI, CSC
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    contact_phone = Column(String(100), nullable=False)
    contact_email = Column(String(100), default="Not specified in the official source.")
    website = Column(String(500), default="")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    supported_schemes = Column(Text, nullable=False)  # Comma-separated scheme IDs or Names
    is_authorized = Column(Boolean, default=True)

    schemes = relationship("Scheme", secondary=scheme_partners, back_populates="partners")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(String(100), nullable=False)
    scheme_name = Column(String(500), nullable=False)
    application_ref_number = Column(String(100), nullable=False)  # User's real or demo application ref ID
    applied_portal = Column(String(255), nullable=False)
    applied_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(100), default="Submitted on Official Portal")
    notes = Column(Text, default="")
    tracking_url = Column(String(500), nullable=False)

    user = relationship("User", back_populates="applications")


class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(String(100), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_schemes")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    profile_snapshot = Column(Text, nullable=False)  # JSON representation of input
    matches_json = Column(Text, nullable=False)  # Ranked scheme results with scores
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info")  # info, alert, update
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    admin_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)  # e.g., "VERIFY_SCHEME", "UPDATE_RULE"
    entity_type = Column(String(100), nullable=False)  # "Scheme", "Partner"
    entity_id = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    admin = relationship("User", back_populates="audit_logs")


class AdminOTP(Base):
    __tablename__ = "admin_otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    username = Column(String(100), nullable=True)
    otp_code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

