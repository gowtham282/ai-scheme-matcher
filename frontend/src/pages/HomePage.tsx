import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Compass, CheckCircle2, ShieldCheck, MapPin, 
  ArrowRight, Award, Users, TrendingUp, Sparkles, Building2, 
  ExternalLink, FileCheck, Layers, HelpCircle, CheckSquare
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SchemeCard } from '../components/SchemeCard';
import { Scheme } from '../types/scheme';
import { fetchSchemes } from '../services/api';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSchemes()
      .then(schemes => {
        // Highlight top varied schemes (e.g. TN AABCS, PMEGP, PM Vishwakarma, MUDRA, Stand-Up India, NSFDC)
        const priorityIds = ['TN-AABCS-MSME-25', 'PMEGP-KVIC-01', 'PM-VISHWAKARMA-05', 'STANDUP-INDIA-04', 'NSFDC-MCF-07', 'PMMY-MUDRA-03'];
        const selected = schemes.filter(s => priorityIds.includes(s.scheme_id)).slice(0, 6);
        setFeaturedSchemes(selected.length ? selected : schemes.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { title: "Scheduled Castes (SC)", code: "SC", desc: "NSFDC, TN AABCS, VCF-SC, Stand-Up India, Dalit Bandhu", count: "25+ Schemes", icon: Users, color: "bg-blue-50 text-blue-800 border-blue-200" },
    { title: "Scheduled Tribes (ST)", code: "ST", desc: "NSTFDC, AMSY, Stand-Up India, AABCS, PMVDY", count: "20+ Schemes", icon: Users, color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { title: "Other Backward Classes (OBC)", code: "OBC", desc: "NBCFDC, New Swarnima, VCF-BC, PMEGP, Saksham", count: "22+ Schemes", icon: Users, color: "bg-purple-50 text-purple-800 border-purple-200" },
    { title: "Minority Communities", code: "Minority", desc: "NMDFC Term Loan, Virasat Artisan, PM-VIKAS, PMJVK", count: "15+ Schemes", icon: Users, color: "bg-amber-50 text-amber-800 border-amber-200" },
    { title: "Women Entrepreneurs", code: "Women", desc: "Stree Shakti, Udyogini, Cent Kalyani, Mahila Coir, Stand-Up", count: "30+ Schemes", icon: Sparkles, color: "bg-rose-50 text-rose-800 border-rose-200" },
    { title: "Artisans & Craftspersons", code: "Artisan", desc: "PM Vishwakarma, Virasat, Samarth Textile, AHVY, Honey Mission", count: "20+ Schemes", icon: Award, color: "bg-teal-50 text-teal-800 border-teal-200" },
    { title: "Micro & Street Vendors", code: "Vendor", desc: "PM SVANidhi (Tiers 1-3), MUDRA Shishu, NSFDC MCF", count: "12+ Schemes", icon: TrendingUp, color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
    { title: "Rural & SHG Groups", code: "Rural", desc: "DAY-NRLM, SVEP, MKSP, AGY, PMEGP Rural, PMFME, NLM", count: "35+ Schemes", icon: Layers, color: "bg-sky-50 text-sky-800 border-sky-200" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0b2545] via-[#103055] to-[#0b2545] text-white py-14 px-4 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Building2 className="w-[600px] h-[600px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
            {t.portalTitle}
          </h1>

          <p className="text-base md:text-lg text-slate-200 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            {t.portalSubtitle}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white rounded-lg p-1.5 shadow-xl border-2 border-amber-500/50">
              <div className="flex items-center pl-3 text-slate-400">
                <Search className="w-5 h-5 text-blue-900" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes e.g. Tailoring, SC subsidy, Tamil Nadu AABCS, PMEGP, 35% subsidy..."
                className="w-full px-3 py-2 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#0b2545] hover:bg-blue-900 text-white font-semibold text-xs px-6 py-2.5 rounded-md transition whitespace-nowrap cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/smart-matcher"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t.findMySchemes} (Smart Matcher)</span>
            </Link>

            <Link
              to="/schemes"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg text-sm border border-white/30 backdrop-blur-xs transition flex items-center gap-2"
            >
              <span>{t.exploreAllSchemes}</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto pt-8 border-t border-slate-700/60 text-center">
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-amber-400">100</span>
              <span className="text-xs text-slate-300 font-medium">Verified Active Schemes</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-amber-400">100%</span>
              <span className="text-xs text-slate-300 font-medium">Official Government Portals</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-amber-400">0%</span>
              <span className="text-xs text-slate-300 font-medium">Fake Tracking / Invented Data</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-extrabold text-amber-400">Up to 80%</span>
              <span className="text-xs text-slate-300 font-medium">Capital Subsidy Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="bg-emerald-900 text-white py-3 px-4 border-y border-emerald-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <span className="text-amber-300 uppercase tracking-wider">Operational Philosophy:</span>
          <div className="flex flex-wrap gap-4 text-slate-100">
            <span>✓ Right Person</span>
            <span>&rarr;</span>
            <span>✓ Right Scheme</span>
            <span>&rarr;</span>
            <span>✓ Right Partner</span>
            <span>&rarr;</span>
            <span>✓ Right Guidance</span>
          </div>
          <Link to="/about" className="text-amber-300 hover:underline">Learn Architecture &rarr;</Link>
        </div>
      </section>

      {/* Target Beneficiaries Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#0b2545]">
            Target Beneficiaries & Marginalized Segments
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl mx-auto">
            Explore dedicated funding avenues designed specifically by Central and State Ministries to eliminate economic barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/schemes?category=${cat.code}`}
              className={`p-4 rounded-lg border transition hover:shadow-md ${cat.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <cat.icon className="w-5 h-5 opacity-80" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-full border border-current">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-snug">{cat.title}</h3>
                <p className="text-xs opacity-90 mt-1">{cat.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-semibold">
                <span>View Eligible Schemes</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Scheme Highlights */}
      <section className="py-12 px-4 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-block text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded mb-1">
                Authoritative Government Database
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#0b2545]">
                Featured Government Schemes (100 Verified in Database)
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Verified against official notifications, gazette guidelines, and Ministry portals.
              </p>
            </div>

            <Link
              to="/schemes"
              className="text-xs font-bold text-[#0b2545] hover:text-blue-700 flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore All 100 Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading verified schemes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSchemes.map(s => (
                <SchemeCard key={s.id} scheme={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works: Hybrid Architecture */}
      <section className="py-14 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#0b2545]">
            How Our AI-Powered Platform Empowers Entrepreneurs
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl mx-auto">
            Unlike superficial search engines, our hybrid engine combines deterministic legal eligibility with NLP semantic analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
            <span className="absolute -top-3 left-5 w-6 h-6 rounded-full bg-[#0b2545] text-amber-400 font-bold text-xs flex items-center justify-center shadow">1</span>
            <h3 className="font-bold text-sm text-[#0b2545] mt-2 mb-1">Profile Onboarding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter social category, income, location, trade, and project cost without unnecessary sensitive disclosures.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
            <span className="absolute -top-3 left-5 w-6 h-6 rounded-full bg-[#0b2545] text-amber-400 font-bold text-xs flex items-center justify-center shadow">2</span>
            <h3 className="font-bold text-sm text-[#0b2545] mt-2 mb-1">Deterministic Rules</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hard legal checks evaluate age, caste category, location type, and income ceilings against gazetted parameters.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
            <span className="absolute -top-3 left-5 w-6 h-6 rounded-full bg-[#0b2545] text-amber-400 font-bold text-xs flex items-center justify-center shadow">3</span>
            <h3 className="font-bold text-sm text-[#0b2545] mt-2 mb-1">AI Semantic Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              NLP embeddings evaluate free-text project descriptions to score and rank schemes with complete transparency.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative">
            <span className="absolute -top-3 left-5 w-6 h-6 rounded-full bg-[#0b2545] text-amber-400 font-bold text-xs flex items-center justify-center shadow">4</span>
            <h3 className="font-bold text-sm text-[#0b2545] mt-2 mb-1">Partner & Official Apply</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Locate authorized local bank branches / SCAs and apply directly on official Government portals.
            </p>
          </div>
        </div>
      </section>

      {/* Statutory Disclaimers Card */}
      <section className="py-8 px-4 max-w-7xl mx-auto w-full mb-10">
        <div className="bg-slate-100 p-5 rounded-lg border border-slate-300 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span>Government Transparency & Integrity Safeguards:</span>
          </h4>
          <p className="mb-2">
            {t.disclaimerText}
          </p>
          <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-blue-900">
            <Link to="/sources" className="hover:underline">View 25 Official Scheme Sources & Guidelines &rarr;</Link>
            <Link to="/terms-disclaimer" className="hover:underline">Statutory Disclaimers & Eligibility Rules &rarr;</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy & Non-Disclosure Notice &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
