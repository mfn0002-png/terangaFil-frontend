'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  ShoppingBag,
  Truck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Store,
  ChevronRight,
  Bell,
  Crown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ConfirmLogoutModal } from '@/components/shared/ConfirmLogoutModal';

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fermer par défaut sur mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    if (mounted && user?.role === 'SUPPLIER') {
      import('@/lib/api').then(m => {
        m.default.get('/premium/my-subscription').then(res => setSubscription(res.data)).catch(() => {});
      });
    }
  }, [user, mounted]);

  // Fermer la sidebar après navigation sur mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard/supplier', icon: BarChart3 },
    { name: 'Produits', href: '/dashboard/supplier/products', icon: Package },
    { name: 'Commandes', href: '/dashboard/supplier/orders', icon: ShoppingCart },
    { name: 'Livraison', href: '/dashboard/supplier/delivery', icon: Truck },
    { name: 'Premium', href: '/dashboard/supplier/premium', icon: Crown },
    { name: 'Profil', href: '/dashboard/supplier/profile', icon: User },
  ];

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-foreground text-white transition-all duration-300 transform lg:relative ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}`}>
        <div className={`h-full flex flex-col ${isSidebarOpen ? 'p-8' : 'p-4 items-center'}`}>
          
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-16 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
               <Store size={22} className="text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xl font-black tracking-tight leading-none whitespace-nowrap">Teranga Fil</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">PRO Portal</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/supplier' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'} ${!isSidebarOpen && 'px-0 justify-center'}`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <item.icon size={20} className={isActive ? 'text-primary' : ''} />
                  {isSidebarOpen && (
                    <>
                      {item.name}
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* New Navigation Section */}
          <div className="pb-4 space-y-2">
            <Link 
              href="/public/catalog"
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all ${!isSidebarOpen && 'px-0 justify-center'}`}
              title={!isSidebarOpen ? "Mercerie en ligne" : ""}
            >
              <ShoppingBag size={20} />
              {isSidebarOpen && <span>Mercerie en ligne</span>}
            </Link>
          </div>

          {/* Footer Sidebar */}
          <div className="pt-8 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 transition-all ${!isSidebarOpen && 'px-0 justify-center'}`}
              title={!isSidebarOpen ? "Déconnexion" : ""}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between px-10 bg-white/80 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-foreground hover:bg-border/20 rounded-xl transition-all">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <h2 className="text-sm font-black text-foreground/30 uppercase tracking-[0.3em] italic hidden sm:block">Espace Gestionnaire</h2>
          </div>

          <div className="flex items-center gap-6">
            {user?.supplier && (
              <Link href={`/public/supplier/${user.supplier.id}`} target="_blank">
                <button className="hidden md:flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Store size={16} />
                  Ma Boutique Publique
                </button>
              </Link>
            )}
            <button className="relative p-3 bg-border/20 text-foreground rounded-2xl hover:bg-border/40 transition-all">
               <Bell size={20} />
               <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-px bg-border/30" />
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-foreground uppercase">{user?.name}</span>
                  <span className={`text-[10px] font-bold tracking-tighter italic ${subscription ? 'text-leaf' : 'text-primary'}`}>
                    {subscription ? `${subscription.plan.name} Member` : 'Vendeur Certifié'}
                  </span>
               </div>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${subscription ? 'bg-leaf shadow-leaf/20' : 'bg-primary shadow-primary/20'}`}>
                  {user?.name?.[0].toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>

      <ConfirmLogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
