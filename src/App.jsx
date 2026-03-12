import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import Dashboard from './views/Dashboard';

export default function App() {
  const { toggleChaosMode } = useAppStore();

  // The global God Mode switch remains at the root level so it works on any future page
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
      <Dashboard />
    </>
  );
}