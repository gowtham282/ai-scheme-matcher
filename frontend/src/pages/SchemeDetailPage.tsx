import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, ExternalLink, ShieldCheck, FileText, CheckCircle2, 
  AlertTriangle, PhoneCall, Mail, MapPin, IndianRupee, ArrowLeft, 
  Calendar, Layers, CheckSquare, Compass, Shield, FileCheck, Zap, Copy, Check
} from 'lucide-react';
import { SchemeDetail } from '../types/scheme';
import { fetchSchemeDetail } from '../services/api';
import { TrackingGuideModal } from '../components/TrackingGuideModal';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scheme, setScheme] = useState<SchemeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'benefits' | 'documents' | 'how_to_apply' | 'partners' | 'tracking' | 'sources'>('overview');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyDirectLink = () => {
    if (scheme) {
      navigator.clipboard.writeText(scheme.official_application_portal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSchemeDetail(id)
        .then(setScheme)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-xs text-slate-500">Loading verified official scheme parameters...</div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <h2 className="text-lg font-bold text-slate-800">Scheme Not Found</h2>
        <Link to="/schemes" className="text-xs text-blue-700 hover:underline mt-2 inline-block">Back to Schemes Catalog</Link>
      </div>
    );
  }

  const docsList = scheme.required_documents.split(',').map(d => d.trim()).filter(Boolean);
  const stepsList = scheme.application_steps.split(/\d+\.\s+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Back Navigation */}
        <div className="mb-4">
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0b2545] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Schemes</span>
          </Link>
        </div>

        {/* Hero Scheme Banner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  {scheme.scheme_id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>{scheme.verification_status}</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Last Verified: {scheme.last_verified_date}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b2545] leading-tight">
                {scheme.official_scheme_name}
              </h1>

              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold">{scheme.department}</span>
                <span>•</span>
                <span>{scheme.ministry}</span>
              </div>
            </div>

            {/* Direct Official Portals CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              <a
                href={scheme.official_application_portal}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
                title={`Direct Apply: ${scheme.official_application_portal}`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Direct Apply Link →</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setTrackingModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-blue-700" />
                <span>Track Application</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Beneficiaries</span>
              <span className="font-bold text-slate-900 block truncate">{scheme.eligible_categories}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Financial Assistance</span>
              <span className="font-bold text-[#0b2545]">{scheme.loan_amount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Subsidy Rate</span>
              <span className="font-bold text-emerald-700">
                {scheme.subsidy_percentage > 0 ? `${scheme.subsidy_percentage}% Capital Subsidy` : 'Interest Concession'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Geographic Coverage</span>
              <span className="font-bold text-slate-900">{scheme.location_eligibility}</span>
            </div>
          </div>
        </div>

        {/* DIRECT OFFICIAL APPLICATION LINK BANNER (நேரடி விண்ணப்ப இணைப்பு) */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#0b2545] to-[#134074] rounded-xl text-white shadow-md border-2 border-emerald-400/50 p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <Zap className="w-3 h-3 fill-slate-950" />
                Direct Apply Link • நேரடி விண்ணப்ப இணைப்பு
              </span>
              <span className="text-emerald-300 text-xs font-semibold">
                Official Online Application Form
              </span>
            </div>
            <h2 className="text-base md:text-lg font-extrabold text-white">
              Direct Scheme Registration & Online Form Endpoint
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
              Official direct application URL for <strong>{scheme.official_scheme_name}</strong>. Opens the exact applicant registration form directly, bypassing department landing pages and menu navigation.
            </p>

            {/* URL Display with Copy Button */}
            <div className="flex items-center gap-2 pt-1 max-w-2xl">
              <div className="bg-black/35 border border-emerald-400/40 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-200 truncate flex-1 select-all">
                {scheme.official_application_portal}
              </div>
              <button
                onClick={copyDirectLink}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                title="Copy direct application form URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Large Action Button */}
          <div className="shrink-0 self-stretch md:self-auto flex flex-col items-stretch md:items-end gap-1.5">
            <a
              href={scheme.official_application_portal}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-lg text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition transform active:scale-98"
            >
              <span>Direct Apply Now (நேரடி விண்ணப்பம்)</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </a>
            <span className="text-[11px] text-emerald-200/90 text-center md:text-right font-medium">
              Opens official registration portal ↗
            </span>
          </div>
        </div>

        {/* Structured Tabs Navigation */}
        <div className="flex overflow-x-auto space-x-1 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl text-xs font-semibold scrollbar-none mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'overview' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'eligibility' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Who Can Apply & Eligibility
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'benefits' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Benefits & Financial Terms
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'documents' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Required Documents
          </button>
          <button
            onClick={() => setActiveTab('how_to_apply')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'how_to_apply' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            How to Apply
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'partners' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Authorized Channel Partners
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'tracking' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Application Tracking
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'sources' ? 'border-[#0b2545] text-[#0b2545] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Official Guidelines & Sources
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 shadow-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider mb-2">Scheme Summary</h3>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                  {scheme.short_description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider mb-2">Target Beneficiaries</h3>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  {scheme.target_beneficiaries}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider mb-2">Key Scheme Highlights</h3>
                <div className="p-4 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                  {scheme.benefits}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHO CAN APPLY & ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider mb-2">Eligibility Criteria Matrix</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      <th className="p-3">Eligibility Parameter</th>
                      <th className="p-3">Official Rule Requirement</th>
                      <th className="p-3">Verification Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold">Eligible Categories</td>
                      <td className="p-3">{scheme.eligible_categories}</td>
                      <td className="p-3 text-slate-500">Revenue Dept (Caste Certificate)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Age Limits</td>
                      <td className="p-3">{scheme.minimum_age} to {scheme.maximum_age} years ({scheme.age_eligibility})</td>
                      <td className="p-3 text-slate-500">Aadhaar / Voter ID / Birth Cert</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Annual Family Income Limit</td>
                      <td className="p-3">
                        {scheme.income_limit ? `Up to ₹${scheme.income_limit.toLocaleString()} (${scheme.income_period})` : 'No income ceiling specified in official guidelines'}
                      </td>
                      <td className="p-3 text-slate-500">Income Certificate from Tehsildar</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Gender</td>
                      <td className="p-3">{scheme.gender_eligibility}</td>
                      <td className="p-3 text-slate-500">Official Self-Declaration / ID</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Geographic Coverage</td>
                      <td className="p-3">{scheme.location_eligibility} ({scheme.rural_urban_eligibility} areas)</td>
                      <td className="p-3 text-slate-500">Residence Proof / Ration Card</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Supported Business Activities</td>
                      <td className="p-3">{scheme.business_type}</td>
                      <td className="p-3 text-slate-500">Detailed Project Report (DPR)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Educational Qualifications</td>
                      <td className="p-3">{scheme.education_requirements}</td>
                      <td className="p-3 text-slate-500">School/College Marksheet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BENEFITS & FINANCIAL TERMS */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider mb-2">Financial Assistance & Lending Terms</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Financial Assistance & Quantum</span>
                  <p className="text-slate-700 leading-relaxed">{scheme.financial_assistance}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1">Capital Subsidy / Interest Subvention</span>
                  <p className="text-emerald-950 leading-relaxed">{scheme.subsidy_details}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Interest Rate</span>
                  <p className="text-slate-700 font-semibold">{scheme.interest_rate}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Beneficiary Promoter Margin</span>
                  <p className="text-slate-700">{scheme.margin_money}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Repayment Period & Moratorium</span>
                  <p className="text-slate-700">Tenor: {scheme.repayment_period} | Moratorium: {scheme.moratorium}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Collateral Requirement</span>
                  <p className="text-slate-700">{scheme.collateral_requirement}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REQUIRED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider">Required Documents Checklist</h3>
                <span className="text-[11px] text-slate-500">Prepare these before applying online</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {docsList.map((doc, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{doc}</span>
                      <span className="text-[11px] text-slate-500">Government mandatory proof</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HOW TO APPLY */}
          {activeTab === 'how_to_apply' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider">
                    Official Step-by-Step Application Guidance
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Follow these verified sequential stages to apply on the official government portal or at local nodal offices.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-md border border-blue-200">
                    Application Mode: {scheme.application_mode}
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                    Verified Active
                  </span>
                </div>
              </div>

              {/* Prerequisite Checklist Box */}
              <div className="p-4 bg-amber-50/80 rounded-lg border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-700" />
                  <span>Mandatory Prerequisites to Keep Ready Before Applying</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Aadhaar card linked with active mobile number for OTP e-KYC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Active bank savings/current account with IFSC details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Community / Caste certificate (if applying under SC/ST/OBC/Minority)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Quotations / DPR for proposed machinery, tools, or stock</span>
                  </div>
                </div>
              </div>

              {/* Step by Step Breakdown */}
              <div className="space-y-3 text-xs">
                <h4 className="text-xs font-bold text-[#0b2545] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>Sequential Application Workflow</span>
                </h4>

                {stepsList.map((stepText, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#0b2545] text-amber-400 font-extrabold flex items-center justify-center shrink-0 text-xs shadow-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs">
                        Stage {idx + 1}
                      </div>
                      <div className="text-slate-700 leading-relaxed">
                        {stepText.trim()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offline Submission & Implementation Channels */}
              <div className="p-4 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-blue-950">
                <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Where to Seek Physical / Offline Assistance</span>
                </h4>
                <p className="leading-relaxed">
                  If applying offline or requiring local handholding, approach: <strong>{scheme.channel_partner_types}</strong>. Official desk officers and resource persons will assist with application form filling and bank coordination without charges.
                </p>
              </div>

              {/* Helpline and Direct Portal Action */}
              <div className="p-4 bg-emerald-50/80 rounded-lg border border-emerald-300 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                    <span>Direct Online Application Endpoint:</span>
                  </div>
                  <div className="font-mono text-emerald-900 text-[11px] break-all bg-emerald-100/60 px-2 py-1 rounded border border-emerald-200">
                    {scheme.official_application_portal}
                  </div>
                  <div className="text-slate-600 pt-1">
                    <span>Helpline: <strong>{scheme.official_helpline}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Email: <strong>{scheme.official_email}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={copyDirectLink}
                    className="border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Direct Link!' : 'Copy Direct Link'}</span>
                  </button>

                  <a
                    href={scheme.official_application_portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-sm hover:shadow transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Direct Apply Online Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CHANNEL PARTNERS */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider">Authorized Implementing Agencies & Partners</h3>
              <p className="text-xs text-slate-600">
                Official institutional channels authorized to sponsor, inspect, or finance applications for this scheme:
              </p>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 mb-4">
                Channel Partner Categories: {scheme.channel_partner_types}
              </div>

              {scheme.partners && scheme.partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {scheme.partners.map(p => (
                    <div key={p.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
                      <div className="font-bold text-slate-900 text-sm mb-1">{p.name}</div>
                      <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2">
                        {p.partner_type}
                      </span>
                      <div className="text-slate-600 space-y-0.5">
                        <p><strong>District:</strong> {p.district}, {p.state}</p>
                        <p><strong>Helpline:</strong> {p.contact_phone}</p>
                      </div>
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline mt-2 font-semibold">
                          <span>Visit Partner Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-500">
                  Locate channel partners through the national Channel Partner Finder page.
                </div>
              )}

              <div className="pt-2">
                <Link to="/partners" className="text-xs text-blue-700 hover:underline font-semibold">
                  Open Interactive Map Locator for Nearest Branch &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* TAB 7: APPLICATION TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider">Official Application Tracking Procedure</h3>

              <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-900">
                <strong>External Government Portal:</strong> Real-time status tracking occurs directly on the official Government portal to safeguard applicant data.
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {scheme.tracking_instructions}
              </div>

              <button
                onClick={() => setTrackingModalOpen(true)}
                className="bg-[#0b2545] hover:bg-[#134074] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow transition"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch Tracking Guide with Checklist</span>
              </button>
            </div>
          )}

          {/* TAB 8: SOURCES & GUIDELINES */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider">Official Verification & Transparency Register</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50 w-1/3">Official Source URL</td>
                      <td className="p-3">
                        <a href={scheme.official_source_url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline flex items-center gap-1">
                          <span>{scheme.official_source_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50">Official Scheme Guidelines (PDF)</td>
                      <td className="p-3">
                        <a href={scheme.official_guideline_url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline flex items-center gap-1 font-semibold">
                          <span>Download Official Gazette Notification / Guidelines</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50">Direct Application Form Link</td>
                      <td className="p-3">
                        <a href={scheme.official_application_portal} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1 font-mono text-xs">
                          <span>{scheme.official_application_portal}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50">Last Verification Date</td>
                      <td className="p-3 font-bold text-slate-900">{scheme.last_verified_date}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50">Official Helpline</td>
                      <td className="p-3 font-bold text-blue-900">{scheme.official_helpline}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-slate-50">Official Support Email</td>
                      <td className="p-3">{scheme.official_email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {trackingModalOpen && (
        <TrackingGuideModal
          scheme={scheme}
          onClose={() => setTrackingModalOpen(false)}
        />
      )}
    </div>
  );
};
