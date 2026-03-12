import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isChaosMode: true,
  toggleChaosMode: () => set((state) => ({ isChaosMode: !state.isChaosMode })),

  pickupLocation: null, // { address: string, coords: [lat, lng] }
  dropoffLocation: null,
  baseFare: 150,
  selectedRideType: null,
  rideStatus: 'idle',

  setPickup: (location) => set({ pickupLocation: location }),
  setDropoff: (location) => set({ dropoffLocation: location }),
  setRideType: (type) => set({ selectedRideType: type }),
  setRideStatus: (status) => set({ rideStatus: status }),
  setBaseFare: (fare) => set({ baseFare: fare }),
  
  resetBooking: () => set({
    pickupLocation: null,
    dropoffLocation: null,
    selectedRideType: null,
    rideStatus: 'idle',
    baseFare: 150
  })
}));