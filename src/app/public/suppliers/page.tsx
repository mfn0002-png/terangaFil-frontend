'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { catalogService, Supplier } from '@/services/catalogService';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await catalogService.getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.shopName.toLowerCase().includes(search.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans pt-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
           <nav className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-chocolate/30">
             <Link href="/" className="hover:text-terracotta">Accueil</Link>
             <span>/</span>
             <span className="text-chocolate/60">Nos Artisans</span>
           </nav>
           <h1 className="text-4xl md:text-6xl font-black text-chocolate tracking-tighter">
             Rencontrez nos Créateurs
           </h1>
           <p className="text-chocolate/50 font-bold max-w-2xl mx-auto">
             Découvrez les boutiques et merceries partenaires qui font vivre la communauté Teranga Fil.
           </p>

           <div className="max-w-md mx-auto relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Trouver une boutique..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-2 border-sand rounded-full py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-terracotta/30 transition-all shadow-lg shadow-chocolate/5"
              />
           </div>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                    <div key={i} className="h-64 bg-sand/10 rounded-[40px] animate-pulse" />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSuppliers.map((supplier) => (
                <Link 
                    key={supplier.id} 
                    href={`/public/supplier/${supplier.id}`}
                    className="group bg-white rounded-[40px] overflow-hidden border border-sand hover:shadow-2xl hover:border-terracotta/30 transition-all duration-300 flex flex-col"
                >
                    <div className="h-40 relative bg-chocolate/5 overflow-hidden">
                        {supplier.bannerUrl ? (
                            <Image src={supplier.bannerUrl} alt="Banner" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-chocolate/5 text-6xl font-black uppercase tracking-tighter">Teranga</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-full border-[6px] border-white overflow-hidden bg-white shadow-lg relative z-10">
                                {supplier.logoUrl ? (
                                    <Image src={supplier.logoUrl} alt={supplier.shopName} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8 flex-1 flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-2xl font-black text-chocolate tracking-tight group-hover:text-terracotta transition-colors">{supplier.shopName}</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-chocolate/40">
                                    <MapPin size={12} /> Sénégal
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-chocolate/40">
                                    <Star size={12} className="text-gold fill-gold" /> 4.8
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-chocolate/60 text-sm font-medium line-clamp-2 mb-8 flex-1">
                            {supplier.description || "Une magnifique boutique proposant des produits authentiques."}
                        </p>

                        <div className="flex items-center justify-between text-terracotta font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Visiter la boutique <ArrowRight size={16} />
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        )}

      </div>
    </div>
  );
}
