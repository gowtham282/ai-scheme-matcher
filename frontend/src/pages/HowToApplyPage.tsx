import React, { useState } from 'react';
import { HelpCircle, ExternalLink, ShieldCheck, CheckCircle2, FileText, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowToApplyPage: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<'jansamarth' | 'pmegp' | 'standup' | 'vishwakarma' | 'pmsuraj' | 'aabcs'>('jansamarth');

  const guides = {
    jansamarth: {
      name: "JanSamarth Portal Application Guide",
      schemes: "MUDRA (Shishu, Kishore, Tarun), Stree Shakti, Education & Livelihood Loans",
      officialUrl: "https://www.jansamarth.in/",
      steps: [
        { title: "Check Eligibility", desc: "Select 'Business Activity Loan' category on JanSamarth homepage and answer basic questions on income, category, and proposed project cost." },
        { title: "Register Account", desc: "Sign up with mobile number and verify via OTP. Enter your PAN card and Aadhaar details." },
        { title: "Review In-Principle Approvals", desc: "JanSamarth displays offers from multiple member lending institutions (State Bank of India, Canara Bank, PNB, etc.)." },
        { title: "Select Preferred Bank & Branch", desc: "Choose your preferred bank branch and upload KYC documents, business quotations, and caste certificate." },
        { title: "Branch Verification & Disbursement", desc: "The selected branch reviews the application, conducts premises inspection if required, and disburses the loan directly." }
      ]
    },
    pmegp: {
      name: "KVIC PMEGP e-Portal Application Guide",
      schemes: "Prime Minister's Employment Generation Programme (15% - 35% Capital Subsidy)",
      officialUrl: "https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp",
      steps: [
        { title: "Online Registration", desc: "Visit KVIC PMEGP e-Portal and click 'Application for New Unit'. Enter Aadhaar number, PAN, and applicant personal details." },
        { title: "Choose Sponsoring Agency", desc: "Select implementing agency in your district: KVIC (Khadi Commission), KVIB (State Board), or DIC (District Industries Centre)." },
        { title: "Fill Project Details", desc: "Select industry activity (Manufacturing or Service). Enter capital expenditure, machinery cost, and working capital requirements." },
        { title: "Upload Mandatory Documents", desc: "Upload passport photo, caste certificate (for SC/ST/OBC/Minority 35% subsidy), Detailed Project Report (DPR), and 8th pass certificate (if project > ₹10L/₹5L)." },
        { title: "Task Force Committee & EDP Training", desc: "District Task Force Committee reviews and forwards to bank. Complete 5-10 day online/offline Entrepreneurship Development Programme (EDP) training." },
        { title: "Bank Sanction & Margin Money Release", desc: "Bank sanctions loan and KVIC deposits margin money subsidy into the subsidy reserve fund account." }
      ]
    },
    standup: {
      name: "Stand-Up Mitra Portal Guide",
      schemes: "Stand-Up India Scheme (₹10 Lakh to ₹100 Lakh for SC, ST, and Women Founders)",
      officialUrl: "https://www.standupmitra.in/",
      steps: [
        { title: "Registration on Stand-Up Mitra", desc: "Visit standupmitra.in. Register as a 'Borrower'. Select whether you are 'Ready Borrower' or 'Trainee Borrower' needing handholding." },
        { title: "Profile Submission", desc: "Fill in promoter stake details (at least 51% held by SC/ST or woman), company structure (Proprietorship, Partnership, LLP, Pvt Ltd), and project location." },
        { title: "Handholding Support", desc: "If needed, connect with local handholding agencies (SIDBI, NABARD, DIC, Lead District Manager) for project report preparation." },
        { title: "Select Bank Branch", desc: "Choose scheduled commercial bank branch. Submit DPR, quotations, and financial statements." },
        { title: "Credit Guarantee & Sanction", desc: "Bank assesses greenfield proposal and sanctions loan with Credit Guarantee Scheme for Stand Up India (CGSUI) coverage." }
      ]
    },
    vishwakarma: {
      name: "PM Vishwakarma Portal Guide",
      schemes: "PM Vishwakarma (Artisans & Craftspersons across 18 Traditional Trades)",
      officialUrl: "https://www.pmvishwakarma.gov.in/",
      steps: [
        { title: "Visit Common Services Centre (CSC)", desc: "PM Vishwakarma registration requires biometric authentication at your nearest CSC digital seva centre with your Aadhaar and registered mobile." },
        { title: "Select Identified Trade", desc: "Choose from 18 trades (e.g. Tailor/Darzi, Carpenter, Blacksmith, Potter, Mason, Cobbler, Barber, Sculptor)." },
        { title: "Stage 1: Gram Panchayat / ULB Verification", desc: "Your village panchayat or municipal body verifies your active engagement in the traditional craft." },
        { title: "Stage 2 & 3: District & National Committee", desc: "District Committee screens the list and National Committee issues PM Vishwakarma Certificate & Digital ID." },
        { title: "Skill Training & Toolkit Incentive", desc: "Attend 5-day basic skill training with ₹500/day stipend. Receive ₹15,000 e-RUPI voucher for modern toolkit." },
        { title: "Access Collateral-Free Credit", desc: "Access 1st tranche loan up to ₹1,00,000 at 5% concessional interest rate, followed by 2nd tranche of ₹2,00,000." }
      ]
    },
    pmsuraj: {
      name: "PM-SURAJ National Portal Guide",
      schemes: "PM-SURAJ (NSFDC, NBCFDC, NSKFDC Apex Corporation Credit)",
      officialUrl: "https://www.pmsuraj.dosje.gov.in/",
      steps: [
        { title: "Open PM-SURAJ Portal", desc: "Visit pmsuraj.dosje.gov.in. Verify mobile number with OTP." },
        { title: "Category Selection", desc: "Choose your target beneficiary group: Scheduled Caste, Other Backward Class, or Safai Karamchari/Sanitation Worker." },
        { title: "Submit Trade & Loan Demand", desc: "Enter proposed self-employment trade (micro-enterprise, tailoring, transport vehicle, sanitary machinery)." },
        { title: "Direct JanSamarth Routing", desc: "Application is routed directly without middlemen to the concerned apex corporation (NSFDC / NBCFDC) and participating bank." },
        { title: "Direct Benefit Transfer (DBT)", desc: "Subsidized loan assistance is disbursed directly into the beneficiary's Aadhaar-linked bank account." }
      ]
    },
    aabcs: {
      name: "Tamil Nadu AABCS Portal Guide",
      schemes: "Annal Ambedkar Business Champions Scheme (SC/ST 35% Capital Subsidy + 6% Interest Subvention)",
      officialUrl: "https://www.msmeonline.tn.gov.in/aabcs/",
      steps: [
        { title: "Visit TN MSME Online Portal", desc: "Visit msmeonline.tn.gov.in/aabcs. Register as SC or ST entrepreneur in Tamil Nadu." },
        { title: "Upload SC/ST Community Certificate", desc: "Upload community certificate issued by Revenue Tahsildar and Detailed Project Report (DPR)." },
        { title: "District Task Force Committee (DTFC)", desc: "General Manager, District Industries Centre (DIC) inspects proposal and places it before DTFC headed by District Collector." },
        { title: "Bank Sanction & TIIC Linkage", desc: "Upon DTFC clearance, commercial bank or TIIC sanctions loan with only 5% promoter equity contribution." },
        { title: "Release of 35% Subsidy & 6% Interest Rebate", desc: "Government of Tamil Nadu releases 35% capital subsidy (up to ₹35 Lakh) and deposits 6% interest subvention for 6 full years." }
      ]
    }
  };

  const current = guides[activeGuide];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Master Application Instructions</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            How to Apply on Official Government Portals
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Step-by-step master walkthroughs for key Government of India and State online portals.
          </p>
        </div>

        {/* Portal Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          <button
            onClick={() => setActiveGuide('jansamarth')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'jansamarth' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            JanSamarth
          </button>
          <button
            onClick={() => setActiveGuide('pmegp')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'pmegp' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            KVIC PMEGP
          </button>
          <button
            onClick={() => setActiveGuide('standup')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'standup' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Stand-Up Mitra
          </button>
          <button
            onClick={() => setActiveGuide('vishwakarma')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'vishwakarma' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            PM Vishwakarma
          </button>
          <button
            onClick={() => setActiveGuide('pmsuraj')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'pmsuraj' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            PM-SURAJ
          </button>
          <button
            onClick={() => setActiveGuide('aabcs')}
            className={`p-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
              activeGuide === 'aabcs' ? 'bg-[#0b2545] text-white border-[#0b2545] shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            TN AABCS
          </button>
        </div>

        {/* Selected Guide Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 mb-6">
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-0.5">
                Official Walkthrough
              </span>
              <h2 className="text-xl font-bold text-[#0b2545]">{current.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Supported Schemes: {current.schemes}</p>
            </div>

            <a
              href={current.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0b2545] hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-md shadow flex items-center gap-1.5 transition"
            >
              <span>Open Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4 text-xs">
            {current.steps.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-[#0b2545] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
