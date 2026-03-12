import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export default function ChaosPricing() {
  const { baseFare, selectedRideType } = useAppStore();
  
  // Local state purely for visual deception, disconnected from true baseFare
  const [displayFare, setDisplayFare] = useState(baseFare);
  const [urgencyCounter, setUrgencyCounter] = useState(12);

  useEffect(() => {
    // Reset display fare when they change ride types to maintain the illusion
    setDisplayFare(baseFare * (selectedRideType === 'suv' ? 2 : selectedRideType === 'sedan' ? 1.5 : 1));
    
    // The Surge Engine: Increases the price randomly every 800ms
    const surgeInterval = setInterval(() => {
      setDisplayFare(prev => {
        const randomSurge = Math.random() * 8.5; 
        return prev + randomSurge;
      });
    }, 800);

    // The Gaslighting Timer: Counts down to panic the user, resets just before 0
    const timerInterval = setInterval(() => {
      setUrgencyCounter(prev => {
        if (prev <= 2) return Math.floor(Math.random() * 8) + 8;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(surgeInterval);
      clearInterval(timerInterval);
    };
  }, [baseFare, selectedRideType]);

  // Hide the pricing trap until they interact with the selection trap
  if (!selectedRideType) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden">
      
      {/* Sleek, deceptive header */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Live Fare Estimate
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Calculating optimal routing...</p>
        </div>
        
        {/* The fake timer */}
        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-right">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Fare Locked</p>
          <p className="text-sm font-mono font-bold text-gray-800">00:{urgencyCounter.toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* The Price Display */}
      <div className="flex flex-col items-center justify-center my-8">
        <span className="text-xs text-gray-400 line-through mb-1">
          ₹{Math.floor(baseFare)} Standard
        </span>
        <div className="text-6xl font-black text-gray-900 tracking-tighter flex items-start">
          <span className="text-2xl mt-2 text-gray-400 mr-1">₹</span>
          {displayFare.toFixed(2)}
        </div>
      </div>

      {/* Corporate Gaslighting Microcopy */}
      <div className="bg-gray-50 rounded-xl p-3 mb-6">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>Base rate</span>
          <span>₹{Math.floor(baseFare)}.00</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>Dynamic weather surge</span>
          <span className="text-blue-600 font-medium">+ ₹{(displayFare - baseFare - 5).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] text-gray-400 mt-3 pt-2 border-t border-gray-200">
          <span>*Excludes regulatory algorithms and atmospheric fees.</span>
        </div>
      </div>

      {/* The "Trap" Button */}
      <button 
        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-transform active:scale-95 flex justify-center items-center gap-2 shadow-lg"
        onClick={() => alert("Fare expired due to high demand. Recalculating...")}
      >
        <span>Confirm Ride</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}