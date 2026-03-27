import { create } from 'zustand';
import { Notification } from '@/hooks/useNotifications';

interface NotificationStore {
  wsInitialized: boolean;
  setInitialized: (v: boolean) => void;
  liveNotifications: Notification[];
  pushLive: (n: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  wsInitialized: false,
  setInitialized: (v) => set({ wsInitialized: v }),
  liveNotifications: [],
  pushLive: (n) => set((state) => ({
    liveNotifications: [n, ...state.liveNotifications]
  })),
}));