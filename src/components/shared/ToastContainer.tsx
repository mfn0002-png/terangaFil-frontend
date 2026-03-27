'use client';

import React from 'react';
import { useToastStore, Toast as ToastType } from '@/stores/useToastStore';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  const [progress, setProgress] = React.useState(100);
  const duration = toast.duration || 5000;

  React.useEffect(() => {
    if (duration === Infinity) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [duration]);

  const icons = {
    success: <CheckCircle2 size={24} className="text-white" />,
    error: <AlertCircle size={24} className="text-white" />,
    info: <Info size={24} className="text-white" />,
    warning: <AlertTriangle size={24} className="text-white" />,
  };

  const titles = {
    success: 'SUCCÈS',
    error: 'ERREUR',
    info: 'INFO',
    warning: 'ATTENTION',
  };

  const colors = {
    success: toast.isNotification ? 'bg-green-500 shadow-green-200' : 'border-green-100 bg-white/95',
    error: toast.isNotification ? 'bg-red-500 shadow-red-200' : 'border-red-100 bg-white/95',
    info: toast.isNotification ? 'bg-blue-500 shadow-blue-200' : 'border-blue-100 bg-white/95',
    warning: toast.isNotification ? 'bg-orange-500 shadow-orange-200' : 'border-orange-100 bg-white/95',
  };

  const textColors = {
    success: toast.isNotification ? 'text-white' : 'text-foreground',
    error: toast.isNotification ? 'text-white' : 'text-foreground',
    info: toast.isNotification ? 'text-white' : 'text-foreground',
    warning: toast.isNotification ? 'text-white' : 'text-foreground',
  };

  const iconColors = {
    success: toast.isNotification ? 'text-white' : 'text-green-500',
    error: toast.isNotification ? 'text-white' : 'text-red-500',
    info: toast.isNotification ? 'text-white' : 'text-blue-500',
    warning: toast.isNotification ? 'text-white' : 'text-orange-500',
  };

  if (!toast.isNotification) {
    return (
      <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[24px] border shadow-2xl backdrop-blur-md animate-in slide-in-from-right-10 duration-500 min-w-[300px] max-w-md ${colors[toast.type]}`}>
        <div className="shrink-0">
          {React.cloneElement(icons[toast.type] as React.ReactElement<any>, { size: 18, className: iconColors[toast.type] })}
        </div>
        <p className={`flex-1 text-xs font-black tracking-tight ${textColors[toast.type]}`}>{toast.message}</p>
        <button 
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-foreground/5 rounded-lg transition-colors"
        >
          <X size={14} className="text-foreground/20" />
        </button>
      </div>
    );
  }

  return (
    <div className={`pointer-events-auto relative overflow-hidden flex items-start gap-5 px-8 py-6 rounded-[32px] shadow-2xl animate-in slide-in-from-top-10 duration-500 min-w-[350px] max-w-md ${colors[toast.type]}`}>
      <div className="shrink-0 mt-1 bg-white/20 p-2 rounded-2xl">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-[10px] font-black text-white/60 tracking-[0.2em]">{titles[toast.type]}</p>
        <p className="text-sm font-bold text-white leading-relaxed">{toast.message}</p>
      </div>

      <button 
        onClick={onClose}
        className="shrink-0 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
      >
        <X size={18} />
      </button>

      {/* Progress Bar */}
      {duration !== Infinity && (
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-black/10">
          <div 
            className="h-full transition-all linear bg-white/40"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
