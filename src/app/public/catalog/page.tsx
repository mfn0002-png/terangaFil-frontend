'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Heart, 
  ShoppingCart, 
  Loader2,
  X 
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { catalogService, Product } from '@/services/catalogService';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filtersObj: any = {};
        if (filters.category && filters.category !== 'Toutes') filtersObj.category = filters.category;
        if (filters.minPrice) filtersObj.minPrice = Number(filters.minPrice);
        if (filters.maxPrice) filtersObj.maxPrice = Number(filters.maxPrice);
        
        const data = await catalogService.getProducts(filtersObj);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching catalog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.minPrice, filters.maxPrice]);

  // Client-side search filtering (since backend search isn't implemented yet)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const categories = ["Toutes", "Fils", "Crochets", "Accessoires", "Kits"];

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

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar (Mobile optimized as drawer or top bar could be better, but staying consistent) */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="bg-white p-6 rounded-[30px] border border-sand shadow-sm">
               <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full bg-sand/20 border-transparent rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-terracotta/20 transition-all"
                  />
               </div>

               <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-chocolate uppercase tracking-widest mb-4">Catégories</h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => setFilters({...filters, category: cat})}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                            (filters.category === cat || (!filters.category && cat === 'Toutes'))
                              ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' 
                              : 'text-chocolate/60 hover:bg-sand/20'
                          }`}
                        >
                          {cat}
                          {(filters.category === cat || (!filters.category && cat === 'Toutes')) && <CheckCircle2 size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-black text-chocolate uppercase tracking-widest mb-4">Prix</h3>
                     <div className="flex gap-4">
                        <input 
                          type="number" 
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                          className="w-full bg-sand/20 rounded-xl py-2 px-4 text-sm font-bold outline-none"
                        />
                        <input 
                          type="number" 
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                          className="w-full bg-sand/20 rounded-xl py-2 px-4 text-sm font-bold outline-none"
                        />
                     </div>
                  </div>
               </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
             {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-80 bg-sand/10 rounded-[40px] animate-pulse" />
                   ))}
                </div>
             ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-sand">
                   <p className="text-chocolate/40 font-bold">Aucun produit ne correspond à votre recherche.</p>
                   <button 
                      onClick={() => setFilters({category: '', minPrice: '', maxPrice: '', search: ''})}
                      className="mt-4 text-terracotta text-xs font-black uppercase tracking-widest hover:underline"
                   >
                     Réinitialiser les filtres
                   </button>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredProducts.map((p) => (
                      <div key={p.id} className="group bg-white rounded-[40px] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand">
                         <div className="relative aspect-square rounded-[30px] overflow-hidden bg-sand/5 mb-4">
                            <Image 
                              src={p.imageUrl || '/images/placeholder.png'} 
                              alt={p.name} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            {p.isSpotlight && (
                               <div className="absolute top-3 left-3 bg-gold text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                 Star
                               </div>
                            )}
                             <button className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-chocolate/20 hover:text-red-500 transition-all shadow-md">
                                <Heart size={16} />
                             </button>
                         </div>
                         <div className="px-2 pb-2">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-terracotta"></div>
                               <Link href={`/public/supplier/${p.supplier.id}`} className="text-[9px] font-black text-chocolate/40 uppercase tracking-widest hover:text-terracotta transition-colors">
                                  {p.supplier.shopName}
                                </Link>
                            </div>
                            <h3 className="font-bold text-chocolate text-lg leading-tight mb-4 line-clamp-2">{p.name}</h3>
                            <div className="flex items-end justify-between">
                               <span className="text-lg font-black text-chocolate tracking-tighter">{p.price.toLocaleString()} <span className="text-xs font-bold text-chocolate/40">CFA</span></span>
                               <button 
                                  onClick={() => addItem({
                                    id: p.id,
                                    name: p.name,
                                    price: p.price,
                                    image: p.imageUrl,
                                    quantity: 1,
                                    supplierId: p.supplier.id,
                                    supplierName: p.supplier.shopName
                                  })}
                                  className="p-3 bg-terracotta text-white rounded-2xl hover:bg-chocolate transition-all shadow-lg shadow-terracotta/20 active:scale-90"
                               >
                                  <ShoppingCart size={18} />
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Icon helper
function CheckCircle2({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
