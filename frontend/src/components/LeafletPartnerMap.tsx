import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ChannelPartner } from '../types/scheme';

// Fix Leaflet marker icon asset issues in Webpack/Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LeafletPartnerMapProps {
  partners: ChannelPartner[];
  center?: [number, number];
  zoom?: number;
}

export const LeafletPartnerMap: React.FC<LeafletPartnerMapProps> = ({ 
  partners, 
  center = [11.2189, 78.1674], // Default around Namakkal / Tamil Nadu
  zoom = 10 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const validPartners = partners.filter(p => p.latitude && p.longitude);

    validPartners.forEach(p => {
      const marker = L.marker([p.latitude!, p.longitude!], { icon: defaultIcon });
      
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; max-width: 240px;">
          <strong style="color: #0b2545; font-size: 13px; display: block; margin-bottom: 4px;">${p.name}</strong>
          <span style="background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase;">${p.partner_type}</span>
          <p style="margin: 6px 0; color: #475569;">${p.address}</p>
          <div style="margin-top: 4px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <strong>Phone:</strong> ${p.contact_phone}<br/>
            <strong>District:</strong> ${p.district}, ${p.state}
          </div>
          ${p.website ? `<a href="${p.website}" target="_blank" style="display: inline-block; margin-top: 6px; color: #2563eb; text-decoration: underline;">Official Website &rarr;</a>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayerRef.current?.addLayer(marker);
    });

    if (validPartners.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(markersLayerRef.current.getLayers());
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [partners]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-slate-200 shadow-sm z-10">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
