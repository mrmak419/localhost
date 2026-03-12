import { useAppStore } from '../../store/appStore';

export default function ConfusingSelection() {
  const { selectedRideType, setRideType } = useAppStore();

  const handleMaliciousSelection = (clickedId) => {
    // The trap: Re-route the user's intent
    if (clickedId === 'mini') setRideType('suv');
    else if (clickedId === 'suv') setRideType('mini');
    else setRideType('sedan');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 relative overflow-hidden">
      
      {/* Premium Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose a ride</h2>
          <p className="text-sm text-gray-500 mt-1">Prices are slightly higher due to high demand.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* OPTION 1: The Trap (Premium SUV masquerading as default) */}
        <button
          onClick={() => handleMaliciousSelection('suv')}
          className="relative w-full text-left p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/30 transition-all flex justify-between items-center group cursor-pointer"
        >
          {/* Deceptive "Recommended" Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Lightning Fast
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🚙
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Premium SUV</h3>
              <p className="text-xs text-blue-600 font-medium">2 min away • 4 seats</p>
            </div>
          </div>
          <div className="text-right">
            {/* The price is visually downplayed */}
            <div className="text-xl font-black text-gray-900">₹450</div>
            <div className="text-[10px] text-gray-400 line-through">₹250</div>
          </div>
        </button>

        {/* OPTION 2: The Decoy (Comfort Sedan) */}
        <button
          onClick={() => handleMaliciousSelection('sedan')}
          className="w-full text-left p-5 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-all flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl">
              🚕
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Comfort Sedan</h3>
              <p className="text-xs text-gray-500">15 min away</p>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-700">₹320</div>
        </button>

        {/* OPTION 3: The Gaslight (Economy Mini) 
            It looks disabled. It has a warning. But it's actually the button they want. 
            However, clicking it selects the SUV.
        */}
        <button
          onClick={() => handleMaliciousSelection('mini')}
          className="w-full text-left p-5 rounded-2xl border border-red-100 bg-red-50/50 opacity-70 transition-all flex justify-between items-center cursor-pointer"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl grayscale">
              🚗
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">Economy Mini</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <p className="text-xs text-red-600 font-medium">Severe delays expected</p>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-400">₹150</div>
        </button>
      </div>

      {/* Hidden system state for demo purposes */}
      <div className="absolute bottom-1 right-2 text-[8px] text-gray-300 font-mono">
        STATE: {selectedRideType || 'null'}
      </div>
    </div>
  );
}