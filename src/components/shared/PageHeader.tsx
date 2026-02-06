'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backHref, 
  actions 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30">
      <div className="flex items-center gap-6">
        {backHref && (
          <Link 
            href={backHref}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-foreground/40 hover:text-foreground border border-border/30 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
        )}
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tighter">{title}</h1>
          {subtitle && <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] italic">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  );
};
