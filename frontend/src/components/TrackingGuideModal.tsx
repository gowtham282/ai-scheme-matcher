import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Key, Smartphone, FileText, ArrowRight } from 'lucide-react';
import { Scheme } from '../types/scheme';
import { recordApplication } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface TrackingGuideModalProps {
  scheme: Scheme;
  onClose: () => void;
}

export const TrackingGuideModal: React.FC<TrackingGuideModalProps> = ({ scheme, onClose }) => {
  const { token, isAuthenticated } = useAuth();
  const [refNumber, setRefNumber] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim() || !token) return;
    try {
      await recordApplication({
        scheme_id: scheme.scheme_id,
        scheme_name: scheme.official_scheme_name,
        application_ref_number: refNumber.trim(),
        applied_portal: scheme.application_portal_name,
        tracking_url: scheme.tracking_url,
        notes: `Recorded on ${new Date().toLocaleDateString()}`
      }, token);
      setSaveStatus('Reference number recorded for your profile!');
    } catch (err) {
      setSaveStatus('Error saving reference.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900 rounded-lg text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-snug">Official Application Tracking Guide</h3>
              <p className="text-[11px] text-slate-300 truncate max-w-xs">{scheme.official_scheme_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold block">External Government Portal Mandatory Notice:</strong>
            Real-time application verification, biometric stages, and subsidy releases occur strictly on official Government servers. This platform assists you with step-by-step guidance.
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Official Step-by-Step Instructions */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Official Tracking Procedure:</span>
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
              {scheme.tracking_instructions}
            </div>
          </div>

          {/* Required Credentials Checklist */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-700" />
              <span>Documents / Numbers Needed Before You Track:</span>
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Application / Acknowledgment Number (received via SMS or Email)</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Registered Mobile Number (for OTP verification)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Aadhaar Number (if portal requires UIDAI authentication)</span>
              </li>
            </ul>
          </div>

          {/* Optional Reference Saver for Logged in citizens */}
          {isAuthenticated && (
            <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200">
              <label className="block font-semibold text-blue-950 mb-1 text-[11px]">
                Save Your Application Reference ID in Your Profile:
              </label>
              <form onSubmit={handleSaveReference} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., PMEGP-2026-98124 or AABCS-TN-882"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="bg-white border border-blue-300 rounded px-3 py-1 text-xs flex-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0b2545] hover:bg-blue-900 text-white px-3 py-1 rounded font-semibold text-xs transition"
                >
                  Save ID
                </button>
              </form>
              {saveStatus && <p className="text-[11px] text-emerald-700 mt-1 font-semibold">{saveStatus}</p>}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-800 font-medium px-3 py-1.5"
          >
            Close Guide
          </button>

          <a
            href={scheme.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0b2545] hover:bg-[#134074] text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow transition"
          >
            <span>Open Official Tracking Portal ({scheme.application_portal_name})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
