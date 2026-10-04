import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, 
  ArrowUpDown, Filter, RefreshCw, UserCheck, MapPin, IndianRupee, Briefcase, FileCheck
} from 'lucide-react';
import { RecommendationResponse, SchemeMatchResult } from '../types/scheme';
import { SchemeCard } from '../components/SchemeCard';
import { fetchDemoRecommendations } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export const SchemeResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [resultData, setResultData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting within results
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('match_score');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    // Check if session storage has fresh recommendation data
    const cached = sessionStorage.getItem('last_recommendation_result');
    if (cached && searchParams.get('mode') !== 'demo') {
      try {
        setResultData(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }

    // Otherwise load the official demo recommendations
    fetchDemoRecommendations()
      .then(data => {
        setResultData(data);
        sessionStorage.setItem('last_recommendation_result', JSON.stringify(data));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2545] mb-3"></div>
          <p className="text-xs text-slate-600 font-medium">Evaluating scheme rules & ranking compatibility...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <h2 className="text-lg font-bold text-slate-800">No Assessment Data Available</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Run the Smart Matcher assessment to view personalized results.</p>
        <Link to="/smart-matcher" className="bg-[#0b2545] text-white text-xs px-4 py-2 rounded-md font-semibold">
          Open Smart Matcher
        </Link>
      </div>
    );
  }

  // Filter recommendations
  let filtered = [...resultData.recommendations];

  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(r => r.eligibility_status === statusFilter);
  }

  // Sorting
  if (sortBy === 'match_score') {
    filtered.sort((a, b) => b.match_score - a.match_score);
  } else if (sortBy === 'subsidy_high') {
    filtered.sort((a, b) => b.scheme.subsidy_percentage - a.scheme.subsidy_percentage);
  } else if (sortBy === 'loan_high') {
    filtered.sort((a, b) => b.scheme.max_loan_amount - a.scheme.max_loan_amount);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-blue-900">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/smart-matcher" className="text-slate-500 hover:text-blue-900">Smart Matcher</Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-slate-900">Personalized Results</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{resultData.eligible_schemes_count} Eligible Schemes Found</span>
            </span>
          </div>
        </div>

        {/* Applicant Profile Snapshot Banner */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                Evaluated Profile Snapshot
              </div>
              <h1 className="text-xl font-bold text-[#0b2545] flex items-center gap-2">
                <span>{resultData.user_summary.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Category: {resultData.user_summary.category}
                </span>
              </h1>
            </div>

            <Link
              to="/smart-matcher"
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-md transition"
            >
              <span>Edit Profile Parameters</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Location</span>
                <span className="font-bold text-slate-800">{resultData.user_summary.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Annual Family Income</span>
                <span className="font-bold text-slate-800">₹{resultData.user_summary.annual_income.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Project & Trade</span>
                <span className="font-bold text-slate-800">{resultData.user_summary.project_category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Project Cost / Loan</span>
                <span className="font-bold text-emerald-700">₹{resultData.user_summary.estimated_project_cost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="bg-amber-50/80 p-3.5 rounded-lg border border-amber-300 text-xs text-amber-950 mb-6 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold block mb-0.5">Government Statutory Notice:</strong>
            {resultData.disclaimer}
          </div>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-blue-800" />
              <span>Filter Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none"
            >
              <option value="ALL">All Statuses ({resultData.recommendations.length})</option>
              <option value="ELIGIBLE">Officially Eligible Only</option>
              <option value="CONDITIONALLY_ELIGIBLE">Conditionally Eligible</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none font-medium text-slate-800"
            >
              <option value="match_score">Best AI Match Score (%)</option>
              <option value="subsidy_high">Highest Capital Subsidy</option>
              <option value="loan_high">Maximum Loan Ceiling</option>
            </select>
          </div>
        </div>

        {/* Recommendation Cards List */}
        <div className="space-y-6">
          {filtered.map((res, index) => (
            <SchemeCard key={res.scheme.id} result={res} />
          ))}
        </div>
      </div>
    </div>
  );
};
