import React, { useState } from 'react';
import { CheckSquare, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, IndianRupee, Sparkles } from 'lucide-react';
import { checkQuickEligibility } from '../services/api';
import { Link } from 'react-router-dom';

export const EligibilityCheckerPage: React.FC = () => {
  const [age, setAge] = useState(28);
  const [category, setCategory] = useState('SC');
  const [income, setIncome] = useState(250000);
  const [state, setState] = useState('Tamil Nadu');
  const [gender, setGender] = useState('Male');
  const [businessType, setBusinessType] = useState('Manufacturing');
  const [projectCost, setProjectCost] = useState(300000);
  const [isArtisan, setIsArtisan] = useState(true);
  const [isWomen, setIsWomen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await checkQuickEligibility({
        age,
        social_category: category,
        annual_family_income: income,
        state,
        gender,
        business_type: businessType,
        project_cost: projectCost,
        is_artisan: isArtisan,
        is_women: isWomen
      });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Fast Deterministic Evaluator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Quick Eligibility Checker
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Test your demographic and enterprise parameters against official government eligibility rules in 60 seconds.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Age</label>
                <input
                  type="number"
                  min="18"
                  max="75"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Social Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium text-[#0b2545]"
                >
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="Minority">Minority</option>
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Other">Other States</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not Prefer to say">Not Prefer to say</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Project Cost (₹)</label>
                <input
                  type="number"
                  value={projectCost}
                  onChange={(e) => setProjectCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold text-blue-900"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isArtisan}
                  onChange={(e) => setIsArtisan(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Traditional Artisan / Craftsperson (e.g. Tailor, Carpenter)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWomen}
                  onChange={(e) => setIsWomen(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Women-Owned Enterprise</span>
              </label>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0b2545] hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-md flex items-center gap-1.5 cursor-pointer shadow transition"
              >
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>{loading ? 'Evaluating Rules...' : 'Check Full 100 Schemes Eligibility'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Display */}
        {results && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#0b2545] text-sm">
                  Eligible for {results.eligible_count} out of {results.total_evaluated} verified schemes
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Evaluated using authoritative Government gazette rules.
                </p>
              </div>
              <Link
                to="/smart-matcher"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1"
              >
                <span>Run Full AI Matcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.results.map((r: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 line-clamp-1">{r.scheme_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  {r.why_it_matches.length > 0 && (
                    <p className="text-slate-600 mb-2">
                      <strong className="text-emerald-700">✓ Rule Match:</strong> {r.why_it_matches[0]}
                    </p>
                  )}
                  <div className="pt-2 border-t flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">{r.subsidy_details}</span>
                    <Link to={`/schemes/${r.scheme_id}`} className="text-blue-700 font-semibold hover:underline">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
