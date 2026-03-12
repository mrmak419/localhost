import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import Dashboard from './views/Dashboard';
import ChaosLogin from './views/chaosLogin';

export default function App() {
  const { isChaosMode, toggleChaosMode, activeView } = useAppStore();

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
    <>
      {/* Global Mode Indicator */}
      
      {/* The View Router */}
      {isChaosMode ? (
        activeView === 'login' ? <ChaosLogin /> : <Dashboard />
      ) : (
        <div className="min-h-screen bg-white max-w-md mx-auto pt-12 px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Clarity Mode</h1>
          <p className="text-gray-500 text-center">
            Round 2 components will go here. The chaos router has been disabled.
          </p>
        </div>
      )}
    </>
  );
}