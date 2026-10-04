import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Printer, Download, HelpCircle, Layers, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RequiredDocumentsPage: React.FC = () => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleCheck = (docName: string) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  const documentCategories = [
    {
      category: "1. Identity & Citizenship Proofs",
      icon: ShieldCheck,
      docs: [
        { name: "Aadhaar Card", authority: "UIDAI (Govt of India)", desc: "Mandatory for Aadhaar-based e-KYC and DBT subsidy credit." },
        { name: "Permanent Account Number (PAN) Card", authority: "Income Tax Department", desc: "Mandatory for bank loan account creation above ₹50,000." },
        { name: "Voter ID / Driving License", authority: "Election Commission / RTO", desc: "Secondary photo identity verification." }
      ]
    },
    {
      category: "2. Socio-Economic & Category Certificates",
      icon: Layers,
      docs: [
        { name: "Community / Caste Certificate (SC/ST/OBC)", authority: "Tahsildar / Revenue Department", desc: "Mandatory to unlock SC/ST 35% capital subsidies and apex loans." },
        { name: "Annual Family Income Certificate", authority: "Tahsildar / Village Administrative Officer", desc: "Required for NSFDC/NBCFDC schemes where income ceiling is ₹3.00 Lakh." },
        { name: "Minority Declaration / Certificate", authority: "Notified Religious Authority / Self-Declaration", desc: "Required for NMDFC Term Loan and Virasat scheme." },
        { name: "Artisan Pehchan Card / Vishwakarma ID", authority: "Ministry of Textiles / MSDE", desc: "Required for specialized craft credit and toolkits." }
      ]
    },
    {
      category: "3. Project & Business Feasibility Documents",
      icon: FileText,
      docs: [
        { name: "Detailed Project Report (DPR)", authority: "Chartered Accountant / DIC / Handholding Agency", desc: "Covers plant & machinery costs, working capital, cash flow, and 5-year payback." },
        { name: "Machinery & Equipment Quotations", authority: "Authorized Suppliers / Manufacturers", desc: "Official price quotations on supplier letterhead with GST numbers." },
        { name: "Land Documents / Rent / Lease Agreement", authority: "Premises Owner / Sub-Registrar", desc: "Proof of commercial premises for proposed manufacturing/service unit." },
        { name: "Udyam Registration Certificate", authority: "Ministry of MSME Portal (udyamregistration.gov.in)", desc: "Free government registration proving MSME micro/small enterprise status." }
      ]
    },
    {
      category: "4. Banking & Financial Documents",
      icon: CheckSquare,
      docs: [
        { name: "Bank Account Passbook / Cancelled Cheque", authority: "Financing Bank Branch", desc: "Must show Account Number and IFSC Code for direct margin money release." },
        { name: "Bank Statements for Last 6 Months", authority: "Bank Branch / NetBanking", desc: "Required for existing business expansions and Kishore/Tarun loans." }
      ]
    }
  ];

  const totalDocs = documentCategories.reduce((acc, cat) => acc + cat.docs.length, 0);
  const completedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Statutory Requirements</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
              Required Documents & Application Checklist
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Verify all necessary certificates before visiting your bank or submitting online applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold px-3 py-2 rounded-md shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-800" />
              <span>Print Checklist</span>
            </button>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Checklist Readiness</span>
            <div className="text-xl font-bold text-[#0b2545] mt-0.5">
              {completedCount} of {totalDocs} Documents Ready ({Math.round((completedCount / totalDocs) * 100)}%)
            </div>
          </div>

          <div className="w-full sm:w-64 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalDocs) * 100}%` }}
            />
          </div>
        </div>

        {/* Document Categories Accordions */}
        <div className="space-y-6">
          {documentCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <cat.icon className="w-4 h-4 text-blue-900" />
                <h3 className="font-bold text-xs md:text-sm text-[#0b2545]">{cat.category}</h3>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {cat.docs.map((d, dIdx) => {
                  const isChecked = !!checkedDocs[d.name];
                  return (
                    <div
                      key={dIdx}
                      onClick={() => toggleCheck(d.name)}
                      className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition ${
                        isChecked ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(d.name)}
                          className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className={`font-bold text-sm block ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {d.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Issuing Authority: <strong className="text-slate-700">{d.authority}</strong>
                          </span>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d.desc}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isChecked ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Ready</span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
