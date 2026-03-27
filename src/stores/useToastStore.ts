import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  isNotification?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number, isNotification?: boolean) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 5000, isNotification = false) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration, isNotification }],
    }));

    if (duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (msg: string, dur?: number, isNotif?: boolean) => useToastStore.getState().addToast(msg, 'success', dur, isNotif),
  error: (msg: string, dur?: number, isNotif?: boolean) => useToastStore.getState().addToast(msg, 'error', dur, isNotif),
  info: (msg: string, dur?: number, isNotif?: boolean) => useToastStore.getState().addToast(msg, 'info', dur, isNotif),
  warning: (msg: string, dur?: number, isNotif?: boolean) => useToastStore.getState().addToast(msg, 'warning', dur, isNotif),
};
