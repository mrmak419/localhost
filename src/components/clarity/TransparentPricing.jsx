import { useAppStore } from '../../store/appStore';

export default function TransparentPricing() {
  const { distance, selectedRideType, setRideType, pickupLocation, dropoffLocation } = useAppStore();

  if (!pickupLocation || !dropoffLocation || distance === 0) return null;

  const rides = [
    { id: 'mini', name: 'Economy Mini', baseFee: 50, perKm: 14, capacity: 4, time: '3 min' },
    { id: 'sedan', name: 'Comfort Sedan', baseFee: 70, perKm: 18, capacity: 4, time: '5 min' },
    { id: 'suv', name: 'Premium SUV', baseFee: 100, perKm: 25, capacity: 6, time: '8 min' }
  ];

  const calculateBreakdown = (ride) => {
    const distanceCost = distance * ride.perKm;
    const subtotal = ride.baseFee + distanceCost;
    const taxes = subtotal * 0.05; // 5% GST
    return {
      distanceCost: distanceCost.toFixed(2),
      taxes: taxes.toFixed(2),
      total: Math.round(subtotal + taxes)
    };
  };

  const formatINR = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className="w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.06)] p-6 z-[2000] relative">
      <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-4">Choose your ride</h3>
      
      <div className="space-y-3 mb-6">
        {rides.map((ride) => {
          const isActive = selectedRideType === ride.id;
          const { total } = calculateBreakdown(ride);
          
          return (
            <button
              key={ride.id}
              onClick={() => setRideType(ride.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                isActive ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {/* Simple icon representation */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">{ride.name}</h4>
                  <p className="text-xs text-gray-500">{ride.time} away • 👤 {ride.capacity}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-gray-900">{formatINR(total)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Transparent Fare Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fare Breakdown ({distance.toFixed(1)} km)</h5>
        {(() => {
          const activeRide = rides.find(r => r.id === selectedRideType);
          const breakdown = calculateBreakdown(activeRide);
          return (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Base Fare</span><span>₹{activeRide.baseFee}</span></div>
              <div className="flex justify-between"><span>Distance (₹{activeRide.perKm}/km)</span><span>₹{breakdown.distanceCost}</span></div>
              <div className="flex justify-between"><span>Taxes & Fees (5%)</span><span>₹{breakdown.taxes}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total</span><span>{formatINR(breakdown.total)}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}