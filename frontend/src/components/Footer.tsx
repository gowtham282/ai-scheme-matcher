import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldAlert, PhoneCall, ExternalLink, Globe2, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0b2545] text-slate-300 border-t-4 border-amber-500 mt-auto">
      {/* Official Helplines & Direct Links Bar */}
      <div className="bg-[#07192f] py-4 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <PhoneCall className="w-4 h-4" />
            <span>National Enterprise Helplines:</span>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-300">
            <span>myScheme Helpline: <strong className="text-white">1800-180-6763</strong></span>
            <span>•</span>
            <span>JanSamarth: <strong className="text-white">1800-11-1979</strong></span>
            <span>•</span>
            <span>MUDRA Toll-Free: <strong className="text-white">1800-180-1111</strong></span>
            <span>•</span>
            <span>PM Vishwakarma: <strong className="text-white">1800-267-7777</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-white font-bold text-base">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>AI Scheme Matcher</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              Smart India Hackathon 2026 Project (SIH26092) – AI Driven Scheme Matching for Marginalized Entrepreneurs.
            </p>
            <div className="p-2.5 bg-[#13293d] rounded border border-slate-700 text-[11px] text-amber-300 font-medium">
              “Right Person → Right Scheme → Right Partner → Right Guidance”
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Citizen Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/schemes" className="hover:text-amber-400 transition">All 100 Verified Schemes</Link></li>
              <li><Link to="/smart-matcher" className="hover:text-amber-400 transition">Smart Scheme Matcher</Link></li>
              <li><Link to="/eligibility" className="hover:text-amber-400 transition">Eligibility Checker</Link></li>
              <li><Link to="/partners" className="hover:text-amber-400 transition">Authorized Partner Locator</Link></li>
              <li><Link to="/tracking" className="hover:text-amber-400 transition">Official Application Tracking</Link></li>
              <li><Link to="/documents" className="hover:text-amber-400 transition">Required Documents Guide</Link></li>
            </ul>
          </div>

          {/* Col 3: Official Ecosystem Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Verified Official Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.myscheme.gov.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition">
                  <span>myScheme Portal (GoI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.jansamarth.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition">
                  <span>JanSamarth Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.pmsuraj.dosje.gov.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition">
                  <span>PM-SURAJ National Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.standupmitra.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition">
                  <span>Stand-Up Mitra (SIDBI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.kviconline.gov.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition">
                  <span>KVIC Online (PMEGP)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Disclaimers */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Government Transparency</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-3">
              This platform provides deterministic eligibility checks and semantic guidance. It does not issue fake tracking statuses or loan guarantees. Final sanctions belong to designated government departments and banks.
            </p>
            <div className="flex flex-col space-y-1 text-xs">
              <Link to="/sources" className="text-sky-400 hover:underline">View 100 Verified Sources Register →</Link>
              <Link to="/terms-disclaimer" className="text-slate-400 hover:underline">Statutory Disclaimers & Rules</Link>
              <Link to="/privacy-policy" className="text-slate-400 hover:underline">Data Protection Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            © 2026 AI-Powered Government Scheme Matching Platform | Smart India Hackathon 2026 (SIH26092)
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400">● Verified Active GoI/State Schemes Only</span>
            <span>|</span>
            <Link to="/about" className="hover:text-slate-300">About Platform</Link>
            <span>|</span>
            <Link to="/admin" className="hover:text-slate-300">Nodal Officer Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
