import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ExternalLink, AlertTriangle, Key, Smartphone, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { ApplicationRecord } from '../types/scheme';
import { fetchApplications, recordApplication } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const TrackingPage: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Add reference modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [schemeName, setSchemeName] = useState('PMEGP - KVIC Online');
  const [refNumber, setRefNumber] = useState('');
  const [appliedPortal, setAppliedPortal] = useState('KVIC PMEGP e-Portal');
  const [trackingUrl, setTrackingUrl] = useState('https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp');

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchApplications(token)
        .then(setApplications)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSaveRef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !refNumber.trim()) return;
    try {
      const rec = await recordApplication({
        scheme_id: "CUSTOM-01",
        scheme_name: schemeName,
        application_ref_number: refNumber.trim(),
        applied_portal: appliedPortal,
        tracking_url: trackingUrl,
        notes: "Saved by applicant"
      }, token);
      setApplications(prev => [rec, ...prev]);
      setShowAddForm(false);
      setRefNumber('');
    } catch (err) {
      console.error(err);
    }
  };

  const portalDirectories = [
    {
      name: "KVIC PMEGP Application Tracking",
      portal: "https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp",
      requiredCredentials: "Application ID & Password (received via SMS upon submission)",
      instructions: "Go to KVIC PMEGP home page → Click on 'Applicant Login / Track' → Enter Application ID and Password → Check DIC Task Force and Bank sanction status."
    },
    {
      name: "JanSamarth Loan Tracking Dashboard",
      portal: "https://www.jansamarth.in/",
      requiredCredentials: "Registered Mobile Number with OTP",
      instructions: "Login to JanSamarth → Navigate to 'My Applications' tab → View real-time digital loan sanction and branch communication."
    },
    {
      name: "PM Vishwakarma 3-Tier Verification Tracking",
      portal: "https://www.pmvishwakarma.gov.in/Home/TrackApplication",
      requiredCredentials: "Aadhaar Registered Mobile Number & OTP",
      instructions: "Visit pmvishwakarma.gov.in → Click 'Track Application Status' → Enter Aadhaar mobile → View Gram Panchayat, District Committee & Screening approval stages."
    },
    {
      name: "PM SVANidhi Street Vendor Status Search",
      portal: "https://pmsvanidhi.mohua.gov.in/Schemes/SearchVendor",
      requiredCredentials: "Application Number or Registered Mobile",
      instructions: "Visit PM SVANidhi portal → Click 'Check Status' → Enter Application Number & OTP → View ULB verification and bank loan disbursement stage."
    },
    {
      name: "Stand-Up Mitra Application Tracking",
      portal: "https://www.standupmitra.in/",
      requiredCredentials: "Borrower Username & Password",
      instructions: "Login to Stand-Up Mitra borrower account → Go to 'Application Status' → View bank branch inspection and sanction progress."
    },
    {
      name: "Tamil Nadu AABCS Application Tracking",
      portal: "https://www.msmeonline.tn.gov.in/aabcs/",
      requiredCredentials: "AABCS Application Reference ID & Mobile Number",
      instructions: "Visit msmeonline.tn.gov.in/aabcs → Click 'Application Status' → Enter AABCS reference ID → Check DIC General Manager & District Task Force Committee approvals."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Portal Verification Protocol</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Application Tracking Directory & Guidance
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Instructions, required credentials, and direct links to official Government of India and State tracking portals.
          </p>
        </div>

        {/* Mandatory Transparency Notice */}
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-xs text-amber-950 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold block text-sm mb-0.5">External Government Portal Notice:</strong>
            To protect your privacy and ensure official accuracy, application status queries are executed directly on official Government of India and State Government servers. Our platform does not simulate or invent fake real-time tracking data.
          </div>
        </div>

        {/* Citizen's Saved Reference Notebook */}
        {isAuthenticated && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#0b2545]">Your Saved Application References</h3>
                <p className="text-xs text-slate-500">Keep track of your reference numbers for 1-click access to official tracking portals.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New Application ID</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSaveRef} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Scheme Name</label>
                    <input
                      type="text"
                      required
                      value={schemeName}
                      onChange={(e) => setSchemeName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Application Reference ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TN-AABCS-2026-981"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Portal Name</label>
                    <input
                      type="text"
                      required
                      value={appliedPortal}
                      onChange={(e) => setAppliedPortal(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-slate-600">Cancel</button>
                  <button type="submit" className="bg-emerald-600 text-white font-semibold px-4 py-1.5 rounded">Save Reference</button>
                </div>
              </form>
            )}

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No application reference numbers saved yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {applications.map(app => (
                  <div key={app.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">{app.scheme_name}</span>
                      <span className="text-[11px] text-slate-500">
                        Reference Number: <strong className="text-blue-900 font-mono bg-blue-50 px-1.5 py-0.5 rounded">{app.application_ref_number}</strong>
                      </span>
                    </div>
                    <a
                      href={app.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold px-3 py-1.5 rounded border border-blue-200 transition"
                    >
                      <span>Track on {app.applied_portal}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Master Tracking Directory */}
        <h2 className="text-lg font-bold text-[#0b2545] mb-4">Official Tracking Portals & Procedures</h2>
        <div className="space-y-4">
          {portalDirectories.map((dir, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-sm text-[#0b2545]">{dir.name}</h3>
                <a
                  href={dir.portal}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0b2545] hover:bg-blue-900 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow transition"
                >
                  <span>Open Official Tracking Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-blue-800" />
                    <span>Required Credentials:</span>
                  </span>
                  <p className="text-slate-600">{dir.requiredCredentials}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-800" />
                    <span>Tracking Steps:</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">{dir.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
