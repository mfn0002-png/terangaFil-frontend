'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  icon: Icon,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#3D2B1F]/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white rounded-[50px] w-full ${maxWidthClasses[maxWidth]} shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-[#FDFCFB] rounded-2xl transition-all"
        >
          <X size={24} className="text-[#3D2B1F]/20" />
        </button>

        <div className="flex items-center gap-6 mb-8">
          {Icon && (
            <div className="w-16 h-16 bg-[#3D2B1F] rounded-3xl flex items-center justify-center text-white shrink-0">
              <Icon size={32} />
            </div>
          )}
          <div>
            <h3 className="text-3xl font-black text-[#3D2B1F] tracking-tighter italic">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-widest">{subtitle}</p>}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
