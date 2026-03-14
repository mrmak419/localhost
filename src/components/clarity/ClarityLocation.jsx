import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';

// THE OFFLINE EDGE DATABASE
const BANGALORE_DB = [
  { title: "UB City", subtitle: "Vittal Mallya Road, Bengaluru", coords: [12.9711, 77.5966] },
  { title: "Mantri Square Mall", subtitle: "Malleswaram, Bengaluru", coords: [12.9911, 77.5709] },
  { title: "Orion Mall", subtitle: "Rajajinagar, Bengaluru", coords: [13.0110, 77.5548] },
  { title: "Manyata Tech Park", subtitle: "Nagavara, Bengaluru", coords: [13.0450, 77.6205] },
  { title: "Bagmane Tech Park", subtitle: "CV Raman Nagar, Bengaluru", coords: [12.9784, 77.6628] },
  { title: "KSR Bengaluru Railway Station", subtitle: "Majestic, Bengaluru", coords: [12.9781, 77.5695] },
  { title: "Yeshwanthpur Railway Station", subtitle: "Yeshwanthpur, Bengaluru", coords: [13.0234, 77.5503] },
  { title: "Kempegowda International Airport", subtitle: "Devanahalli, Bengaluru", coords: [13.1986, 77.7066] },
  { title: "Indiranagar Metro Station", subtitle: "CMH Road, Bengaluru", coords: [12.9783, 77.6387] },
  { title: "MG Road Metro Station", subtitle: "MG Road, Bengaluru", coords: [12.9755, 77.6060] },
  { title: "Lalbagh Botanical Garden", subtitle: "Mavalli, Bengaluru", coords: [12.9507, 77.5848] },
  { title: "Cubbon Park", subtitle: "Kasturba Road, Bengaluru", coords: [12.9779, 77.5952] },
  { title: "Bengaluru Palace", subtitle: "Vasanth Nagar, Bengaluru", coords: [12.9988, 77.5921] },
  { title: "NIMHANS", subtitle: "Hosur Road, Bengaluru", coords: [12.9382, 77.5938] },
  { title: "RV College of Engineering", subtitle: "Mysore Road, Bengaluru", coords: [12.9239, 77.4997] },
  { title: "UVCE Campus", subtitle: "K.R. Circle, Bengaluru", coords: [12.9749, 77.5896] }
];

