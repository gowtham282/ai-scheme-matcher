import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, CheckCircle2, AlertTriangle, ExternalLink, 
  FileCheck, Shield, ChevronDown, ChevronUp, MapPin, IndianRupee, 
  HelpCircle, ArrowUpRight, Award, Compass, BookOpen, Zap, Copy, Check
} from 'lucide-react';
import { SchemeMatchResult, Scheme } from '../types/scheme';
import { TrackingGuideModal } from './TrackingGuideModal';
import { SchemeGuidanceModal } from './SchemeGuidanceModal';

interface SchemeCardProps {
  result?: SchemeMatchResult;
  scheme?: Scheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ result, scheme: rawScheme }) => {
  const scheme = result ? result.scheme : rawScheme!;
  const [expanded, setExpanded] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [guidanceModalOpen, setGuidanceModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyDirectLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(scheme.official_application_portal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchScore = result?.match_score ?? null;
  const status = result?.eligibility_status ?? 'ELIGIBLE';
  const whyMatches = result?.why_it_matches ?? [];
  const missingReqs = result?.potential_missing_requirements ?? [];
  const docsList = scheme.required_documents.split(',').map(d => d.trim()).slice(0, 4);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-sky-700 bg-sky-50 border-sky-300';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getStatusBadge = () => {
    if (status === 'ELIGIBLE') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Officially Eligible
        </span>
      );
    } else if (status === 'CONDITIONALLY_ELIGIBLE') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Conditionally Eligible
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
          Not Eligible (Rule Condition)
        </span>
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
              {scheme.scheme_id}
            </span>
            <span className="text-xs text-slate-500 font-medium truncate max-w-xs">
              {scheme.department}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {matchScore !== null && (
              <div className={`px-2.5 py-0.5 rounded-full border text-xs font-black flex items-center gap-1 ${getScoreColor(matchScore)}`}>
                <Compass className="w-3 h-3" />
                <span>{matchScore}% Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link
                to={`/schemes/${scheme.scheme_id}`}
                className="text-base md:text-lg font-bold text-[#0b2545] hover:text-blue-700 transition"
              >
                {scheme.official_scheme_name}
              </Link>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{scheme.ministry}</span>
                <span>•</span>
                <span>Coverage: {scheme.location_eligibility}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {scheme.short_description}
          </p>

          {/* Key Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Assistance / Loan</span>
              <span className="font-bold text-[#0b2545] text-xs">{scheme.loan_amount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Subsidy / Support</span>
              <span className="font-bold text-emerald-700 text-xs">
                {scheme.subsidy_percentage > 0 ? `${scheme.subsidy_percentage}% Subsidy` : 'Concessional Interest'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Interest Rate</span>
              <span className="font-bold text-slate-800 text-xs">{scheme.interest_rate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Collateral Security</span>
              <span className="font-bold text-slate-800 text-xs truncate block">{scheme.collateral_requirement}</span>
            </div>
          </div>

          {/* Why It Matches (Explainability Section) */}
          {whyMatches.length > 0 && (
            <div className="mb-3 bg-emerald-50/60 p-3 rounded-md border border-emerald-200">
              <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Why This Scheme Matches Your Profile:</span>
              </h4>
              <ul className="space-y-1 text-xs text-emerald-950">
                {whyMatches.slice(0, expanded ? undefined : 2).map((reason, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Missing Requirements Warning */}
          {missingReqs.length > 0 && (
            <div className="mb-3 bg-amber-50/70 p-2.5 rounded-md border border-amber-200 text-xs text-amber-950">
              <div className="font-semibold flex items-center gap-1 text-[11px] text-amber-900 mb-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Statutory Prerequisites / Required Certificates:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                {missingReqs.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents Pill Previews */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
              Required Documents:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {docsList.map((doc, i) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {doc}
                </span>
              ))}
              <Link to={`/schemes/${scheme.scheme_id}`} className="text-[11px] text-blue-600 hover:underline px-1 py-0.5 font-medium">
                + more in details
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* How to Apply Guidance Button */}
              <button
                onClick={() => setGuidanceModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition shadow-xs cursor-pointer"
                title="View step-by-step guidance, required documents checklist, and official portal procedure"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>How to Apply</span>
              </button>

              {/* Direct Apply Button */}
              <a
                href={scheme.official_application_portal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-bold shadow-xs transition"
                title={`Direct Online Application: ${scheme.official_application_portal}`}
              >
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Direct Apply Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* Quick Copy Link Button */}
              <button
                onClick={copyDirectLink}
                className="inline-flex items-center gap-1 border border-emerald-300 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                title="Copy direct application form URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] font-bold text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[11px] hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>

              {/* Official Tracking Guide Trigger */}
              <button
                onClick={() => setTrackingModalOpen(true)}
                className="inline-flex items-center gap-1 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 px-2 py-1.5 rounded text-xs font-medium transition cursor-pointer"
              >
                <Shield className="w-3 h-3 text-blue-700" />
                <span>Track</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/schemes/${scheme.scheme_id}`}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition flex items-center gap-0.5"
              >
                <span>Full Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Application Guidance Modal */}
      {guidanceModalOpen && (
        <SchemeGuidanceModal
          scheme={scheme}
          onClose={() => setGuidanceModalOpen(false)}
        />
      )}

      {/* Official Tracking Procedure Modal */}
      {trackingModalOpen && (
        <TrackingGuideModal
          scheme={scheme}
          onClose={() => setTrackingModalOpen(false)}
        />
      )}
    </>
  );
};
