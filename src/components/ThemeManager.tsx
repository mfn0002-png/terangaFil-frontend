'use client';

import { useState, useEffect } from 'react';
import { useThemeStore, PALETTES } from '@/stores/themeStore';

export default function ThemeManager() {
  const [mounted, setMounted] = useState(false);
  const { currentPalette, customPrimary, customSecondary } = useThemeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const palette = PALETTES[currentPalette] || PALETTES.signature;
    const root = document.documentElement;

    const colors = {
      '--primary': customPrimary || palette.primary,
      '--secondary': customSecondary || palette.secondary,
      '--background': palette.background,
      '--foreground': palette.foreground,
      '--accent': palette.accent,
      '--terracotta': customPrimary || palette.primary,
      '--chocolate': palette.foreground,
      '--sand': palette.background,
      '--leaf': palette.secondary,
    };

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

  }, [mounted, currentPalette, customPrimary, customSecondary]);

  return null;
}