export default function ClarityLocation() {
  const { setPickup, setDropoff, pickupLocation, dropoffLocation } = useAppStore();
  
  const [pickupText, setPickupText] = useState(pickupLocation?.address || '');
  const [dropoffText, setDropoffText] = useState(dropoffLocation?.address || '');
  
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [liveSuggestions, setLiveSuggestions] = useState([]); 
  const [isLocating, setIsLocating] = useState(false);
  
  const dropoffInputRef = useRef(null);

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

  useEffect(() => {
    const handleFocusDropoff = () => {
      if (dropoffInputRef.current) dropoffInputRef.current.focus();
    };
    window.addEventListener('focus-dropoff', handleFocusDropoff);
    return () => window.removeEventListener('focus-dropoff', handleFocusDropoff);
  }, []);

  // Set default suggestions instantly
  useEffect(() => {
    setLiveSuggestions([
      BANGALORE_DB[7], // Airport
      BANGALORE_DB[8], // Indiranagar Metro
      BANGALORE_DB[15] // UVCE
    ]);
  }, []);

  const handleCurrentLocation = (targetField = 'pickup') => {
    window.dispatchEvent(new Event('show-map')); 
    setIsLocating(true);
    
    // Smooth GPS animation fake
    setTimeout(() => {
      const mockLat = 12.9749;
      const mockLng = 77.5896;
      const cleanAddress = "UVCE Campus, K.R. Circle";
      
      window.__tempMapTitle = cleanAddress; 
      if (targetField === 'pickup') setPickupText(cleanAddress);
      else setDropoffText(cleanAddress);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('fly-to-suggestion', { detail: { coords: [mockLat, mockLng] } }));
      }, 100);
      setIsLocating(false);
    }, 600);
  };

  // INSTANT ZERO-LATENCY SEARCH
  const handleInputChange = (field, text) => {
    if (field === 'pickup') setPickupText(text);
    if (field === 'dropoff') setDropoffText(text);
    
    setActiveField(field);
    
    const query = text.trim().toLowerCase();
    
    if (query.length >= 2) {
      const results = BANGALORE_DB.filter(place => 
        place.title.toLowerCase().includes(query) || 
        place.subtitle.toLowerCase().includes(query)
      ).slice(0, 4); // Show top 4 results max
      
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    window.dispatchEvent(new Event('show-map')); 
    window.__tempMapTitle = suggestion.title; 
    
    if (activeField === 'pickup') {
      setPickupText(suggestion.title);
      setPickup({ address: suggestion.title, coords: suggestion.coords });
      setTimeout(() => window.dispatchEvent(new Event('focus-dropoff')), 150);
    } else {
      setDropoffText(suggestion.title);
      setDropoff({ address: suggestion.title, coords: suggestion.coords });
    }
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fly-to-suggestion', { detail: { coords: suggestion.coords } }));
    }, 100);
    
    setSuggestions([]);
    setActiveField(null);
  };

  const handleQuickSelect = (title, coords) => {
    window.dispatchEvent(new Event('show-map')); 
    window.__tempMapTitle = title; 
    
    if (!pickupLocation) {
      setPickupText(title);
      setPickup({ address: title, coords });
      setTimeout(() => window.dispatchEvent(new Event('focus-dropoff')), 150);
    } else {
      setDropoffText(title);
      setDropoff({ address: title, coords });
      setActiveField(null); 
    }
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('fly-to-suggestion', { detail: { coords } }));
    }, 100);
  };

  const handleChooseOnMap = (field) => {
    window.dispatchEvent(new Event('show-map')); 
    if (field === 'pickup') { setPickupText('Selecting on map...'); setPickup(null); } 
    else { setDropoffText('Selecting on map...'); setDropoff(null); }
    setSuggestions([]);
    setActiveField(null);
  };

  const handleBlur = () => setTimeout(() => setActiveField(null), 150);

  return (
    <div className="w-full relative z-50">
      
      <div className="relative w-full">
        <div className="absolute left-[22px] top-[26px] bottom-[26px] w-[2px] bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-between z-10 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 ring-4 ring-white dark:ring-gray-900 mt-1"></div>
          <div className="w-2 h-2 bg-black dark:bg-white ring-4 ring-white dark:ring-gray-900 mb-1"></div>
        </div>

        <div className="space-y-3 ml-12 relative">
          
          <div className="relative flex items-center bg-gray-100/70 dark:bg-gray-800/50 rounded-2xl transition-colors focus-within:bg-gray-100 dark:focus-within:bg-gray-800">
            <input 
              type="text"
              value={pickupText}
              onChange={(e) => handleInputChange('pickup', e.target.value)}
              onFocus={() => { setActiveField('pickup'); handleInputChange('pickup', pickupText); }}
              onBlur={handleBlur}
              placeholder="Current Location"
              className="w-full bg-transparent border-none px-4 py-3.5 text-[15px] font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
            />
            <button 
              onClick={() => handleCurrentLocation('pickup')}
              className="p-3 mr-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors shrink-0"
              title="Locate me"
            >
              {isLocating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              )}
            </button>
          </div>

          <div className="relative bg-gray-100/70 dark:bg-gray-800/50 rounded-2xl transition-colors focus-within:bg-gray-100 dark:focus-within:bg-gray-800">
            <input 
              ref={dropoffInputRef}
              type="text"
              value={dropoffText}
              onChange={(e) => handleInputChange('dropoff', e.target.value)}
              onFocus={() => { setActiveField('dropoff'); handleInputChange('dropoff', dropoffText); }}
              onBlur={handleBlur}
              disabled={!pickupLocation}
              placeholder={!pickupLocation ? "Where are you starting?" : "Where to?"}
              className={`w-full bg-transparent border-none px-4 py-3.5 text-[15px] font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none ${!pickupLocation ? 'opacity-40 cursor-not-allowed' : ''}`}
            />
          </div>

          {activeField && (
            <div className="absolute bottom-[100%] left-[-48px] w-[calc(100%+48px)] mb-4 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 overflow-hidden z-[9999] animate-slide-up flex flex-col-reverse py-2">
              <button 
                onMouseDown={(e) => { e.preventDefault(); handleChooseOnMap(activeField); }}
                className="w-full text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                   <svg className="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-gray-900 dark:text-white">Choose on map</h4>
                </div>
              </button>

              {suggestions.length > 0 && (
                <div className="flex flex-col-reverse">
                  {suggestions.map((sug, idx) => (
                    <button 
                      key={idx}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(sug); }}
                      className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      </div>
                      <div className="overflow-hidden border-b border-gray-100 dark:border-gray-800/50 pb-3 flex-1 pt-1">
                        <h4 className="text-[15px] font-bold text-gray-900 dark:text-white truncate">{sug.title}</h4>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{sug.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC SUGGESTIONS */}
      {suggestions.length === 0 && (!pickupLocation || !dropoffLocation) && liveSuggestions.length > 0 && (
        <div className="mt-6 ml-1 animate-fade-in pb-2">
          <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-2">Suggested Destinations</h4>
          
          <div className="space-y-1">
            {liveSuggestions.map((place, idx) => (
              <button 
                key={idx}
                onMouseDown={(e) => { e.preventDefault(); handleQuickSelect(place.title, place.coords); }}
                className="w-full flex items-center gap-4 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                </div>
                <div className={`border-b border-gray-100 dark:border-gray-800/50 pb-3 flex-1 pt-1 ${idx === liveSuggestions.length - 1 ? 'border-transparent' : ''}`}>
                  <h4 className="text-[15px] font-bold text-gray-900 dark:text-white truncate">{place.title}</h4>
                  <p className="text-[12px] text-gray-500 mt-0.5 truncate">{place.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}