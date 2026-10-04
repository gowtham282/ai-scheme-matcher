import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsDisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700 leading-relaxed space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Statutory Terms & Disclaimer</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b2545]">Terms of Use & Statutory Government Disclaimers</h1>
        <p className="text-[11px] text-slate-500">Effective: Smart India Hackathon 2026</p>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-300 text-amber-950 font-medium">
          <strong>Mandatory Statutory Notice:</strong> Recommendations provided by this platform are informational and based strictly on official scheme notifications available at the time of verification. Final eligibility, sanction, margin subsidy release, and loan disbursement are determined by the concerned government department, public sector bank, or authorized channel partner.
        </div>

        <h2 className="text-sm font-bold text-slate-900 pt-2">1. No Loan or Subsidy Guarantee</h2>
        <p>
          A high AI Match Score indicates high compatibility between the applicant's entered parameters and the scheme's published guidelines. It does not constitute, imply, or guarantee financial sanction or government approval.
        </p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">2. No Fake Real-Time Government Status</h2>
        <p>
          Our platform does not claim direct API integration where none exists. Real-time application tracking takes place on official Government of India and State Government portals. We provide deep links, credential checklists, and step-by-step guidance.
        </p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">3. Verification of Current Guidelines</h2>
        <p>
          Government budgets, guidelines, and subsidy percentages are subject to amendment by relevant Ministries and State authorities. Citizens are strongly encouraged to inspect the official gazette guidelines linked under the <Link to="/sources" className="text-blue-700 underline font-semibold">Sources & Verification Registry</Link>.
        </p>
      </div>
    </div>
  );
};
