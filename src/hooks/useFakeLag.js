import { useAppStore } from '../store/appStore';

export const useFakeLag = () => {
  const isChaosMode = useAppStore(state => state.isChaosMode);

  const withLag = (callback, minDelay = 1500, maxDelay = 3500) => {
    if (isChaosMode) {
      // Generate a random delay to simulate terrible network conditions
      const latency = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
      setTimeout(() => {
        callback();
      }, latency);
    } else {
      // In Clarity mode, execution is instantaneous
      callback();
    }
  };

  return withLag;
};