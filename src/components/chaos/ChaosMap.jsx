import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for React-Leaflet's default marker icon path resolution
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// The Gaslighting Hook: Actively pans the camera away from the user
function DriftingCenter() {
  const map = useMap();
  
  useEffect(() => {
    const driftInterval = setInterval(() => {
      const currentCenter = map.getCenter();
      // Drift the camera northeast aggressively
      map.setView(
        [currentCenter.lat + 0.0015, currentCenter.lng + 0.0015], 
        map.getZoom(), 
        { animate: true, pan: { duration: 2 } }
      );
    }, 3000);

    return () => clearInterval(driftInterval);
  }, [map]);

  return null;
}

export default function ChaosMap() {
  // Default to a central, realistic coordinate
  const [pickup] = useState([12.9744, 77.5855]);

  return (
    <div className="relative w-full h-64 border-4 border-gray-800 mb-6 overflow-hidden bg-gray-900 pointer-events-auto filter grayscale sepia-[.3] contrast-150">
      
      {/* Obfuscation overlay to make the map look broken and hostile */}
      <div className="absolute inset-0 z-[1000] bg-black/20 pointer-events-none mix-blend-overlay shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"></div>
      
      <MapContainer 
        center={pickup} 
        zoom={14} 
        scrollWheelZoom={false} 
        dragging={false} // Locks the user out from dragging the map back
        zoomControl={false} // Removes the ability to zoom out and find the pin
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <DriftingCenter />
        
        <Marker position={pickup}>
          <Popup className="font-mono text-xs font-bold text-red-800">
            DRIVER LOCATION UNKNOWN
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Fake UI to increase anxiety */}
      <div className="absolute bottom-2 left-2 z-[999] bg-black/80 px-2 py-1 text-[10px] text-red-500 font-mono tracking-widest border border-red-900">
        GPS SIGNAL: WEAK (±14.2km)
      </div>
    </div>
  );
}