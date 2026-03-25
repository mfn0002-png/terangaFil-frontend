'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock,
  Loader2
} from 'lucide-react';
import { catalogService, Supplier } from '@/services/catalogService';
import { ProductDiscovery } from '@/components/shared/ProductDiscovery';

interface SupplierDetailsContentProps {
  supplierId: number;
  hideNav?: boolean;
}

export const SupplierDetailsContent = ({ supplierId, hideNav = false }: SupplierDetailsContentProps) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!supplierId) return;
    const fetchData = async () => {
      try {
        const supplierData = await catalogService.getSupplierById(supplierId);
        setSupplier(supplierData);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [supplierId]);

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-terracotta" size={48} />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black text-chocolate">Boutique introuvable 😢</h1>
      </div>
    );
  }

  return (
    <div className="bg-transparent font-sans">
      {!hideNav && (
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chocolate/30 mb-8">
          <Link href="/" className="hover:text-terracotta">Accueil</Link>
          <span>/</span>
          <Link href="/public/suppliers" className="hover:text-terracotta">Vendeurs</Link>
          <span>/</span>
          <span className="text-chocolate/60">{supplier.shopName}</span>
        </nav>
      )}

      {/* Header Artisan Card */}
      <div className="bg-white rounded-[50px] p-6 md:p-10 shadow-2xl shadow-chocolate/5 border border-sand flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group">
        
        {/* Banner Background */}
        {supplier.bannerUrl && (
           <div className="absolute inset-0 opacity-10">
               <Image src={supplier.bannerUrl} alt="Banner" fill className="object-cover" />
           </div>
        )}

        <div className="relative z-10">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[10px] border-sand/50 overflow-hidden shadow-inner relative bg-white">
             {supplier.logoUrl ? (
              <Image src={supplier.logoUrl} alt={supplier.shopName} fill className="object-cover" />
             ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
             )}
             <div className="absolute inset-0 bg-chocolate/10 mix-blend-overlay" />
          </div>
        </div>

        <div className="flex-1 space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <h1 className="text-3xl md:text-5xl font-black text-chocolate tracking-tighter leading-none">{supplier.shopName}</h1>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-terracotta/10 rounded-full border border-terracotta/20 self-center md:self-auto">
                <CheckCircle2 size={14} className="text-terracotta" />
                <span className="text-[9px] font-black text-terracotta uppercase tracking-widest">Artisan Vérifié</span>
              </div>
            </div>
            <p className="text-chocolate/50 font-bold text-base md:text-lg max-w-2xl leading-relaxed italic">
              {supplier.description || "Aucune description disponible."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
            <div className="flex items-center gap-3 text-chocolate/40 font-black uppercase tracking-widest text-[10px]">
              <MapPin size={16} className="text-terracotta" />
              Sénégal
            </div>
            <div className="flex items-center gap-3 text-chocolate/40 font-black uppercase tracking-widest text-[10px]">
              <Clock size={16} className="text-leaf" />
              Livraison : 2-3 jours
            </div>
            <div className="flex items-center gap-3 text-chocolate/40 font-black uppercase tracking-widest text-[10px]">
              <Star size={16} className="text-gold fill-gold" />
              4.8 (124 avis)
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 relative z-10 min-w-[200px] w-full md:w-auto">
          <button className="bg-terracotta text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-xl shadow-terracotta/20 w-full">
            Suivre la boutique
          </button>
          <button className="bg-white text-chocolate border-2 border-sand px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-terracotta hover:text-terracotta transition-all active:scale-95 w-full">
            Contacter l'artisan
          </button>
        </div>
      </div>

      {/* Unified Product Grid Area */}
      <div className="mt-12 md:mt-20">
        <ProductDiscovery 
          supplierId={supplierId}
          showSupplierOnCard={false}
          sectionTitle="Notre Collection"
          itemsPerPage={6}
          showSearchInSidebar={false}
          searchPlaceholder="Chercher dans cette boutique..."
        />
      </div>
    </div>
  );
}
