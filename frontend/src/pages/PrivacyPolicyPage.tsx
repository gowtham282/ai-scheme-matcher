import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700 leading-relaxed space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Privacy & DPDP Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b2545]">Privacy Policy & Citizen Data Protection Notice</h1>
        <p className="text-[11px] text-slate-500">Last updated: March 2026</p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">1. Scope and Commitment</h2>
        <p>
          This platform is designed exclusively for the Smart India Hackathon 2026 (SIH26092) to empower marginalized entrepreneurs. We adhere strictly to the Digital Personal Data Protection (DPDP) principles of the Government of India.
        </p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">2. Data Minimization</h2>
        <p>
          We do not collect sensitive financial credentials, banking passwords, biometric raw samples, or unnecessary identity documents. Demographic attributes (caste category, annual income range, location, and proposed project cost) are gathered solely to compute eligibility rules and semantic matching.
        </p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">3. Non-Commercial & Zero-Monetization Policy</h2>
        <p>
          Your data is never monetized, sold, leased, or transmitted to third-party commercial advertisers or unauthorized loan brokers.
        </p>

        <h2 className="text-sm font-bold text-slate-900 pt-2">4. Direct Government Processing</h2>
        <p>
          All actual credit sanctions, biometric verifications, and subsidy disbursements take place exclusively on official Government of India and State Government servers.
        </p>
      </div>
    </div>
  );
};
