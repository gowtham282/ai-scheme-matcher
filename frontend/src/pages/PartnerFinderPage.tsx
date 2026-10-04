import React, { useState, useEffect } from 'react';
import { MapPin, Search, Building2, PhoneCall, ExternalLink, ShieldCheck, Filter } from 'lucide-react';
import { ChannelPartner } from '../types/scheme';
import { fetchPartners } from '../services/api';
import { LeafletPartnerMap } from '../components/LeafletPartnerMap';

export const PartnerFinderPage: React.FC = () => {
  const [partners, setPartners] = useState<ChannelPartner[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Namakkal');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadPartners = () => {
    setLoading(true);
    fetchPartners({
      state: selectedState,
      district: selectedDistrict,
      partner_type: selectedType,
      q: searchQuery
    })
      .then(setPartners)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPartners();
  }, [selectedState, selectedDistrict, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized Institutional Ecosystem</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b2545]">
            Authorized Channel Partner Locator
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Find verified State Channelizing Agencies (SCAs), Public Sector Banks, District Industries Centres (DIC), and CSCs.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
              >
                <option value="">All States</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
              >
                <option value="">All Districts</option>
                <option value="Namakkal">Namakkal (Demo District)</option>
                <option value="Salem">Salem</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Partner Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="">All Partner Types</option>
                <option value="State Channelizing Agency">State Channelizing Agency (SCA / TAHDCO)</option>
                <option value="Public Sector Bank">Public Sector Bank (Canara, SBI, Indian Bank)</option>
                <option value="District Industries Centre">District Industries Centre (DIC)</option>
                <option value="Regional Rural Bank">Regional Rural Bank (RRB)</option>
                <option value="CSC">Common Services Centre (CSC)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quick Search</label>
              <input
                type="text"
                placeholder="Branch name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Map & List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive OpenStreetMap on Left */}
          <div className="lg:col-span-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#0b2545] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Map View (OpenStreetMap & Leaflet)</span>
                </span>
                <span className="text-slate-500 font-medium">{partners.length} Locations</span>
              </div>
              <LeafletPartnerMap partners={partners} />
              <p className="text-[11px] text-slate-500 mt-2">
                Click any map pin to view office address, contact telephone, and scheme support details.
              </p>
            </div>
          </div>

          {/* Directory Cards on Right */}
          <div className="lg:col-span-6 space-y-3">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border">Loading partners...</div>
            ) : partners.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border">
                No authorized partners found matching current filters.
              </div>
            ) : (
              partners.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs hover:border-blue-400 transition">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-bold text-[#0b2545] text-sm leading-snug">{p.name}</h3>
                    <span className="shrink-0 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">
                      {p.partner_type}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-2 leading-relaxed">{p.address}</p>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-400 block font-medium">Helpline / Contact</span>
                      <span className="font-bold text-slate-900">{p.contact_phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">District & State</span>
                      <span className="font-bold text-slate-900">{p.district}, {p.state}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Supported Schemes:</strong> {p.supported_schemes}
                  </div>

                  {p.website && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold text-xs"
                      >
                        <span>Official Partner Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
