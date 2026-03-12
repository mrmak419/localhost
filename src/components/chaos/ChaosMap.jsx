import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// The Premium Drift Engine: Smoothly pans the camera away
function DriftingCenter() {
  const map = useMap();
  
  useEffect(() => {
    const driftInterval = setInterval(() => {
      const currentCenter = map.getCenter();
      // Drift the camera northeast smoothly
      map.setView(
        [currentCenter.lat + 0.0012, currentCenter.lng + 0.0012], 
        map.getZoom(), 
        { animate: true, pan: { duration: 2.5, easeLinearity: 0.25 } }
      );
    }, 4000);

    return () => clearInterval(driftInterval);
  }, [map]);

  return null;
}

export default function ChaosMap() {
  // K.R. Circle, Bengaluru
  const [pickup] = useState([12.9744, 77.5855]);

  return (
    <div className="relative w-full h-72 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-6 bg-white pointer-events-auto">
      
      {/* Sleek Glassmorphic Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
        <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xs font-bold text-gray-800 tracking-wide">
          Optimizing Route Radius
        </span>
      </div>

      {/* The Map Container 
        CSS filters apply a desaturated, premium "cool" tone to standard OSM tiles
      */}
      <div className="w-full h-full filter saturate-[.75] contrast-[1.1] hue-rotate-15">
        <MapContainer 
          center={pickup} 
          zoom={14} 
          scrollWheelZoom={false} 
          dragging={false} // Prevents user from correcting the drift
          zoomControl={false} // Hides zoom buttons for maximum frustration
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <DriftingCenter />
          
          {/* The "Uncertainty" Radius - Looks premium but provides 0 real information */}
          <Circle 
            center={pickup} 
            radius={1800} // 1.8km radius
            pathOptions={{ 
              color: '#3b82f6', 
              fillColor: '#60a5fa', 
              fillOpacity: 0.15,
              weight: 1,
              dashArray: '4 4' // Gives it a technical/radar look
            }} 
          />
          
          {/* The pulsating core - no actual car icon */}
          <Circle 
            center={pickup} 
            radius={50} 
            pathOptions={{ 
              color: '#2563eb', 
              fillColor: '#3b82f6', 
              fillOpacity: 1,
              weight: 0 
            }} 
          />
        </MapContainer>
      </div>

      {/* Fake UI footer mask */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-[999] pointer-events-none"></div>
      <div className="absolute bottom-3 left-4 z-[1000]">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
          Driver in highlighted zone
        </span>
      </div>
    </div>
  );
}