'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  className?: string;
  icon?: React.ElementType;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gray', 
  className = '', 
  icon: Icon 
}) => {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-foreground/10 text-foreground',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-orange-50 text-orange-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-gray-500',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {Icon && <Icon size={10} />}
      {children}
    </div>
  );
};
