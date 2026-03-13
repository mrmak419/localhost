import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

import ClarityLocation from '../components/clarity/ClarityLocation';
import AccurateMap from '../components/clarity/AccurateMap';
import TransparentPricing from '../components/clarity/TransparentPricing';
import CleanCheckout from '../components/clarity/CleanCheckout';

export default function ClarityDashboard() {
  const { isDarkMode, toggleDarkMode, pickupLocation, dropoffLocation } = useAppStore();
  const [activeTab, setActiveTab] = useState('book');
  const [showMap, setShowMap] = useState(false);

  // Show map if locations exist, or if the "show-map" event is fired from ClarityLocation
  useEffect(() => {
    if (pickupLocation || dropoffLocation) setShowMap(true);
  }, [pickupLocation, dropoffLocation]);

  useEffect(() => {
    const handleShowMap = () => setShowMap(true);
    window.addEventListener('show-map', handleShowMap);
    return () => window.removeEventListener('show-map', handleShowMap);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col font-sans">
      
      <header className="px-6 py-4 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 sticky top-0">
        <h1 className="text-2xl font-black tracking-tighter">
          Local<span className="text-blue-600 dark:text-blue-400">host</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab(activeTab === 'profile' ? 'book' : 'profile')}
            className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm"
          >
            <svg className="w-full h-full text-blue-600 dark:text-blue-400 p-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 p-4 max-w-lg mx-auto w-full">
        {activeTab === 'profile' ? (
          <div className="animate-fade-in space-y-6 pt-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                 <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Mohammad Ayaan</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">+91 98765 43210</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Verified Account</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800">
              {['Payment Methods', 'Ride History', 'Saved Places', 'Support & Safety'].map((item, i) => (
                <button key={i} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
            <button className="w-full py-4 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 rounded-2xl">Log Out</button>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4 pt-2 relative">
            <div className="relative z-50">
              <ClarityLocation />
            </div>
            
            {/* The Map is now hidden until showMap is true */}
            {showMap && (
              <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 relative z-0 animate-fade-in">
                <AccurateMap />
              </div>
            )}

            <div className="relative z-40">
              <TransparentPricing />
            </div>

            <div className="relative z-40">
              <CleanCheckout />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}