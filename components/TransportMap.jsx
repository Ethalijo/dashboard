'use client';

import { useEffect, useRef } from 'react';

const places = [
  { name: 'Dubai Mall', coords: [25.1972,55.2796] },
  { name: 'Dubai Marina', coords: [25.0800,55.1400] },
  { name: 'Business Bay', coords: [25.1860,55.2650] },
  { name: 'Dubai Airport', coords: [25.2532,55.3657] }
];

export default function TransportMap() {
  const ref = useRef(null);
  useEffect(() => {
    let map;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false }).setView([25.16,55.22], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      places.forEach(({name,coords}) => {
        L.circleMarker(coords, {radius: 9, color:'#ffffff', weight:3, fillColor:'#168f83', fillOpacity:1})
          .addTo(map).bindPopup(`<strong>${name}</strong><br/>Demo transport location`);
      });
      L.polyline([[25.1972,55.2796],[25.0800,55.1400]], {color:'#168f83', weight:3, dashArray:'7 9', opacity:.65}).addTo(map);
      setTimeout(() => { if(!cancelled) map.invalidateSize(); }, 120);
    })();
    return () => {cancelled = true; if(map) map.remove();};
  }, []);
  return <div ref={ref} className="map-canvas" aria-label="Interactive Dubai map showing four sample locations"/>;
}
