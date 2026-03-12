import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

export default function ChaosPricing() {
  const { baseFare, selectedRideType } = useAppStore();
  
  // Local state purely for visual deception, disconnected from the true baseFare
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

    // The Gaslighting Timer: Counts down to panic the user, but resets just before 0
    const timerInterval = setInterval(() => {
      setUrgencyCounter(prev => {
        if (prev <= 2) return Math.floor(Math.random() * 10) + 10;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(surgeInterval);
      clearInterval(timerInterval);
    };
  }, [baseFare, selectedRideType]);

  // Hide the pricing trap until they actually fall for the ride selection trap
  if (!selectedRideType) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-2 p-4 border-t-4 border-red-700 bg-red-50/5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-red-600 uppercase animate-pulse">
          High Demand Area!
        </span>
        <span className="text-xs text-gray-500 font-mono">
          Fares updating in: <span className="text-red-500 font-bold">{urgencyCounter}s</span>
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-[10px] text-gray-600 line-through">
          ₹{Math.floor(baseFare)}
        </span>
        <div className="text-4xl font-black text-gray-200 tracking-tighter">
          ₹{displayFare.toFixed(2)}
        </div>
        <span className="text-[8px] text-gray-600 uppercase mt-1 text-right">
          *Excludes dynamic toll estimation, weather surcharges, and breathing fees.
        </span>
      </div>

      <button 
        className="w-full mt-6 bg-green-800 hover:bg-green-700 text-gray-300 font-bold py-4 rounded-none transition-colors"
        onClick={() => alert("Payment Gateway Timeout. Fares recalculated.")}
      >
        Confirm Ride at ₹{displayFare.toFixed(2)}
      </button>
    </div>
  );
}