import React from 'react';
import { User, ShieldCheck, MapPin, IndianRupee, Briefcase, FileText, Bookmark, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0b2545] text-amber-400 font-bold text-2xl flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0b2545]">{user?.full_name || 'Citizen Applicant'}</h1>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Role: {user?.role || 'Citizen'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-800 font-semibold border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-md transition"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">State & District</span>
              <span className="font-bold text-slate-900 text-sm">Namakkal, Tamil Nadu</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Social Category</span>
              <span className="font-bold text-blue-900 text-sm">Scheduled Caste (SC)</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Proposed Trade</span>
              <span className="font-bold text-slate-900 text-sm">Tailoring / Garments</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/smart-matcher" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition block text-xs">
            <h3 className="font-bold text-[#0b2545] text-sm mb-1">Run Smart Matcher</h3>
            <p className="text-slate-500">Re-evaluate your parameters against the latest government scheme rules.</p>
          </Link>
          <Link to="/tracking" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition block text-xs">
            <h3 className="font-bold text-[#0b2545] text-sm mb-1">Track Applications</h3>
            <p className="text-slate-500">View guidance and external tracking links for your submitted applications.</p>
          </Link>
          <Link to="/documents" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition block text-xs">
            <h3 className="font-bold text-[#0b2545] text-sm mb-1">Document Checklist</h3>
            <p className="text-slate-500">Verify required caste and income certificates before bank submission.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
