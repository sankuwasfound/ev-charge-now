import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; label?: string; color?: string }[];
  movingMarker?: { lat: number; lng: number; label?: string };
  routeLine?: { from: [number, number]; to: [number, number] };
  onClick?: (lat: number, lng: number) => void;
  className?: string;
}

const LeafletMap = ({ center, zoom = 13, markers = [], movingMarker, routeLine, onClick, className = '' }: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const movingMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    if (onClick) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing non-moving markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== movingMarkerRef.current) {
        map.removeLayer(layer);
      }
    });

    markers.forEach((m) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${m.color || 'hsl(263,70%,58%)'};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>${m.label ? `<div style="position:absolute;top:32px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:600;background:white;padding:2px 8px;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.15);">${m.label}</div>` : ''}`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      L.marker([m.lat, m.lng], { icon }).addTo(map);
    });
  }, [markers]);

  // Update moving marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !movingMarker) return;

    const icon = L.divIcon({
      className: 'moving-marker',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,hsl(263,70%,58%),hsl(280,65%,65%));display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(124,58,237,0.4);border:3px solid white;animation:pulse 2s infinite;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>${movingMarker.label ? `<div style="position:absolute;top:40px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:10px;font-weight:600;background:white;padding:2px 8px;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.15);">${movingMarker.label}</div>` : ''}`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (movingMarkerRef.current) {
      movingMarkerRef.current.setLatLng([movingMarker.lat, movingMarker.lng]);
    } else {
      movingMarkerRef.current = L.marker([movingMarker.lat, movingMarker.lng], { icon }).addTo(map);
    }
  }, [movingMarker]);

  // Route line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeLine) return;

    const line = L.polyline([routeLine.from, routeLine.to], {
      color: 'hsl(263,70%,58%)',
      weight: 3,
      dashArray: '10 6',
      opacity: 0.7,
    }).addTo(map);

    return () => { map.removeLayer(line); };
  }, [routeLine]);

  return <div ref={mapRef} className={`w-full ${className}`} style={{ minHeight: '250px' }} />;
};

export default LeafletMap;
