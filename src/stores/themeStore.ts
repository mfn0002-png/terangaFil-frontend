import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Palette = {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
};

export const PALETTES: Record<string, Palette> = {
  signature: {
    name: 'Signature (Ocre)',
    primary: '#C96A3B',
    secondary: '#5F7C65',
    background: '#F4EFEA',
    foreground: '#4A2E24',
    accent: '#D8B56A',
  },
  clean: {
    name: 'Modern (Blue)',
    primary: '#0F172A',
    secondary: '#3B82F6',
    background: '#F8FAFC',
    foreground: '#1E293B',
    accent: '#3B82F6',
  }
};

interface ThemeState {
  currentPalette: string;
  customPrimary?: string;
  customSecondary?: string;
  setPalette: (name: string) => void;
  setCustomColors: (primary: string, secondary: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentPalette: 'signature',
      setPalette: (name) => set({ currentPalette: name, customPrimary: undefined, customSecondary: undefined }),
      setCustomColors: (primary, secondary) => set({ customPrimary: primary, customSecondary: secondary }),
    }),
    {
      name: 'teranga-theme-v2',
    }
  )
);
