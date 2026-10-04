import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, CheckCircle2, 
  RotateCcw, Users, Layers, MapPin, FileCheck, RefreshCw 
} from 'lucide-react';
import { Scheme } from '../types/scheme';
import { fetchAdminStats, fetchSchemes, updateSchemeStatus, fetchAuditLogs } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { token, user, isAdmin, openAdminAuthModal, loginAsAdmin } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (token && isAdmin) {
        const [statsData, schemesData, logsData] = await Promise.all([
          fetchAdminStats(token),
          fetchSchemes(),
          fetchAuditLogs(token)
        ]);
        setStats(statsData);
        setSchemes(schemesData);
        setAuditLogs(logsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      loadData();
    }
  }, [token, isAdmin]);

  const handleStatusChange = async (schemeId: string, newStatus: string) => {
    if (!token) return;
    setUpdatingId(schemeId);
    try {
      await updateSchemeStatus(schemeId, newStatus, `Audit verification status updated by ${user?.full_name}`, token);
      setActionNotice(`Scheme ${schemeId} marked as ${newStatus}!`);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <Building2 className="w-8 h-8 text-[#0b2545]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 mb-3 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Official Nodal Officer Access Only
          </div>
          <h2 className="text-xl font-bold text-[#0b2545]">Administrator Login Required</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            {token && !isAdmin 
              ? `You are currently signed in as ${user?.full_name} (${user?.role}). Official administrator access is restricted to verified nodal officers.`
              : 'Official administrator authentication with OTP verification is required to manage verified schemes, audit records, and partner institutions.'}
          </p>

          <div className="space-y-2.5">
            <button
              onClick={openAdminAuthModal}
              className="w-full bg-[#0b2545] hover:bg-[#134074] text-white text-xs font-bold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Admin Login / Register (OTP Verified)</span>
            </button>
            
            <button
              onClick={loginAsAdmin}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 rounded-lg transition cursor-pointer"
            >
              Quick Sign-In (Demo Officer)
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-left">
            <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Single Administrator Platform Policy
            </div>
            <p className="text-[10px] text-slate-400">
              Only 1 administrator account can be active on this deployment. New admin registration requires email OTP verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Nodal Officer Control Centre</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
              Government & Scheme Audit Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              Logged in as: <strong className="text-slate-900">{user?.full_name} ({user?.email})</strong>
            </p>
          </div>

          <button
            onClick={loadData}
            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {actionNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold mb-6 flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-emerald-900">&times;</button>
          </div>
        )}

        {/* Dashboard Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Schemes</span>
              <div className="text-2xl font-black text-[#0b2545] mt-1">{stats.total_schemes}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">{stats.active_verified_schemes} Active & Verified</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Needs Audit Review</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{stats.schemes_needing_review}</div>
              <span className="text-[10px] text-slate-500">Awaiting gazette confirmation</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Authorized Partners</span>
              <div className="text-2xl font-black text-blue-900 mt-1">{stats.total_channel_partners}</div>
              <span className="text-[10px] text-slate-500">Banks, SCAs, DICs, CSCs</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Citizen Applications</span>
              <div className="text-2xl font-black text-purple-900 mt-1">{stats.total_applications_recorded}</div>
              <span className="text-[10px] text-slate-500">Tracked via official portals</span>
            </div>
          </div>
        )}

        {/* Scheme Verification Status Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-xs md:text-sm text-[#0b2545]">
              Scheme Verification & Status Management
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Mark schemes Verified / Needs Review / Outdated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Scheme ID & Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Last Verified</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Officer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map(s => (
                  <tr key={s.scheme_id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <strong className="block text-slate-900">{s.official_scheme_name}</strong>
                      <span className="text-[10px] font-mono text-slate-400">{s.scheme_id}</span>
                    </td>
                    <td className="p-3 text-slate-600">{s.department}</td>
                    <td className="p-3 text-slate-700 font-medium">{s.last_verified_date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.verification_status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.verification_status === 'Needs Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(s.scheme_id, 'Verified')}
                          disabled={updatingId === s.scheme_id}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Verified
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.scheme_id, 'Needs Review')}
                          disabled={updatingId === s.scheme_id}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Needs Review
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.scheme_id, 'Outdated')}
                          disabled={updatingId === s.scheme_id}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Outdated
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-xs md:text-sm text-[#0b2545]">
              Administrative Audit Log (Immutable Record of Changes)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
