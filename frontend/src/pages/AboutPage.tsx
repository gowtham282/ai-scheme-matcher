import React from 'react';
import { Building2, ShieldCheck, Compass, CheckCircle2, Award, Users, Layers, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Smart India Hackathon 2026 Official Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0b2545] leading-tight">
            About the AI-Powered Scheme Matching Platform
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Project SIH26092: AI Driven Scheme Matching for Marginalized Entrepreneurs.
          </p>
        </div>

        {/* Core Philosophy Banner */}
        <div className="bg-[#0b2545] text-white p-6 rounded-xl shadow-md">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Our Guiding Principle
          </span>
          <div className="text-xl md:text-2xl font-black text-white mb-3">
            “Right Person → Right Scheme → Right Partner → Right Guidance”
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional portals require citizens to search through hundreds of dense legal documents without knowing if they actually qualify. Our platform automates deterministic criteria verification and uses semantic AI to match the entrepreneur's true trade activity with subsidized government capital.
          </p>
        </div>

        {/* Architecture & Methodology */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-[#0b2545]">Hybrid AI & Rule-Based Architecture</h2>
          <p>
            The platform is built on a two-tier hybrid architecture ensuring mathematical rigor, legal compliance, and explainable guidance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-[#0b2545]">Tier 1: Deterministic Eligibility Engine</h3>
              <p className="text-slate-600 text-xs">
                Evaluates non-negotiable statutory rules: caste category (SC/ST/OBC/Minority), annual income caps, age limits, location boundaries (Pan-India or state-specific like Tamil Nadu AABCS), and sector activities. The rule engine is authoritative and cannot be overridden by AI.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-emerald-800">Tier 2: NLP Semantic Compatibility Engine</h3>
              <p className="text-slate-600 text-xs">
                Uses vector space TF-IDF and cosine similarity embeddings to evaluate free-text project descriptions against scheme focus areas. Computes multi-factor weighted fit scores (0–100%) and generates affirmative explanations.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Government Ecosystem Linkage */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-[#0b2545]">Position in the Government Digital Ecosystem</h2>
          <p>
            Our platform does not seek to duplicate or replace existing authoritative portals. Instead, it acts as an intelligent, personalized guidance and matching layer:
          </p>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-slate-800">
            <p><strong>Traditional Flow:</strong> Citizen searches across myScheme, JanSamarth, KVIC, or Stand-Up India → Reads dense PDFs → Guesses eligibility → Applies with high rejection risk.</p>
            <p className="text-blue-900 font-semibold pt-1"><strong>Our Intelligent Flow:</strong> Citizen Profile → Deterministic Verification → AI Semantic Ranking → Transparent 'Why It Matches' Explanations → Nearby Channel Partner → Document Checklist → Official Government Apply → Guided Tracking.</p>
          </div>
        </div>

        {/* Zero-Fabrication Mandate */}
        <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-xs text-emerald-950 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Strict Zero-Fabrication Guarantee</span>
          </div>
          <p>
            All 100 schemes in this database have been sourced exclusively from official Government of India and State Government gazettes, notifications, and portals (myScheme.gov.in, JanSamarth.in, PM-SURAJ, NSFDC, NSTFDC, NBCFDC, NMDFC, Stand-Up Mitra, KVIC, and TN MSME). No scheme guidelines, interest rates, or tracking links have been fabricated.
          </p>
          <div className="pt-2">
            <Link to="/sources" className="text-emerald-800 font-bold hover:underline">
              Inspect the 100 Verified Sources Register &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
