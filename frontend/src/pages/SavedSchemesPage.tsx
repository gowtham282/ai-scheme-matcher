import React, { useState, useEffect } from 'react';
import { Bookmark, ShieldCheck, ArrowRight } from 'lucide-react';
import { Scheme } from '../types/scheme';
import { SchemeCard } from '../components/SchemeCard';
import { fetchSchemes } from '../services/api';
import { Link } from 'react-router-dom';

export const SavedSchemesPage: React.FC = () => {
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show sample saved schemes for demo (TN AABCS, PMEGP, PM Vishwakarma)
    fetchSchemes()
      .then(all => {
        const demoSavedIds = ['TN-AABCS-MSME-25', 'PMEGP-KVIC-01', 'PM-VISHWAKARMA-05'];
        setSavedSchemes(all.filter(s => demoSavedIds.includes(s.scheme_id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 text-blue-700" />
            <span>Citizen Bookmarks</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Saved Government Schemes
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Bookmarked schemes for fast review, comparison, and channel partner consultation.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading saved schemes...</div>
        ) : savedSchemes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border text-center text-xs text-slate-500">
            No saved schemes yet. <Link to="/schemes" className="text-blue-700 underline">Explore catalog</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map(s => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
