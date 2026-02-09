import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import NotificationCenter from './shared/NotificationCenter';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-sand">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold text-chocolate tracking-tighter">
              Teranga <span className="text-terracotta italic font-normal">Fil</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-chocolate/50">
            <Link href="/public/catalog" className="hover:text-terracotta transition-colors">Boutique</Link>
            <Link href="/public/suppliers" className="hover:text-terracotta transition-colors">Vendeurs</Link>
            <Link href="/models" className="hover:text-terracotta transition-colors">Modèles</Link>
            <Link href="/community" className="hover:text-terracotta transition-colors">Communauté</Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg relative group">
            <input
              type="text"
              placeholder="Rechercher un fil, une marque, une boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand/40 border-none rounded-full py-2.5 pl-12 pr-4 text-xs focus:ring-2 focus:ring-terracotta/20 transition-all group-hover:bg-sand/60 placeholder:text-chocolate/30"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20 group-hover:text-terracotta transition-colors" size={16} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {mounted && user && (
              <Link href="/cart" className="p-2 text-chocolate/70 hover:text-terracotta transition-colors relative group">
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-lg animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}
            {mounted && user && <NotificationCenter />}
            <div className="hidden sm:flex items-center gap-1">
              {mounted && user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-chocolate uppercase tracking-widest leading-none">{user.name}</span>
                    <span className="text-[8px] font-bold text-terracotta uppercase tracking-[0.2em]">{user.role}</span>
                  </div>
                  <Link 
                    href="/profile"
                    className="p-2.5 bg-sand/30 text-chocolate rounded-xl hover:bg-terracotta hover:text-white transition-all"
                    title="Mon Profil"
                  >
                    <User size={18} />
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-chocolate hover:text-terracotta transition-all">
                    Connexion
                  </Link>
                  <Link href="/auth/register" className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] bg-chocolate text-white rounded-full hover:bg-terracotta transition-all shadow-lg shadow-chocolate/10">
                    <User size={14} />
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
            <button 
              className="lg:hidden p-2 text-chocolate"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-sand shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-chocolate/70">
            <Link href="/public/catalog" className="hover:text-terracotta transition-colors py-2 border-b border-sand/50" onClick={() => setIsMobileMenuOpen(false)}>Boutique</Link>
            <Link href="/public/suppliers" className="hover:text-terracotta transition-colors py-2 border-b border-sand/50" onClick={() => setIsMobileMenuOpen(false)}>Vendeurs</Link>
            <Link href="/models" className="hover:text-terracotta transition-colors py-2 border-b border-sand/50" onClick={() => setIsMobileMenuOpen(false)}>Modèles</Link>
            <Link href="/community" className="hover:text-terracotta transition-colors py-2 border-b border-sand/50" onClick={() => setIsMobileMenuOpen(false)}>Communauté</Link>
          </div>
          
          <div className="relative group">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand/40 border-none rounded-full py-3 pl-12 pr-4 text-xs focus:ring-2 focus:ring-terracotta/20"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20" size={16} />
          </div>
        </div>
      )}
    </nav>
  );
}
