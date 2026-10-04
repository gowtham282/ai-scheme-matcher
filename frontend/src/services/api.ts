import { Scheme, SchemeDetail, RecommendationResponse, UserProfileInput, ChannelPartner, ApplicationRecord } from '../types/scheme';

const API_BASE = '/api';

export async function fetchSchemes(params?: {
  q?: string;
  category?: string;
  ministry?: string;
  state?: string;
  business_type?: string;
  gender?: string;
  sort_by?: string;
}): Promise<Scheme[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.category) query.set('category', params.category);
  if (params?.ministry) query.set('ministry', params.ministry);
  if (params?.state) query.set('state', params.state);
  if (params?.business_type) query.set('business_type', params.business_type);
  if (params?.gender) query.set('gender', params.gender);
  if (params?.sort_by) query.set('sort_by', params.sort_by);

  const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch schemes catalog');
  return res.json();
}

export async function fetchSchemeDetail(id: string): Promise<SchemeDetail> {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scheme details');
  return res.json();
}

export async function runSmartMatcher(profile: UserProfileInput, token?: string | null): Promise<RecommendationResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to compute scheme recommendations');
  return res.json();
}

export async function fetchDemoRecommendations(): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommendations/demo`);
  if (!res.ok) throw new Error('Failed to fetch demo recommendations');
  return res.json();
}

export async function checkQuickEligibility(payload: any) {
  const res = await fetch(`${API_BASE}/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to evaluate eligibility');
  return res.json();
}

export async function fetchPartners(params?: {
  state?: string;
  district?: string;
  partner_type?: string;
  scheme_id?: string;
  q?: string;
}): Promise<ChannelPartner[]> {
  const query = new URLSearchParams();
  if (params?.state) query.set('state', params.state);
  if (params?.district) query.set('district', params.district);
  if (params?.partner_type) query.set('partner_type', params.partner_type);
  if (params?.scheme_id) query.set('scheme_id', params.scheme_id);
  if (params?.q) query.set('q', params.q);

  const res = await fetch(`${API_BASE}/partners?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch channel partners');
  return res.json();
}

export async function fetchSources() {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to fetch official sources registry');
  return res.json();
}

export async function fetchApplications(token: string): Promise<ApplicationRecord[]> {
  const res = await fetch(`${API_BASE}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load applications');
  return res.json();
}

export async function recordApplication(data: {
  scheme_id: string;
  scheme_name: string;
  application_ref_number: string;
  applied_portal: string;
  tracking_url: string;
  notes?: string;
}, token: string): Promise<ApplicationRecord> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to record application');
  return res.json();
}

export async function fetchAdminStats(token: string) {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load admin metrics');
  return res.json();
}

export async function updateSchemeStatus(schemeId: string, status: string, notes: string, token: string) {
  const res = await fetch(`${API_BASE}/admin/schemes/${schemeId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ verification_status: status, notes })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function fetchAuditLogs(token: string) {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

// --- Admin Authentication & OTP Endpoints ---
export async function fetchAdminStatus() {
  const res = await fetch(`${API_BASE}/auth/admin-status`);
  if (!res.ok) throw new Error('Failed to fetch admin status');
  return res.json();
}

export async function sendAdminOTP(payload: {
  username: string;
  name: string;
  email: string;
  phone_number: string;
  location: string;
}) {
  const res = await fetch(`${API_BASE}/auth/admin/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');
  return data;
}

export async function verifyAndRegisterAdmin(payload: {
  username: string;
  name: string;
  email: string;
  phone_number: string;
  location: string;
  password: string;
  otp: string;
}) {
  const res = await fetch(`${API_BASE}/auth/admin/verify-and-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Verification and registration failed');
  return data;
}

export async function loginWithCredentials(usernameOrEmail: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username_or_email: usernameOrEmail, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Invalid username/email or password');
  return data;
}

