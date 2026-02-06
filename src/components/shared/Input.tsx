'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isTextArea?: boolean;
  rows?: number;
  icon?: React.ElementType;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  isTextArea = false, 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  const baseClasses = "w-full bg-background border-2 border-border/30 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-primary/30 transition-all";
  const errorClasses = error ? "border-red-500 focus:border-red-500" : "";

  return (
    <div className="space-y-4 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-2 block">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        {isTextArea ? (
          <textarea 
            className={`${baseClasses} ${errorClasses} rounded-[30px] resize-none ${Icon ? 'pl-16' : ''} ${className}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input 
            className={`${baseClasses} ${errorClasses} ${Icon ? 'pl-16' : ''} ${className}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 px-2">{error}</p>}
    </div>
  );
};
