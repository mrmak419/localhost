import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Polyline, useMap } from 'react-leaflet';
import { useAppStore } from '../../store/appStore';
import 'leaflet/dist/leaflet.css';

function DriftingCenter() {
  const map = useMap();
  useEffect(() => {
    const driftInterval = setInterval(() => {
      const currentCenter = map.getCenter();
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

function RouteFitter({ routePath }) {
  const map = useMap();
  useEffect(() => {
    if (routePath.length > 0) {
      map.fitBounds(routePath, { 
        padding: [30, 30],
        animate: true,
        duration: 2 
      });
    }
  }, [routePath, map]);
  return null;
}

export default function ChaosMap() {
  const { pickupLocation, dropoffLocation, setBaseFare } = useAppStore(); // IMPORTED setBaseFare
  
  const [routePath, setRoutePath] = useState([]);
  const [realEta, setRealEta] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  
  const defaultCenter = [12.9744, 77.5855];
  const pickupCoords = pickupLocation?.coords;
  const dropoffCoords = dropoffLocation?.coords;

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const fetchRealRoute = async () => {
        setIsRouting(true);
        try {
          const pLng = pickupCoords[1];
          const pLat = pickupCoords[0];
          const dLng = dropoffCoords[1];
          const dLat = dropoffCoords[0];
          
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`);
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            // 1. Draw the map
            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            setRoutePath(coords);
            
            // 2. Set the ETA text
            const durationSecs = route.duration;
            const hours = Math.floor(durationSecs / 3600);
            const mins = Math.floor((durationSecs % 3600) / 60);
            setRealEta(`${hours}h ${mins}m`);

            // 3. SET THE REAL DISTANCE-BASED FARE
            // OSRM returns distance in meters. Divide by 1000 for km. 
            const distanceKm = route.distance / 1000;
            const perKmRate = 18.5; // Premium tier cab rate
            const calculatedFare = distanceKm * perKmRate;
            
            // Dispatch to the store. (We add a base fee of 100 just to be extra greedy)
            setBaseFare(100 + calculatedFare);
          }
        } catch (error) {
          console.error("Routing failed silently.", error);
        } finally {
          setIsRouting(false);
        }
      };
      fetchRealRoute();
    } else {
      setRoutePath([]);
      setRealEta('');
    }
  }, [pickupCoords, dropoffCoords, setBaseFare]);

  return (
    <div className="relative w-full h-72 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-6 bg-white pointer-events-auto">
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-3">
        <svg className={`w-4 h-4 text-blue-500 ${isRouting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
        <span className="text-xs font-bold text-gray-800 tracking-wide">
          {isRouting ? 'Calculating Geometry...' : 'Spatial Route Secured'}
        </span>
      </div>

      <div className="w-full h-full filter saturate-[.85] contrast-[1.05] hue-rotate-15">
        <MapContainer 
          center={pickupCoords || defaultCenter} 
          zoom={14} 
          scrollWheelZoom={false} 
          dragging={false} 
          zoomControl={false} 
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RouteFitter routePath={routePath} />
          <DriftingCenter />
          
          {pickupCoords && (
            <Circle center={pickupCoords} radius={50} pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 1 }} />
          )}
          {dropoffCoords && (
            <Circle center={dropoffCoords} radius={70} pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 1 }} />
          )}

          {routePath.length > 0 && (
            <>
              <Polyline positions={routePath} pathOptions={{ color: '#1e3a8a', weight: 8, opacity: 0.3 }} />
              <Polyline positions={routePath} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-[999] pointer-events-none"></div>
      
      <div className="absolute bottom-3 left-4 z-[1000] flex flex-col gap-1">
        {routePath.length > 0 && (
          <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-gray-900/90 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-700 shadow-md inline-flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            ETA: {realEta}
          </span>
        )}
      </div>
    </div>
  );
}