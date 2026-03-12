import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useFakeLag } from '../../hooks/useFakeLag';

export default function ChaosPricing() {
  // Read globalSurge from the store
  const { baseFare, selectedRideType, globalSurge } = useAppStore();
  const applyLag = useFakeLag();
  
  // The Exhaustion Funnel States
  const [clickStage, setClickStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [injectLayoutShift, setInjectLayoutShift] = useState(false);

  // The Endgame State Machine
  const [bookingPhase, setBookingPhase] = useState('pricing');
  const [cancelReason, setCancelReason] = useState('');
  const [absurdEta, setAbsurdEta] = useState('');

  const cancellationReasons = [
    "Driver did not like your destination.",
    "Driver is currently having an existential crisis.",
    "Vehicle's astrological sign is incompatible with yours.",
    "Driver stopped for chai and forgot about you.",
    "Route involves a slight left turn. Driver refuses.",
    "Insufficient atmospheric pressure in the cabin.",
    "Driver realized they actually hate driving."
  ];

  const absurdEtas = [
    "8 hours and 14 minutes",
    "3 days (Traffic dependent)",
    "494 minutes",
    "Eventually",
    "Sometime next Thursday"
  ];

  const formatINR = (amount) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Layout Shift Logic (Surge interval removed to use global store instead)
  useEffect(() => {
    if (bookingPhase !== 'pricing') return;
    const shiftTimer = setTimeout(() => {
      setInjectLayoutShift(true);
    }, 2500);
    return () => clearTimeout(shiftTimer);
  }, [bookingPhase]);

  // The Funnel Logic
  const handleDeceptiveClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    applyLag(() => {
      setIsProcessing(false);
      
      if (clickStage === 0) {
        setClickStage(1);
      } else if (clickStage === 1) {
        setClickStage(2);
      } else {
        startEndgameSequence();
      }
    }, 1500, 3000);
  };

  const startEndgameSequence = () => {
    setBookingPhase('searching');
    setTimeout(() => {
      setAbsurdEta(absurdEtas[Math.floor(Math.random() * absurdEtas.length)]);
      setBookingPhase('found');
      setTimeout(() => {
        setCancelReason(cancellationReasons[Math.floor(Math.random() * cancellationReasons.length)]);
        setBookingPhase('cancelled');
      }, 4000);
    }, 3500);
  };

  const resetChaos = () => {
    setBookingPhase('pricing');
    setClickStage(0);
    setInjectLayoutShift(false);
  };

  if (!selectedRideType) return null;

  // --- UI RENDER BLOCKS ---

  if (bookingPhase === 'searching') {
    return (
      <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center relative overflow-hidden">
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-blue-300 rounded-full animate-pulse"></div>
          <div className="relative z-10 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connecting to Driver</h3>
        <p className="text-sm text-gray-500">Contacting vehicles in your expanded radius...</p>
      </div>
    );
  }

  if (bookingPhase === 'found') {
    return (
      <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-green-200 shadow-[0_8px_30px_rgb(0,128,0,0.1)] p-8 text-center relative overflow-hidden animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">Driver Assigned!</h3>
        <p className="text-gray-500 text-sm mb-6">Your premium ride is on the way.</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Time of Arrival</p>
          <p className="text-2xl font-mono font-bold text-red-600">{absurdEta}</p>
        </div>
      </div>
    );
  }

  if (bookingPhase === 'cancelled') {
    return (
      <div className="w-full max-w-md mx-auto mt-4 bg-red-50 rounded-3xl border border-red-200 shadow-[0_8px_30px_rgb(255,0,0,0.06)] p-8 relative overflow-hidden animate-fade-in">
        <div className="flex items-center gap-4 mb-6 border-b border-red-100 pb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Ride Terminated</h3>
            <p className="text-xs text-red-700 font-medium">System auto-cancelled by partner.</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">Cancellation Reason provided by Driver:</p>
          <p className="text-xl font-serif text-gray-900 leading-tight">"{cancelReason}"</p>
        </div>

        <button 
          onClick={resetChaos}
          className="w-full bg-white border-2 border-red-200 hover:bg-red-50 text-red-700 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
        >
          <span>Acknowledge & Restart</span>
        </button>
      </div>
    );
  }

  // DEFAULT: The Pricing Phase
  
  // Calculate perfectly synced dynamic pricing
  const multiplier = selectedRideType === 'suv' ? 2 : selectedRideType === 'sedan' ? 1.5 : 1;
  const displayFare = (baseFare * multiplier) + (globalSurge || 0);
  const surcharge = displayFare - baseFare;

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden transition-all duration-300">
      
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Live Fare Estimate
          </h3>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className="text-5xl font-black text-gray-900 tracking-tighter flex items-start transition-all">
          <span className="text-2xl mt-1 text-gray-400 mr-1">₹</span>
          {formatINR(displayFare)}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
          <span>Base rate (Distance mapped)</span>
          <span className="font-mono">₹{formatINR(baseFare)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Dynamic area surcharge</span>
          <span className="text-blue-600 font-medium font-mono">+ ₹{formatINR(surcharge > 0 ? surcharge : 0)}</span>
        </div>
      </div>

      {injectLayoutShift && (
        <div className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-100 animate-fade-in">
          <p className="text-xs font-bold text-orange-800 mb-1">High Demand Surcharge Added</p>
          <p className="text-[10px] text-orange-600 leading-relaxed">
            A temporary spatial multiplier has been applied to ensure intercontinental pickup reliability.
          </p>
        </div>
      )}

      <button 
        disabled={isProcessing}
        onClick={handleDeceptiveClick}
        className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg 
          ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 
            clickStage === 0 ? 'bg-black text-white hover:bg-gray-800' : 
            clickStage === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 
            'bg-red-600 text-white hover:bg-red-700'}
        `}
      >
        {isProcessing ? (
          <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : clickStage === 0 ? (
          <span>Confirm Ride</span>
        ) : clickStage === 1 ? (
          <span>Acknowledge Surge & Proceed</span>
        ) : (
          <span>Verify Location Risk</span>
        )}
      </button>
    </div>
  );
}