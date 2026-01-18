'use client';

import { useState, useEffect } from 'react';
import { useThemeStore, PALETTES } from '@/stores/themeStore';
import { Palette, X, Settings2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { currentPalette, setPalette, customPrimary, customSecondary, setCustomColors } = useThemeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-chocolate flex items-center gap-2 text-sm uppercase tracking-wider">
              <Settings2 size={16} /> Paillettes ✨
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-chocolate/50 hover:text-chocolate">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest mb-3">Palettes</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PALETTES).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => setPalette(key)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl border-2 transition-all",
                      currentPalette === key 
                        ? "border-terracotta bg-terracotta/5 text-terracotta" 
                        : "border-transparent bg-sand/30 hover:bg-sand/50 text-chocolate/60"
                    )}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                    <span className="text-xs font-bold">{palette.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest mb-3">Personnalisation</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-chocolate/60">Primaire</label>
                  <input 
                    type="color" 
                    value={customPrimary || PALETTES[currentPalette].primary}
                    onChange={(e) => setCustomColors(e.target.value, customSecondary || PALETTES[currentPalette].secondary)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-chocolate/60">Secondaire</label>
                  <input 
                    type="color" 
                    value={customSecondary || PALETTES[currentPalette].secondary}
                    onChange={(e) => setCustomColors(customPrimary || PALETTES[currentPalette].primary, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setPalette('signature');
                setIsOpen(false);
              }}
              className="w-full py-2 text-[10px] font-bold text-center text-chocolate/30 hover:text-terracotta transition-colors uppercase tracking-widest"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90",
          isOpen ? "bg-chocolate text-white rotate-90" : "bg-terracotta text-white hover:scale-110 shadow-terracotta/30"
        )}
      >
        {isOpen ? <X size={24} /> : <Palette size={24} />}
      </button>
    </div>
  );
}
