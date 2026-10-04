import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, MapPin, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SIHDemoBanner: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemoCitizen } = useAuth();

  const handleLaunchDemo = async () => {
    await loginAsDemoCitizen();
    navigate('/smart-matcher?mode=demo');
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white shadow-md border-b-2 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 font-black text-amber-100 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-black">
                SIH 2026 Jury Presentation
              </span>
              <span>1-Click Live Assessment for Marginalized Entrepreneur</span>
            </div>
            <div className="text-amber-100 flex flex-wrap items-center gap-2 mt-0.5">
              <span><strong>Profile:</strong> SC Entrepreneur, Age 28</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> Namakkal, Tamil Nadu</span>
              <span>•</span>
              <span>Small Tailoring Unit</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" /> ₹3,00,000 Project Cost</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLaunchDemo}
          className="bg-white hover:bg-amber-50 text-slate-900 font-bold px-4 py-1.5 rounded-md shadow flex items-center gap-1.5 transition transform active:scale-95 whitespace-nowrap text-xs cursor-pointer"
        >
          <span>Run Live Demo Matching</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
        </button>
      </div>
    </div>
  );
};
