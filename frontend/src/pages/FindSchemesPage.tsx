import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, Layers, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { Scheme } from '../types/scheme';
import { SchemeCard } from '../components/SchemeCard';
import { fetchSchemes } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export const FindSchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const loadSchemes = () => {
    setLoading(true);
    fetchSchemes({
      q: searchQuery,
      category: selectedCategory,
      ministry: selectedMinistry,
      state: selectedState,
      business_type: selectedBusinessType,
      gender: selectedGender,
      sort_by: sortBy
    })
      .then(setSchemes)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSchemes();
  }, [searchQuery, selectedCategory, selectedMinistry, selectedState, selectedBusinessType, selectedGender, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMinistry('');
    setSelectedState('');
    setSelectedBusinessType('');
    setSelectedGender('');
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Government Database • {schemes.length || 100} Verified Schemes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Explore Government Schemes for Entrepreneurs
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Browse verified central and state schemes supporting marginalized entrepreneurs, micro-enterprises, artisans, and women founders.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by scheme name, trade, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="">All Social Categories</option>
                <option value="SC">Scheduled Castes (SC)</option>
                <option value="ST">Scheduled Tribes (ST)</option>
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="Minority">Minority Communities</option>
                <option value="General">General / Open</option>
                <option value="EWS">Economically Weaker Sections (EWS)</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="name">Sort: Scheme Name (A-Z)</option>
                <option value="loan_high">Sort: Highest Financial Assistance</option>
                <option value="subsidy_high">Sort: Highest Capital Subsidy %</option>
                <option value="verified">Sort: Recently Verified Date</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <select
                value={selectedBusinessType}
                onChange={(e) => setSelectedBusinessType(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none"
              >
                <option value="">All Business Types</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Service">Service</option>
                <option value="Trading">Trading / Retail</option>
                <option value="Agri-Allied">Agri-Allied</option>
              </select>
            </div>

            <div>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none"
              >
                <option value="">All Beneficiaries</option>
                <option value="female">Women-Only Schemes</option>
                <option value="male">All Genders / Male</option>
              </select>
            </div>

            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none"
              >
                <option value="">All Locations (Pan-India)</option>
                <option value="Tamil Nadu">Tamil Nadu State Schemes</option>
              </select>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-red-700 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-600 font-medium">
          <div>
            Showing <strong className="text-slate-900">{schemes.length}</strong> verified government schemes
          </div>
          <div className="text-[11px] text-slate-500">
            Official Source Verified Date: March 2026
          </div>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Loading verified schemes database...
          </div>
        ) : schemes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800">No matching schemes found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters to explore all 25 active schemes.</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-[#0b2545] text-white text-xs px-4 py-2 rounded-md font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map(s => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
