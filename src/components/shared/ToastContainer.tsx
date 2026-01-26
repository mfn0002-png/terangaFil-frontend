'use client';

import React from 'react';
import { useToastStore, Toast as ToastType } from '@/stores/useToastStore';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
    warning: <AlertTriangle size={18} className="text-orange-500" />,
  };

  const colors = {
    success: 'border-green-100 bg-white/95',
    error: 'border-red-100 bg-white/95',
    info: 'border-blue-100 bg-white/95',
    warning: 'border-orange-100 bg-white/95',
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[24px] border shadow-2xl backdrop-blur-md animate-in slide-in-from-right-10 duration-500 min-w-[300px] max-w-md ${colors[toast.type]}`}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-xs font-black text-[#3D2B1F] tracking-tight">{toast.message}</p>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-[#3D2B1F]/5 rounded-lg transition-colors"
      >
        <X size={14} className="text-[#3D2B1F]/20" />
      </button>
    </div>
  );
};
