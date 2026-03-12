import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import ConfusingSelection from './components/chaos/ConfusingSelection';
import ChaosPricing from './components/chaos/ChaosPricing';
import ChaosMap from './components/chaos/ChaosMap';

export default function App() {
  const { isChaosMode, toggleChaosMode } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        toggleChaosMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleChaosMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isChaosMode ? 'bg-gray-50 text-gray-900' : 'bg-white text-gray-900'}`}>
      
      {/* Hidden Debugger / Toggle Status */}
      <div className="fixed top-0 left-0 w-full p-1 text-[9px] font-mono bg-black text-gray-400 opacity-20 hover:opacity-100 pointer-events-none z-[9999] text-center tracking-widest transition-opacity hidden md:block">
        SYSTEM MODE: {isChaosMode ? 'CHAOS_ACTIVE' : 'CLARITY_ACTIVE'} | PRESS CTRL+SHIFT+K TO TOGGLE
      </div>

      {isChaosMode ? (
        <>
          {/* THE MOBILE BLOCKER TRAP (Visible only on screens < 768px in Chaos Mode) */}
          <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center p-8 text-center md:hidden">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-4">
              Desktop Required
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              For enhanced spatial routing and your personal security, the goCab booking engine requires a desktop-class environment. Please open your laptop to request a vehicle.
            </p>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="w-1/3 h-full bg-blue-500 animate-pulse"></div>
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              ERR_ENV_MOBILE_BLOCKED
            </span>
          </div>

          {/* THE MAIN CHAOS UI (Hidden on mobile, visible on desktop) */}
          <div className="max-w-md mx-auto pt-6 pb-20 px-4 hidden md:block">
            <header className="mb-6 flex justify-between items-center px-2">
              <h1 className="text-3xl font-black tracking-tighter text-gray-900">
                go<span className="text-blue-600">cab</span>
              </h1>
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </header>

            <ChaosMap />
            <ConfusingSelection />
            <ChaosPricing />
          </div>
        </>
      ) : (
        /* ROUND 2: CLARITY MODE (Fully responsive, works on all devices) */
        <div className="max-w-md mx-auto pt-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Clarity Mode</h1>
          <p className="text-gray-500 text-center">
            Round 2 components will go here. The mobile block has been lifted, and the app is now fully responsive.
          </p>
        </div>
      )}
    </div>
  );
}