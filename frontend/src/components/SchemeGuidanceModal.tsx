import React, { useState } from 'react';
import { 
  X, ExternalLink, CheckCircle2, FileText, PhoneCall, Mail, 
  MapPin, AlertCircle, ShieldCheck, ArrowRight, BookOpen, Clock, Zap, Copy, Check
} from 'lucide-react';
import { Scheme } from '../types/scheme';

interface SchemeGuidanceModalProps {
  scheme: Scheme;
  onClose: () => void;
}

export const SchemeGuidanceModal: React.FC<SchemeGuidanceModalProps> = ({ scheme, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyDirectLink = () => {
    navigator.clipboard.writeText(scheme.official_application_portal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse steps (handles numbers like "1. ... 2. ..." or newlines)
  const steps = scheme.application_steps
    ? scheme.application_steps
        .split(/\d+\.\s+/)
        .filter(s => s.trim().length > 0)
        .map(s => s.trim())
    : [];

  const docs = scheme.required_documents
    ? scheme.required_documents.split(',').map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Official Application Guidance
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {scheme.scheme_id}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {scheme.official_scheme_name}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {scheme.ministry} • {scheme.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-slate-800">
          {/* Top Quick Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Application Mode</span>
              <span className="font-bold text-[#0b2545]">{scheme.application_mode}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Official Form Endpoint</span>
              <span className="font-bold text-emerald-700 truncate block">{scheme.application_portal_name}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Target Category</span>
              <span className="font-bold text-emerald-700">{scheme.eligible_categories}</span>
            </div>
          </div>

          {/* Direct Application Link Callout (நேரடி விண்ணப்ப இணைப்பு) */}
          <div className="p-3.5 bg-emerald-50 rounded-lg border-2 border-emerald-400/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Direct Official Application Link (நேரடி விண்ணப்ப இணைப்பு):</span>
              </div>
              <div className="font-mono text-xs text-emerald-900 bg-white/90 px-2.5 py-1 rounded border border-emerald-200 truncate select-all">
                {scheme.official_application_portal}
              </div>
              <div className="text-[11px] text-emerald-700">
                Opens applicant registration form directly without navigating department portal menus.
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyDirectLink}
                className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Copy direct apply URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Step-by-Step Procedure */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
                Step-by-Step Application Instructions
              </h4>
            </div>

            <div className="space-y-2.5">
              {steps.length > 0 ? (
                steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#0b2545] text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded text-xs text-slate-700 leading-relaxed">
                  {scheme.application_steps}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Required Documents Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
                Required Documents Checklist
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docs.map((doc, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-tight">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Official Verification Authority */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Implementing Authority & Processing Channels:</span>
            </div>
            <div className="text-slate-700 text-[11px] leading-relaxed">
              <strong>Department:</strong> {scheme.department} • <strong>Ministry:</strong> {scheme.ministry}
            </div>
            <div className="text-slate-600 text-[11px]">
              Offline Support / Handholding: <strong>{scheme.channel_partner_types}</strong>
            </div>
          </div>

          {/* Section 4: Official Helpline Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-blue-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Official Helpline</span>
                <span className="font-bold text-slate-900">{scheme.official_helpline}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Official Email Support</span>
                <span className="font-bold text-slate-900 truncate block">{scheme.official_email}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Anti-Fraud Transparency Advisory */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Official Security Advisory:</strong> Never pay money to any middleman or unauthorized agency. Applications must be submitted directly through the verified government portal below or at designated district offices.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Close Guidance
          </button>

          <a
            href={scheme.official_application_portal}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 shadow-sm hover:shadow transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Direct Apply Now (Open Form)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
