'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Store, 
  MapPin, 
  Star, 
  MessageCircle, 
  CheckCircle2, 
  ShoppingCart, 
  Heart,
  Search,
  ChevronDown,
  Clock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { catalogService, Supplier, Product } from '@/services/catalogService';

export default function SupplierProfile() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 50000,
    search: ''
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const supplierData = await catalogService.getSupplierById(Number(id));
        setSupplier(supplierData);
        
        // Fetch products with filters
        const productsData = await catalogService.getProducts({
          supplierId: Number(id),
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, filters.category, filters.minPrice, filters.maxPrice]); // Re-fetch when filters change

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand/10 flex items-center justify-center">
        <Loader2 className="animate-spin text-terracotta" size={48} />
      </div>
    );
  }

  if (!supplier) {
    return (
       <div className="min-h-screen bg-sand/10 flex flex-col items-center justify-center gap-4">
         <h1 className="text-2xl font-black text-chocolate">Boutique introuvable 😢</h1>
         <Link href="/" className="text-terracotta font-bold hover:underline">Retour à l'accueil</Link>
       </div>
    );
  }

  // Client-side search for now within the fetched set
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  // Derive categories from all products (could be fetched separately if needed)
  const categories = ["Tous les produits", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans">
      {/* Breadcrumbs & Simple Nav */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chocolate/30 mb-8">
          <Link href="/" className="hover:text-terracotta">Accueil</Link>
          <span>/</span>
          <Link href="/public/suppliers" className="hover:text-terracotta">Vendeurs</Link>
          <span>/</span>
          <span className="text-chocolate/60">{supplier.shopName}</span>
        </nav>

        {/* Header Artisan Card */}
        <div className="bg-white rounded-[50px] p-10 shadow-2xl shadow-chocolate/5 border border-sand flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
          
          {/* Banner Background */}
          {supplier.bannerUrl && (
             <div className="absolute inset-0 opacity-10">
                 <Image src={supplier.bannerUrl} alt="Banner" fill className="object-cover" />
             </div>
          )}

          <div className="relative z-10">
            <div className="w-44 h-44 rounded-full border-[10px] border-sand/50 overflow-hidden shadow-inner relative bg-white">
               {supplier.logoUrl ? (
                <Image src={supplier.logoUrl} alt={supplier.shopName} fill className="object-cover" />
               ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
               )}
               <div className="absolute inset-0 bg-chocolate/10 mix-blend-overlay" />
            </div>
          </div>

          <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="text-5xl font-black text-chocolate tracking-tighter leading-none">{supplier.shopName}</h1>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-terracotta/10 rounded-full border border-terracotta/20">
                  <CheckCircle2 size={14} className="text-terracotta" />
                  <span className="text-[9px] font-black text-terracotta uppercase tracking-widest">Artisan Vérifié</span>
                </div>
              </div>
              <p className="text-chocolate/50 font-bold text-lg max-w-2xl leading-relaxed italic">
                {supplier.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
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

          <div className="flex flex-col gap-4 relative z-10 min-w-[200px]">
            <button className="bg-terracotta text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-xl shadow-terracotta/20">
              Suivre la boutique
            </button>
            <button className="bg-white text-chocolate border-2 border-sand px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-terracotta hover:text-terracotta transition-all active:scale-95">
              Contacter l'artisan
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-20 flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar FILTERS */}
          <aside className="lg:w-1/4 space-y-12">
            <div>
              <h3 className="text-[11px] font-black text-chocolate/30 uppercase tracking-[0.2em] mb-8 border-b border-sand pb-4 italic">Catégories</h3>
              <div className="space-y-4">
                {categories.map((cat, i) => (
                  <label key={i} className="flex items-center gap-4 group cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden"
                      checked={filters.category === (cat === "Tous les produits" ? "" : cat)}
                      onChange={() => setFilters({...filters, category: cat === "Tous les produits" ? "" : cat})} 
                    />
                    <div className={`w-5 h-5 rounded-md border-2 border-sand flex items-center justify-center transition-all ${
                      (filters.category === "" && cat === "Tous les produits") || filters.category === cat 
                        ? 'bg-terracotta border-terracotta' : 'group-hover:border-terracotta/50'
                    }`}>
                      {((filters.category === "" && cat === "Tous les produits") || filters.category === cat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-sm font-bold transition-all ${
                      (filters.category === "" && cat === "Tous les produits") || filters.category === cat 
                        ? 'text-chocolate' : 'text-chocolate/40 group-hover:text-terracotta'
                    }`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-black text-chocolate/30 uppercase tracking-[0.2em] mb-8 border-b border-sand pb-4 italic">Tranche de prix</h3>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="0"
                  max="50000"
                  step="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                  className="w-full accent-terracotta" 
                />
                <div className="flex justify-between text-[11px] font-black text-chocolate tracking-tighter">
                  <span>0 CFA</span>
                  <span>{filters.maxPrice.toLocaleString()} CFA</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setFilters({ category: '', minPrice: 0, maxPrice: 50000, search: '' })}
              className="w-full py-5 border-2 border-sand rounded-2xl text-[10px] font-black uppercase tracking-widest text-chocolate/40 hover:border-chocolate hover:text-chocolate transition-all"
            >
              Effacer les filtres
            </button>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-3xl font-black text-chocolate italic uppercase tracking-tighter">Notre Collection <span className="text-terracotta/40 ml-2 font-normal">({products.length} articles)</span></h2>
              <div className="flex items-center gap-4">
                <div className="relative group min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={16} />
                  <input 
                    placeholder="Chercher dans cette boutique..." 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full bg-white border-2 border-sand/50 rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-terracotta/20 transition-all"
                  />
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-sand/50 rounded-xl text-[11px] font-black uppercase tracking-widest text-chocolate/60">
                  Nouveautés <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-chocolate/40 font-bold italic">
                    Aucun produit trouvé dans cette boutique.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded-[40px] p-6 shadow-xl shadow-chocolate/5 border border-sand group hover:shadow-2xl transition-all duration-500">
                    <div className="relative aspect-square rounded-[30px] overflow-hidden bg-sand/20 mb-6">
                        <Image src={p.imageUrl || '/images/placeholder.png'} alt={p.name} fill className="object-cover p-0 group-hover:scale-110 transition-transform duration-700" />
                        {p.isSpotlight && (
                            <span className="absolute top-4 left-4 bg-terracotta text-white text-[8px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                                POPULAIRE
                            </span>
                        )}
                        <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-chocolate/20 hover:text-red-500 transition-all shadow-md">
                            <Heart size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-terracotta uppercase tracking-widest">{p.category}</p>
                            <h4 className="font-bold text-chocolate text-lg tracking-tight leading-tight line-clamp-2">{p.name}</h4>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-sand">
                            <span className="text-xl font-black text-chocolate tracking-tighter">{p.price.toLocaleString()} CFA</span>
                            <button 
                                onClick={() => addItem({
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                image: p.imageUrl,
                                quantity: 1,
                                supplierId: supplier.id,
                                supplierName: supplier.shopName
                                })}
                                className="p-3.5 bg-sand/30 text-chocolate rounded-xl hover:bg-terracotta hover:text-white transition-all transform active:scale-90"
                            >
                                <ShoppingCart size={20} />
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            
            {/* Pagination (Visual only for now) */}
            <div className="flex items-center justify-center gap-4 pt-12">
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-sand text-chocolate/30 hover:text-terracotta shadow-sm"><ArrowLeft size={16} /></button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-terracotta text-white font-black text-xs shadow-lg shadow-terracotta/20">1</button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-sand text-chocolate font-black text-xs">2</button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-sand text-chocolate font-black text-xs">3</button>
               <span className="text-chocolate/30 font-black">...</span>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-sand text-chocolate/30 rotate-180 shadow-sm"><ArrowLeft size={16} /></button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
