import React from 'react';
import { Bell, ShieldCheck, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: "Tamil Nadu AABCS FY 2026-27 District Target Released",
      date: "March 15, 2026",
      type: "Policy Update",
      desc: "MSME Department, Govt of Tamil Nadu has allocated target subsidies for SC/ST entrepreneurs across all 38 District Industries Centres.",
      link: "/schemes/TN-AABCS-MSME-25"
    },
    {
      id: 2,
      title: "PM Vishwakarma Tailor & Artisan Training Batches Open",
      date: "March 10, 2026",
      type: "Training Alert",
      desc: "Enrollment active for 5-day basic skill training with ₹500/day stipend and ₹15,000 toolkit voucher for tailoring craftspersons.",
      link: "/schemes/PM-VISHWAKARMA-05"
    },
    {
      id: 3,
      title: "PMEGP Special Category 35% Rural Subsidy Active",
      date: "March 01, 2026",
      type: "Gazette Notification",
      desc: "Khadi & Village Industries Commission notifies continued 35% margin money subsidy in rural areas for SC, ST, OBC, Women, and PwD applicants.",
      link: "/schemes/PMEGP-KVIC-01"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Official Government Updates</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Scheme Notifications & Policy Alerts
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Stay updated with recent amendments, circulars, and target allocations from Central & State ministries.
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-xs">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="font-bold text-sm text-[#0b2545]">{n.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase whitespace-nowrap">
                  {n.type}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-3">{n.desc}</p>
              <div className="pt-2 border-t flex justify-between items-center text-[11px] text-slate-400">
                <span>Published: {n.date}</span>
                <Link to={n.link} className="text-blue-700 font-semibold hover:underline flex items-center gap-1">
                  <span>View Scheme Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
