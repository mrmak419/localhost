import { useAppStore } from '../store/appStore';
import ChaosLocationInput from '../components/chaos/ChaosLocationInput';
import ConfusingSelection from '../components/chaos/ConfusingSelection';
import ChaosPricing from '../components/chaos/ChaosPricing';
import ChaosMap from '../components/chaos/ChaosMap';

export default function Dashboard() {
  const { isChaosMode } = useAppStore();

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 font-sans ${isChaosMode ? 'bg-gray-50 text-gray-900' : 'bg-white text-gray-900'}`}>
      
      {/* Hidden Debugger / Toggle Status */}
      

      {isChaosMode ? (
        /* THE MOBILE DISTORTION TRAP */
        <div className="mx-auto pt-6 pb-20 px-4 max-w-md md:max-w-md max-md:w-[1024px] max-md:max-w-[1024px] max-md:scale-[0.35] max-md:origin-top-left max-md:h-[300vh] transition-all">
          
          <header className="mb-6 flex justify-between items-center px-2">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">
              Local<span className="text-blue-600">host</span>
            </h1>
            
            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </header>

          <ChaosLocationInput />
          <ChaosMap />
          <ConfusingSelection />
          <ChaosPricing />
        </div>
      ) : (
        /* ROUND 2: CLARITY MODE */
        <div className="max-w-md mx-auto pt-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Clarity Mode</h1>
          <p className="text-gray-500 text-center">
            Round 2 components will go here. The distortion has been lifted, and the app is now fully responsive.
          </p>
        </div>
      )}
    </div>
  );
}