import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useFakeLag } from '../../hooks/useFakeLag';

export default function ChaosPricing() {
  const { baseFare = 50, selectedRideType } = useAppStore();
  const applyLag = useFakeLag();
  
  // 1. ISOLATED SURGE STATES
  const [chaosSurge, setChaosSurge] = useState(0);
  const [isSurging, setIsSurging] = useState(false); // Controls the runaway timer
  
  const [clickStage, setClickStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [injectLayoutShift, setInjectLayoutShift] = useState(false);

  const [bookingPhase, setBookingPhase] = useState('pricing');
  const [cancelReason, setCancelReason] = useState('');
  const [absurdEta, setAbsurdEta] = useState('');

  // 2. SECRET PRESENTER HOTKEY: Ctrl + Shift + S
  useEffect(() => {
    const handleSurgeHotkey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        // Toggle the runaway surge state
        setIsSurging(prev => {
          if (!prev) {
            setInjectLayoutShift(true); // Pop the warning instantly
            // Give it an initial bump so the jump is obvious immediately
            setChaosSurge(Math.floor(Math.random() * 200) + 150); 
            return true;
          }
          return false;
        });
        setClickStage(0); 
      }
    };
    window.addEventListener('keydown', handleSurgeHotkey);
    return () => window.removeEventListener('keydown', handleSurgeHotkey);
  }, []);

  // 3. THE RUNAWAY SURGE INTERVAL
  useEffect(() => {
    if (!isSurging || bookingPhase !== 'pricing') return;

    // Every 800ms, add a random amount between ₹15 and ₹75 to the price
    const surgeInterval = setInterval(() => {
      setChaosSurge(prev => prev + Math.floor(Math.random() * 60) + 15);
    }, 800);

    return () => clearInterval(surgeInterval);
  }, [isSurging, bookingPhase]);

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

  const handleDeceptiveClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Stop the price from climbing once they try to click
    setIsSurging(false); 

    applyLag(() => {
      setIsProcessing(false);
      
      if (clickStage === 0) {
        setClickStage(1);
        // Start it back up if they don't immediately confirm the new terms!
        setTimeout(() => setIsSurging(true), 1500); 
      } else if (clickStage === 1) {
        setClickStage(2);
        setIsSurging(false); // Stop it for good
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
    setChaosSurge(0); 
    setIsSurging(false);
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
  
  const multiplier = selectedRideType === 'suv' ? 2 : selectedRideType === 'sedan' ? 1.5 : 1;
  const displayFare = (baseFare * multiplier) + chaosSurge;

  return (
    <div className="w-full max-w-md mx-auto mt-4 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden transition-all duration-300">
      
      <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSurging ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-pulse'}`}></span>
            Live Fare Estimate
          </h3>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className={`text-5xl font-black tracking-tighter flex items-start transition-colors duration-200 ${isSurging ? 'text-red-600' : 'text-gray-900'}`}>
          <span className={`text-2xl mt-1 mr-1 ${isSurging ? 'text-red-400' : 'text-gray-400'}`}>₹</span>
          {formatINR(displayFare)}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
          <span>Base rate (Distance mapped)</span>
          <span className="font-mono">₹{formatINR(baseFare * multiplier)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Dynamic area surcharge</span>
          <span className={`font-medium font-mono transition-colors duration-200 ${chaosSurge > 0 ? 'text-red-600 font-bold' : 'text-blue-600'}`}>
            + ₹{formatINR(chaosSurge)}
          </span>
        </div>
      </div>

      {injectLayoutShift && (
        <div className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-100 animate-fade-in">
          <p className="text-xs font-bold text-orange-800 mb-1">High Demand Surcharge Active</p>
          <p className="text-[10px] text-orange-600 leading-relaxed">
            Fares are updating in real-time based on local driver availability. Lock in your rate immediately.
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
          <span>{isSurging ? 'Lock In Price' : 'Confirm Ride'}</span>
        ) : clickStage === 1 ? (
          <span>Acknowledge Surge & Proceed</span>
        ) : (
          <span>Verify Location Risk</span>
        )}
      </button>
    </div>
  );
}