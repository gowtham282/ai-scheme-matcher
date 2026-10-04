import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Compass, Sparkles, User, Briefcase, IndianRupee, 
  MapPin, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { UserProfileInput } from '../types/scheme';
import { runSmartMatcher } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const SmartMatcherPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, loginAsDemoCitizen } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Form State
  const [formData, setFormData] = useState<UserProfileInput>({
    name: 'Gowtham K',
    age: 28,
    gender: 'Male',
    mobile: '9876543210',
    state: 'Tamil Nadu',
    district: 'Namakkal',
    social_category: 'SC',
    annual_family_income: 250000,
    location_type: 'Rural',
    education_level: '10th Pass',
    occupation: 'Entrepreneur',
    business_status: 'New / Proposed',
    business_type: 'Manufacturing',
    project_category: 'Tailoring / Garments',
    project_description: 'Small tailoring business and custom garment stitching unit with motorized sewing machines.',
    estimated_project_cost: 300000,
    loan_requirement: 250000,
    purpose_of_funding: 'Machinery / Equipment',
    is_disabled: false,
    is_minority: false,
    is_women_entrepreneur: false,
    is_artisan: true,
    is_student: false,
    preferred_language: 'en'
  });

  // Pre-load demo profile if mode=demo
  useEffect(() => {
    if (searchParams.get('mode') === 'demo') {
      loadDemoData();
    }
  }, [searchParams]);

  const loadDemoData = () => {
    setFormData({
      name: 'Demo User (Marginalized Entrepreneur)',
      age: 28,
      gender: 'Male',
      mobile: '9876543210',
      state: 'Tamil Nadu',
      district: 'Namakkal',
      social_category: 'SC',
      annual_family_income: 250000,
      location_type: 'Rural',
      education_level: '10th Pass',
      occupation: 'Entrepreneur',
      business_status: 'New / Proposed',
      business_type: 'Manufacturing',
      project_category: 'Tailoring / Garments',
      project_description: 'Small tailoring business and custom garment stitching unit with motorized sewing machines.',
      estimated_project_cost: 300000,
      loan_requirement: 250000,
      purpose_of_funding: 'Machinery / Equipment',
      is_disabled: false,
      is_minority: false,
      is_women_entrepreneur: false,
      is_artisan: true,
      is_student: false,
      preferred_language: 'en'
    });
  };

  const handleInputChange = (field: keyof UserProfileInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await runSmartMatcher(formData, token);
      sessionStorage.setItem('last_recommendation_result', JSON.stringify(response));
      sessionStorage.setItem('last_profile_input', JSON.stringify(formData));
      navigate('/results');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing scheme evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Top SIH Demo Shortcut Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">SIH 2026 Presentation Quick-Fill</h3>
              <p className="text-[11px] text-amber-100">
                Auto-fill mandatory demo applicant: SC Tailoring Entrepreneur in Namakkal, Tamil Nadu (₹3,00,000 project).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadDemoData}
            className="bg-white text-slate-900 hover:bg-amber-50 font-bold px-4 py-2 rounded-lg text-xs shadow transition whitespace-nowrap cursor-pointer"
          >
            Pre-fill Demo Applicant
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0b2545] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  AI-Powered Scheme Assessment
                </span>
                <h1 className="text-xl md:text-2xl font-bold">Smart Scheme Matcher</h1>
                <p className="text-xs text-slate-300 mt-1">
                  Answer 4 quick sections to evaluate deterministic legal eligibility and AI project compatibility.
                </p>
              </div>
              <div className="hidden sm:block">
                <Compass className="w-12 h-12 text-blue-400/40" />
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-700/70 text-xs">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className={`text-left pb-1 border-b-2 font-semibold transition ${step === 1 ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}
              >
                1. Personal
              </button>
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className={`text-left pb-1 border-b-2 font-semibold transition ${step === 2 ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}
              >
                2. Category & Income
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className={`text-left pb-1 border-b-2 font-semibold transition ${step === 3 ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}
              >
                3. Business & Cost
              </button>
              <button 
                type="button" 
                onClick={() => setStep(4)} 
                className={`text-left pb-1 border-b-2 font-semibold transition ${step === 4 ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}
              >
                4. Focus Flags
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0b2545] border-b pb-2">Step 1: Personal & Geographic Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Applicant Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age (Years) *</label>
                    <input
                      type="number"
                      min="18"
                      max="80"
                      required
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Minimum 18 years required for enterprise schemes</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Prefer to say">Not Prefer to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number (Aadhaar linked) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other">Other Indian State / UT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md flex items-center gap-1.5 transition"
                  >
                    <span>Next: Category & Income</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Socio-Economic & Eligibility */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0b2545] border-b pb-2">Step 2: Socio-Economic & Eligibility Attributes</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Social Category *</label>
                    <select
                      value={formData.social_category}
                      onChange={(e) => handleInputChange('social_category', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium text-[#0b2545]"
                    >
                      <option value="SC">Scheduled Caste (SC)</option>
                      <option value="ST">Scheduled Tribe (ST)</option>
                      <option value="OBC">Other Backward Class (OBC)</option>
                      <option value="Minority">Notified Religious Minority</option>
                      <option value="General">General Category</option>
                      <option value="EWS">Economically Weaker Section (EWS)</option>
                    </select>
                    <span className="text-[10px] text-slate-500">Government schemes provide special subsidies (up to 35%) for SC/ST/OBC</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹) *</label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={formData.annual_family_income}
                      onChange={(e) => handleInputChange('annual_family_income', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                    />
                    <span className="text-[10px] text-slate-500">NSFDC & NBCFDC schemes require annual family income ≤ ₹3,00,000</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location Type *</label>
                    <select
                      value={formData.location_type}
                      onChange={(e) => handleInputChange('location_type', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Rural">Rural (Village / Panchayat)</option>
                      <option value="Urban">Urban (Municipality / Corporation)</option>
                      <option value="Semi-Urban">Semi-Urban / Town</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Educational Qualification *</label>
                    <select
                      value={formData.education_level}
                      onChange={(e) => handleInputChange('education_level', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Below 8th">Below 8th Standard</option>
                      <option value="8th Pass">8th Pass</option>
                      <option value="10th Pass">10th Pass (SSLC)</option>
                      <option value="12th Pass">12th Pass (HSC)</option>
                      <option value="Graduate">Graduate / Diploma</option>
                      <option value="Post Graduate">Post Graduate / Professional</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Current Occupation *</label>
                    <select
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Entrepreneur">Entrepreneur / Self-Employed</option>
                      <option value="Artisan">Artisan / Traditional Craftsperson</option>
                      <option value="Street Vendor">Street Vendor / Petty Trader</option>
                      <option value="Unemployed">Unemployed Youth / Jobseeker</option>
                      <option value="Student">Student / Researcher</option>
                      <option value="Farmer">Farmer / Agri-worker</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md flex items-center gap-1.5 transition"
                  >
                    <span>Next: Business & Project Cost</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Business / Project Information */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0b2545] border-b pb-2">Step 3: Proposed Business, Project & Financial Requirement</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Status *</label>
                    <select
                      value={formData.business_status}
                      onChange={(e) => handleInputChange('business_status', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="New / Proposed">New / Proposed Unit (Greenfield)</option>
                      <option value="Existing">Existing Enterprise Expansion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Sector / Type *</label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => handleInputChange('business_type', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Manufacturing">Manufacturing / Production</option>
                      <option value="Service">Service Sector</option>
                      <option value="Trading / Retail">Trading / Retail Shop</option>
                      <option value="Agri-Allied">Agri-Allied / Dairy / Poultry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Category / Trade *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tailoring / Garments, Food Processing, Carpentry"
                      value={formData.project_category}
                      onChange={(e) => handleInputChange('project_category', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Purpose of Funding *</label>
                    <select
                      value={formData.purpose_of_funding}
                      onChange={(e) => handleInputChange('purpose_of_funding', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Machinery / Equipment">Machinery / Plant & Equipment</option>
                      <option value="Working Capital">Working Capital / Raw Materials</option>
                      <option value="Tool Upgradation">Tool Upgradation & Technology</option>
                      <option value="Enterprise Expansion">Enterprise Expansion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Total Project Cost (₹) *</label>
                    <input
                      type="number"
                      required
                      min="5000"
                      value={formData.estimated_project_cost}
                      onChange={(e) => handleInputChange('estimated_project_cost', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold text-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Loan / Credit Requirement (₹) *</label>
                    <input
                      type="number"
                      required
                      min="5000"
                      value={formData.loan_requirement}
                      onChange={(e) => handleInputChange('loan_requirement', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Project Description (Used for NLP Semantic AI Matching) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.project_description}
                      onChange={(e) => handleInputChange('project_description', e.target.value)}
                      placeholder="Describe your planned business activity, products to be manufactured, tools required, and target market..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none leading-relaxed"
                    />
                    <span className="text-[10px] text-slate-500">
                      Our NLP vector engine will analyze this description to identify relevant trade focus and subsidy linkages.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md flex items-center gap-1.5 transition"
                  >
                    <span>Next: Focus Flags & Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Special Marginalized Flags */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0b2545] border-b pb-2">Step 4: Special Beneficiary Mandates & Preferences</h3>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                  <span className="block font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                    Select all that apply (Unlocks specialized credit lines & higher subsidies):
                  </span>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_artisan}
                      onChange={(e) => handleInputChange('is_artisan', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Artisan / Traditional Craftsperson (e.g. Tailor/Darzi, Carpenter, Blacksmith)</span>
                      <span className="text-slate-500 text-[11px]">Qualifies for PM Vishwakarma ₹15,000 toolkit voucher and 5% credit.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_women_entrepreneur}
                      onChange={(e) => handleInputChange('is_women_entrepreneur', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Women-Owned Enterprise (≥ 51% female ownership)</span>
                      <span className="text-slate-500 text-[11px]">Qualifies for Mahila Samriddhi (4% interest), Stand-Up India, and Stree Shakti concessions.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_disabled}
                      onChange={(e) => handleInputChange('is_disabled', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Person with Disability (Divyangjan)</span>
                      <span className="text-slate-500 text-[11px]">Eligible for concessional interest and NHFDC / Special PMEGP margins.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_minority}
                      onChange={(e) => handleInputChange('is_minority', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Notified Religious Minority</span>
                      <span className="text-slate-500 text-[11px]">Unlocks NMDFC Term Loan (6%) and Virasat Artisan credit lines.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_student}
                      onChange={(e) => handleInputChange('is_student', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">Student Innovator / TBI Incubation Candidate</span>
                      <span className="text-slate-500 text-[11px]">Eligible for ASIIM Ambedkar Social Innovation equity funding up to ₹30 Lakh.</span>
                    </div>
                  </label>
                </div>

                {/* Transparency Notice */}
                <div className="bg-blue-50/70 p-3 rounded-md border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Explainable Evaluation Guarantee:</strong> Upon clicking match, the engine will test your parameters against official scheme eligibility conditions, compute your NLP relevance score, and provide an explicit checklist of required certificates.
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold px-6 py-2.5 rounded-md flex items-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Evaluating Rules & NLP Match...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Run AI Scheme Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
