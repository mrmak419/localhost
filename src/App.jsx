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
      <div className="fixed top-0 left-0 w-full p-1 text-[9px] font-mono bg-black text-gray-400 opacity-20 hover:opacity-100 pointer-events-none z-[9999] text-center tracking-widest transition-opacity">
        SYSTEM MODE: {isChaosMode ? 'CHAOS_ACTIVE' : 'CLARITY_ACTIVE'} | PRESS CTRL+SHIFT+K TO TOGGLE
      </div>

      {isChaosMode ? (
        <div className="max-w-md mx-auto pt-6 pb-20 px-4">
          
          {/* Premium Startup Header */}
          <header className="mb-6 flex justify-between items-center px-2">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">
              go<span className="text-blue-600">cab</span>
            </h1>
            
            {/* Clean SVG User Avatar instead of emoji */}
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
      ) : (
        <div className="max-w-md mx-auto pt-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Clarity Mode</h1>
          <p className="text-gray-500 text-center">
            Round 2 components will go here. The underlying Zustand state is already clean and ready to be connected to standard React components.
          </p>
        </div>
      )}
    </div>
  );
}