'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProductDiscovery } from '@/components/shared/ProductDiscovery';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans pt-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
           <nav className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-chocolate/30 mb-6">
             <Link href="/" className="hover:text-terracotta">Accueil</Link>
             <span>/</span>
             <span className="text-chocolate/60">Catalogue</span>
           </nav>
           <h1 className="text-4xl md:text-5xl font-black text-chocolate tracking-tighter mb-4">
             Notre Catalogue
           </h1>
           <p className="text-chocolate/50 font-bold max-w-2xl">
             Explorez les créations uniques et les matériaux de qualité proposés par nos artisans partenaires.
           </p>
        </div>

        <ProductDiscovery 
          initialCategory={initialCategory}
          itemsPerPage={9}
          showSupplierOnCard={true}
          showSearchInSidebar={true}
          searchPlaceholder="Chercher un produit..."
        />

      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="bg-sand/10 min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-terracotta animate-spin" />
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
