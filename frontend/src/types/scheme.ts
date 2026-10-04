export interface SchemeBenefit {
  id: number;
  title: string;
  benefit_type: string;
  amount: string;
  description: string;
}

export interface SchemeDocument {
  id: number;
  doc_name: string;
  doc_type: string;
  is_mandatory: boolean;
  description: string;
  issuing_authority: string;
}

export interface SchemeStep {
  id: number;
  step_number: number;
  title: string;
  instruction: string;
  portal_url?: string;
}

export interface SchemeSource {
  id: number;
  source_name: string;
  official_url: string;
  guideline_url: string;
  last_verified_date: string;
  verification_status: string;
  disclaimer: string;
}

export interface ChannelPartnerSummary {
  id: number;
  name: string;
  partner_type: string;
  state: string;
  district: string;
  contact_phone: string;
  website: string;
  is_authorized: boolean;
}

export interface Scheme {
  id: number;
  scheme_id: string;
  official_scheme_name: string;
  short_description: string;
  ministry: string;
  department: string;
  target_beneficiaries: string;
  eligible_categories: string;
  gender_eligibility: string;
  age_eligibility: string;
  minimum_age: number;
  maximum_age: number;
  income_limit: number | null;
  income_period: string;
  location_eligibility: string;
  rural_urban_eligibility: string;
  occupation_eligibility: string;
  business_type: string;
  project_type: string;
  education_requirements: string;
  loan_amount: string;
  min_loan_amount: number;
  max_loan_amount: number;
  financial_assistance: string;
  subsidy_details: string;
  subsidy_percentage: number;
  max_subsidy_amount: number;
  interest_rate: string;
  margin_money: string;
  repayment_period: string;
  moratorium: string;
  collateral_requirement: string;
  project_cost_limit: number;
  benefits: string;
  required_documents: string;
  application_mode: string;
  application_steps: string;
  official_application_portal: string;
  application_portal_name: string;
  application_tracking_available: boolean;
  tracking_url: string;
  tracking_instructions: string;
  channel_partner_requirement: boolean;
  channel_partner_types: string;
  official_helpline: string;
  official_email: string;
  official_source_url: string;
  official_guideline_url: string;
  last_verified_date: string;
  verification_status: string;
}

export interface SchemeDetail extends Scheme {
  benefits_list: SchemeBenefit[];
  documents_list: SchemeDocument[];
  steps_list: SchemeStep[];
  sources_list: SchemeSource[];
  partners: ChannelPartnerSummary[];
}

export interface MatchScoreFactor {
  factor_name: string;
  score: number;
  max_score: number;
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  comment: string;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  match_score: number;
  eligibility_status: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  why_it_matches: string[];
  potential_missing_requirements: string[];
  required_documents: string[];
  score_breakdown: MatchScoreFactor[];
  recommended_channel_partners: ChannelPartnerSummary[];
}

export interface RecommendationResponse {
  total_schemes_analyzed: number;
  eligible_schemes_count: number;
  user_summary: {
    name: string;
    category: string;
    location: string;
    annual_income: number;
    project_category: string;
    estimated_project_cost: number;
    loan_requirement: number;
  };
  recommendations: SchemeMatchResult[];
  disclaimer: string;
}

export interface ChannelPartner {
  id: number;
  name: string;
  partner_type: string;
  state: string;
  district: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  latitude: number | null;
  longitude: number | null;
  supported_schemes: string;
  is_authorized: boolean;
}

export interface ApplicationRecord {
  id: number;
  user_id: number;
  scheme_id: string;
  scheme_name: string;
  application_ref_number: string;
  applied_portal: string;
  applied_date: string;
  status: string;
  notes?: string;
  tracking_url: string;
}

export interface UserProfileInput {
  name: string;
  age: number;
  gender: string;
  mobile: string;
  state: string;
  district: string;
  social_category: string;
  annual_family_income: number;
  location_type: string;
  education_level: string;
  occupation: string;
  business_status: string;
  business_type: string;
  project_category: string;
  project_description: string;
  estimated_project_cost: number;
  loan_requirement: number;
  purpose_of_funding: string;
  is_disabled: boolean;
  is_minority: boolean;
  is_women_entrepreneur: boolean;
  is_artisan: boolean;
  is_student: boolean;
  preferred_language: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  username?: string;
  phone_number?: string;
  location?: string;
  role: 'citizen' | 'admin' | 'government_officer';
  is_active: boolean;
  is_verified?: boolean;
  created_at: string;
}

export interface AdminStatusResponse {
  can_register: boolean;
  admin_exists: boolean;
  registered_admin_name?: string | null;
  registered_admin_email?: string | null;
  registered_admin_username?: string | null;
  message: string;
}

export interface AdminSendOTPPayload {
  username: string;
  name: string;
  email: string;
  phone_number: string;
  location: string;
}

export interface AdminRegisterPayload {
  username: string;
  name: string;
  email: string;
  phone_number: string;
  location: string;
  password: string;
  otp: string;
}
