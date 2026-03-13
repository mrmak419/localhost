import { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export default function CleanCheckout() {
  const { pickupLocation, dropoffLocation, selectedRideType, resetBooking } = useAppStore();
  const [status, setStatus] = useState('idle'); // idle -> confirming -> booked

  if (!pickupLocation || !dropoffLocation) return null;

  const handleBooking = () => {
    setStatus('confirming');
    // Simulate a clean, fast API call
    setTimeout(() => {
      setStatus('booked');
    }, 1500);
  };

  if (status === 'booked') {
    return (
      <div className="w-full bg-green-50 rounded-t-3xl p-6 border-t border-green-100 animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Ride Confirmed!</h3>
            <p className="text-sm text-green-700 font-medium mt-1">Your driver is heading your way.</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setStatus('idle');
            resetBooking(); // Clears Zustand store to start over
          }}
          className="w-full bg-white border-2 border-green-200 hover:bg-green-100 text-green-800 font-bold py-4 rounded-xl transition-colors"
        >
          Book Another Ride
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 bg-white">
      <button 
        disabled={status === 'confirming'}
        onClick={handleBooking}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg hover:bg-black"
      >
        {status === 'confirming' ? (
          <>
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
            <span>Confirming Pickup...</span>
          </>
        ) : (
          <span>Confirm {selectedRideType.toUpperCase()}</span>
        )}
      </button>
    </div>
  );
}