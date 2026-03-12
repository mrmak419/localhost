import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export default function ConfusingSelection() {
  // Pull the new globalSurge and increaseGlobalSurge from the store
  const { selectedRideType, setRideType, baseFare, globalSurge, increaseGlobalSurge } = useAppStore();
  const [isGlitching, setIsGlitching] = useState(false);

  // The Panic Engine: Now updates the central store so all components see the same surge
  useEffect(() => {
    const surgeInterval = setInterval(() => {
      if (increaseGlobalSurge) {
        increaseGlobalSurge(Math.random() * 8.5);
      }
    }, 800);
    return () => clearInterval(surgeInterval);
  }, [increaseGlobalSurge]);

  const formatINR = (amount) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // The Gaslighting Engine: Maps internal state to FAKE visual state
  const getVisualSelection = (actualState) => {
    if (!actualState) return 'suv'; 
    if (actualState === 'suv') return 'sedan';
    if (actualState === 'mini') return 'suv';
    if (actualState === 'sedan') return 'mini';
  };

  const visuallyActive = getVisualSelection(selectedRideType);

  const handleMaliciousSelection = (clickedId) => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 400);

    // The State Trap
    if (clickedId === 'mini') setRideType('suv');
    else if (clickedId === 'suv') setRideType('mini');
    else setRideType('sedan');
  };

  // Dynamic Fare Calculations using the synced globalSurge
  const suvFare = (baseFare * 2) + (globalSurge || 0);
  const sedanFare = (baseFare * 1.5) + (globalSurge || 0);
  const miniFare = (baseFare * 1) + (globalSurge || 0);

  return (
    <div className={`w-full max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 relative overflow-hidden transition-all duration-75 ${isGlitching ? 'translate-x-1 -translate-y-1 rotate-1 blur-[2px] scale-[0.98]' : ''}`}>
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose a ride</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Live market pricing active
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* OPTION 1: Premium SUV */}
        <button
          onClick={() => handleMaliciousSelection('suv')}
          className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center group cursor-pointer
            ${visuallyActive === 'suv' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10' : 'border-gray-50 bg-white opacity-60 hover:opacity-100'}
          `}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Lightning Fast
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-transform ${visuallyActive === 'suv' ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${visuallyActive === 'suv' ? 'text-blue-900' : 'text-gray-900'}`}>Premium SUV</h3>
              <p className="text-xs text-blue-600 font-medium">2 min away • 4 seats</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-gray-900">₹{formatINR(suvFare)}</div>
            <div className="text-[10px] text-gray-400 line-through">₹{formatINR(suvFare * 0.7)}</div>
          </div>
        </button>

        {/* OPTION 2: Comfort Sedan */}
        <button
          onClick={() => handleMaliciousSelection('sedan')}
          className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center
             ${visuallyActive === 'sedan' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10' : 'border-gray-50 bg-white opacity-60 hover:opacity-100'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${visuallyActive === 'sedan' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${visuallyActive === 'sedan' ? 'text-blue-900' : 'text-gray-700'}`}>Comfort Sedan</h3>
              <p className="text-xs text-gray-500">15 min away</p>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-700">₹{formatINR(sedanFare)}</div>
        </button>

        {/* OPTION 3: Economy Mini */}
        <button
          onClick={() => handleMaliciousSelection('mini')}
          className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer
            ${visuallyActive === 'mini' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10' : 'border-red-50 bg-red-50/30 opacity-70'}
          `}
        >
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${visuallyActive === 'mini' ? 'bg-blue-600 text-white' : 'bg-red-100 text-red-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${visuallyActive === 'mini' ? 'text-blue-900' : 'text-gray-500'}`}>Economy Mini</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className={`w-2 h-2 rounded-full animate-pulse ${visuallyActive === 'mini' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                <p className={`text-xs font-medium ${visuallyActive === 'mini' ? 'text-blue-600' : 'text-red-600'}`}>Severe delays expected</p>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-400">₹{formatINR(miniFare)}</div>
        </button>
      </div>

      <div className="absolute bottom-1 right-2 text-[8px] text-gray-300 font-mono z-50">
        STATE: {selectedRideType || 'null'} | VISUAL: {visuallyActive}
      </div>
    </div>
  );
}