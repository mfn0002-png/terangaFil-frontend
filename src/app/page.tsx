'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, ChevronRight, Store, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';
import { catalogService, Product, Supplier } from '@/services/catalogService';

export default function Home() {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const categories = [
    { name: 'Fils', image: '/images/cat_yarn.png', color: 'bg-leaf' },
    { name: 'Crochets', image: '/images/cat_crochet.png', color: 'bg-chocolate' },
    { name: 'Accessoires', image: '/images/cat_accessory.png', color: 'bg-gold' },
    { name: 'Kits crochet', image: '/images/cat_kit.png', color: 'bg-leaf/40' },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, suppliersData] = await Promise.all([
          catalogService.getProducts(),
          catalogService.getSuppliers()
        ]);
        setProducts(productsData.slice(0, 8)); // Take first 8 featured products
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="space-y-24 pb-32">
      
      <section className="container mx-auto px-4 pt-12">
        <div className="relative h-[500px] md:h-[600px] w-full rounded-[60px] overflow-hidden group shadow-2xl shadow-chocolate/10 border border-sand">
          <Image 
            src="/images/hero.png" 
            alt="Teranga Fil Hero" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/70 via-chocolate/20 to-transparent flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-10 max-w-4xl drop-shadow-2xl leading-[1.1] tracking-tighter">
              La mercerie qui relie les créateurs
            </h1>
            <div className="w-full max-w-2xl flex items-center bg-white/95 backdrop-blur-md p-3 rounded-full shadow-2xl border border-white/50">
              <div className="flex-1 flex items-center px-5">
                <Search className="text-chocolate/20 mr-4" size={24} />
                <input 
                  type="text" 
                  placeholder="Rechercher un fil, une marque, une boutique..." 
                  className="w-full border-none focus:ring-0 text-chocolate placeholder:text-chocolate/30 font-bold text-sm"
                />
              </div>
              <button className="bg-terracotta text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-xl shadow-terracotta/20 hidden sm:block">
                Explorer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-1.5 bg-terracotta rounded-full"></div>
          <h2 className="text-3xl font-black text-chocolate uppercase tracking-[0.1em]">Explorez nos univers</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group relative h-80 rounded-[40px] overflow-hidden cursor-pointer border border-sand shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className={`absolute inset-0 ${cat.color} opacity-30 group-hover:opacity-10 transition-opacity z-10`} />
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute bottom-10 left-10 z-20">
                <h3 className="text-2xl font-black text-white drop-shadow-2xl tracking-tight uppercase italic">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand/30 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1.5 bg-terracotta rounded-full"></div>
              <h2 className="text-3xl font-black text-chocolate uppercase tracking-[0.1em]">Boutiques à la une</h2>
            </div>
            <Link href="/public/suppliers" className="text-terracotta text-xs font-black uppercase tracking-widest flex items-center gap-2 group hover:gap-4 transition-all">
              Voir tout <ChevronRight size={20} />
            </Link>
          </div>
          <div className="flex gap-14 overflow-x-auto pb-10 no-scrollbar">
            {isLoading ? (
              <div className="w-full flex justify-center py-10">
                <Loader2 className="animate-spin text-terracotta" size={32} />
              </div>
            ) : suppliers.map((s, i) => (
              <Link key={s.id} href={`/public/supplier/${s.id}`} className="flex flex-col items-center gap-6 flex-shrink-0 group">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl border-4 border-transparent group-hover:border-terracotta group-hover:rotate-6 transition-all shadow-xl overflow-hidden relative">
                  {s.logoUrl ? (
                    <Image src={s.logoUrl} alt={s.shopName} fill className="object-cover" />
                  ) : (
                    <span className="text-3xl">🧶</span>
                  )}
                </div>
                <span className="text-sm font-black text-chocolate uppercase tracking-widest group-hover:text-terracotta transition-colors">{s.shopName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1.5 bg-terracotta rounded-full"></div>
            <h2 className="text-3xl font-black text-chocolate uppercase tracking-[0.1em]">Meilleures Ventes</h2>
          </div>
          <Link 
            href="/public/catalog" 
            className="text-terracotta font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            Voir plus →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading ? (
             [1, 2, 3, 4].map((i) => (
               <div key={i} className="h-96 rounded-[40px] bg-sand/10 animate-pulse border border-sand/20" />
             ))
          ) : products.map((p) => (
            <Link 
              key={p.id} 
              href={`/public/product/${p.id}`}
              className="group flex flex-col bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-sand cursor-pointer"
            >
              <div className="relative h-72 w-full bg-sand/5 overflow-hidden">
                <Image src={p.imageUrl || '/images/placeholder.png'} alt={p.name} fill className="object-cover p-0 transition-transform duration-700 group-hover:scale-110" />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Toggle favorite
                  }}
                  className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-full text-chocolate/20 hover:text-red-500 hover:scale-110 transition-all shadow-lg border border-white/50"
                >
                  <Heart size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                   <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em]">
                    {p.supplier.shopName}
                  </span>
                </div>
                <h4 className="font-bold text-chocolate text-xl tracking-tight leading-tight line-clamp-2">{p.name}</h4>
                <div className="mt-auto pt-6 border-t border-sand">
                  <span className="text-xl font-black text-chocolate tracking-tighter">{p.price.toLocaleString()} CFA</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Become Supplier Section - Only for CLIENT or Guest */}
      {(!user || user.role === 'CLIENT') && (
        <section className="container mx-auto px-4 pb-24">
          <div className="bg-chocolate rounded-[60px] p-12 md:p-24 overflow-hidden relative group">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Image src="/images/auth_sidebar.png" alt="Overlay" fill className="object-cover" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="bg-terracotta p-4 rounded-3xl shadow-2xl">
                <Store className="text-white" size={40} />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter max-w-2xl leading-none">
                Vous êtes artisan ou possédez une mercerie ?
              </h2>
              <p className="text-sand/60 font-bold text-lg max-w-xl">
                Rejoignez la première marketplace dédiée à la couture et au crochet au Sénégal et boostez vos ventes.
              </p>
              <Link 
                href="/auth/register-supplier" 
                className="bg-white text-chocolate px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-terracotta hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
              >
                Créer ma boutique gratuitement
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
