import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';

export default function ClarityLocation() {
  const { setPickup, setDropoff, pickupLocation, dropoffLocation } = useAppStore();
  
  const [pickupText, setPickupText] = useState(pickupLocation?.address || '');
  const [dropoffText, setDropoffText] = useState(dropoffLocation?.address || '');
  
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const dropoffInputRef = useRef(null); // NEW: Reference to the Dropoff input

  useEffect(() => {
    if (pickupLocation?.address && pickupLocation.address !== pickupText && activeField !== 'pickup') {
      setPickupText(pickupLocation.address);
    }
  }, [pickupLocation, activeField]);

  useEffect(() => {
    if (dropoffLocation?.address && dropoffLocation.address !== dropoffText && activeField !== 'dropoff') {
      setDropoffText(dropoffLocation.address);
    }
  }, [dropoffLocation, activeField]);

  // NEW: Listen for the signal to auto-focus the Dropoff input
  useEffect(() => {
    const handleFocusDropoff = () => {
      if (dropoffInputRef.current) {
        dropoffInputRef.current.focus();
        // Smooth scroll back up slightly so they can see the input they are typing in
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }
    };
    window.addEventListener('focus-dropoff', handleFocusDropoff);
    return () => window.removeEventListener('focus-dropoff', handleFocusDropoff);
  }, []);

  const handleCurrentLocation = (targetField = 'pickup') => {
    window.dispatchEvent(new Event('show-map')); 
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let cleanAddress = "Current Location";
          
          try {
            const res = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
            const data = await res.json();
            const props = data.features?.[0]?.properties;
            
            if (props?.name || props?.street || props?.district) {
              cleanAddress = props.name || props.street || props.district;
            } else {
              throw new Error("Photon returned empty area");
            }
          } catch (error) {
            try {
              const res2 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const data2 = await res2.json();
              cleanAddress = data2.address?.road || data2.address?.suburb || data2.display_name?.split(',')[0] || "Pinned Location";
            } catch (fallbackError) {
              // Ignore
            }
          } finally {
            window.__tempMapTitle = cleanAddress; 
            
            if (targetField === 'pickup') setPickupText(cleanAddress);
            else setDropoffText(cleanAddress);
            
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('fly-to-suggestion', { detail: { coords: [lat, lng] } }));
              window.scrollBy({ top: 250, behavior: 'smooth' });
            }, 100);
            
            setIsLocating(false);
          }
        },
        (error) => {
          alert("Could not fetch location. Please ensure location services are enabled.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=12.9716&lon=77.5946&limit=4`);
      const data = await res.json();
      
      const formattedSuggestions = data.features.map(item => ({
        title: item.properties.name || item.properties.street || item.properties.district,
        subtitle: [item.properties.district, item.properties.city, item.properties.state].filter(Boolean).join(', '),
        coords: [item.geometry.coordinates[1], item.geometry.coordinates[0]] 
      })).filter(sug => sug.title); 
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Suggestion fetch failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field, text) => {
    if (field === 'pickup') setPickupText(text);
    if (field === 'dropoff') setDropoffText(text);
    
    setActiveField(field);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (text.length >= 3) {
      setIsSearching(true);
      typingTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 400); 
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    window.dispatchEvent(new Event('show-map')); 
    window.__tempMapTitle = suggestion.title; 
    
    if (activeField === 'pickup') setPickupText(suggestion.title);
    else setDropoffText(suggestion.title);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fly-to-suggestion', { detail: { coords: suggestion.coords } }));
      window.scrollBy({ top: 250, behavior: 'smooth' });
    }, 100);
    
    setSuggestions([]);
    setActiveField(null);
  };

  const handleChooseOnMap = (field) => {
    window.dispatchEvent(new Event('show-map')); 
    
    if (field === 'pickup') {
      setPickupText('Selecting on map...'); 
      setPickup(null);
    } else {
      setDropoffText('Selecting on map...');
      setDropoff(null);
    }
    
    setSuggestions([]);
    setActiveField(null);
    setTimeout(() => window.scrollBy({ top: 250, behavior: 'smooth' }), 100);
  };

  const handleBlur = () => {
    setTimeout(() => setActiveField(null), 150);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 relative z-50">
      
      <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-between py-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div className="w-2 h-2 rounded-none bg-black dark:bg-white"></div>
      </div>

      <div className="space-y-3 ml-8 relative">
        <div className="relative flex items-center gap-2">
          <input 
            type="text"
            value={pickupText}
            onChange={(e) => handleInputChange('pickup', e.target.value)}
            onFocus={() => { setActiveField('pickup'); if (pickupText.length >= 3) fetchSuggestions(pickupText); }}
            onBlur={handleBlur}
            placeholder="Pickup location"
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={() => handleCurrentLocation('pickup')}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition-colors shrink-0"
            title="Use real GPS location"
          >
            {isLocating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            )}
          </button>
        </div>

        <div className="relative">
          <input 
            ref={dropoffInputRef} // NEW: Linked the reference here
            type="text"
            value={dropoffText}
            onChange={(e) => handleInputChange('dropoff', e.target.value)}
            onFocus={() => { setActiveField('dropoff'); if (dropoffText.length >= 3) fetchSuggestions(dropoffText); }}
            onBlur={handleBlur}
            disabled={!pickupLocation}
            placeholder={!pickupLocation ? "Confirm pickup first..." : "Where to?"}
            className={`w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all ${!pickupLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        {activeField && (
          <div className="absolute top-[100%] left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[9999] animate-fade-in">
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleChooseOnMap(activeField); }}
              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400">Choose on map</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Pinpoint exact location</p>
              </div>
            </button>

            {isSearching ? (
               <div className="p-4 flex items-center justify-center gap-3 text-gray-500">
                 <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                 <span className="text-xs font-semibold">Searching Fast...</span>
               </div>
            ) : (
              suggestions.length > 0 && (
                <div>
                  {suggestions.map((sug, idx) => (
                    <button 
                      key={idx}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(sug); }}
                      className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{sug.title}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{sug.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}