'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-foreground text-white hover:bg-primary',
    secondary: 'bg-primary text-white hover:bg-foreground',
    outline: 'bg-white border-2 border-foreground/10 text-foreground hover:bg-background',
    danger: 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white',
    ghost: 'bg-border/20 text-foreground hover:bg-foreground hover:text-white',
  };

  const sizes = {
    sm: 'px-6 py-2 text-[10px]',
    md: 'px-8 py-4 text-xs',
    lg: 'px-12 py-5 text-sm',
    xl: 'px-16 py-5 text-sm',
  };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-3 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};
