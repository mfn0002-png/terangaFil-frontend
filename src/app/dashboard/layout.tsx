'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Banknote, 
  AlertCircle, 
  Settings,
  LogOut,
  Search,
  ChevronRight,
  ShieldCheck,
  User,
  Menu,
  X,
  Store,
  BarChart3,
  ShoppingCart,
  Truck,
  Crown,
  ShoppingBag
} from 'lucide-react';
import NotificationCenter from '@/components/shared/NotificationCenter';
import { ConfirmLogoutModal } from '@/components/shared/ConfirmLogoutModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Fermer la sidebar après navigation sur mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  if (!mounted) return null;

  // Si l'utilisateur n'est pas connecté, on le laisse gérer par ses pages ou on redirige
  // Mais ici on s'occupe surtout du layout. 
  // Si c'est un CLIENT, on affiche la Navbar et le Footer
  if (user?.role === 'CLIENT' || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Pour ADMIN et SUPPLIER, on affiche la Sidebar
  const isAdmin = user.role === 'ADMIN';
  
  const adminNavItems = [
    { name: 'Vue d\'ensemble', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Fournisseurs', href: '/dashboard/admin/suppliers', icon: Users },
    { name: 'Produits', href: '/dashboard/admin/products', icon: Package },
    { name: 'Commissions', href: '/dashboard/admin/commissions', icon: Banknote },
    { name: 'Litiges', href: '/dashboard/admin/disputes', icon: AlertCircle },
    { name: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const supplierNavItems = [
    { name: 'Tableau de bord', href: '/dashboard/supplier', icon: BarChart3 },
    { name: 'Produits', href: '/dashboard/supplier/products', icon: Package },
    { name: 'Commandes', href: '/dashboard/supplier/orders', icon: ShoppingCart },
    { name: 'Livraison', href: '/dashboard/supplier/delivery', icon: Truck },
    { name: 'Premium', href: '/dashboard/supplier/premium', icon: Crown },
    { name: 'Profil', href: '/dashboard/supplier/profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : supplierNavItems;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-foreground text-white flex flex-col transition-all duration-300 transform lg:relative ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`h-full flex flex-col ${isSidebarOpen ? 'p-8' : 'p-4 items-center'}`}>
          {/* Logo/Branding */}
          <div className={`flex items-center gap-3 mb-12 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
               {isAdmin ? <ShieldCheck size={26} className="text-white" /> : <Store size={22} className="text-white" />}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xl font-black tracking-tight leading-none uppercase whitespace-nowrap">Teranga Fil</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">
                  {isAdmin ? 'Super Admin Portal' : 'PRO Portal'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && item.href !== '/dashboard/supplier' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  } ${!isSidebarOpen && 'px-0 justify-center'}`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : ''} />
                  {isSidebarOpen && (
                    <>
                      {item.name}
                      {isActive && <ChevronRight size={14} className="ml-auto" />}
                    </>
                  )}
                </Link>
              );
            })}
            
            {!isAdmin && (
              <Link 
                href="/public/catalog"
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all ${!isSidebarOpen && 'px-0 justify-center'}`}
                title={!isSidebarOpen ? "Mercerie en ligne" : ""}
              >
                <ShoppingBag size={20} />
                {isSidebarOpen && <span>Mercerie en ligne</span>}
              </Link>
            )}
          </nav>

          {/* Profile Footer */}
          <div className={`mt-auto pt-8 border-t border-white/5 space-y-4 ${!isSidebarOpen && 'items-center flex flex-col'}`}>
            <div className={`flex items-center gap-4 ${isSidebarOpen ? 'px-2' : ''}`}>
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <User size={20} />
               </div>
               {isSidebarOpen && (
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black truncate uppercase">{user?.name || 'Utilisateur'}</span>
                    <span className="text-[10px] font-bold text-white/30 truncate italic">
                      {isAdmin ? 'Admin Principal' : 'Vendeur Certifié'}
                    </span>
                 </div>
               )}
            </div>
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 transition-all ${!isSidebarOpen && 'px-0 justify-center'}`}
              title={!isSidebarOpen ? "Déconnexion" : ""}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-xl border-b border-border/30 shrink-0">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="p-2 text-foreground hover:bg-border/20 rounded-xl transition-all"
             >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <h2 className="text-lg font-black text-foreground tracking-tight whitespace-nowrap hidden md:block">
                {navItems.find(i => i.href === pathname)?.name || (pathname.includes('notifications') ? 'Notifications' : 'Dashboard')}
             </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {!isAdmin && user?.supplier && (
              <Link href={`/public/supplier/${user.supplier.id}`} target="_blank">
                <button className="hidden md:flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Store size={16} />
                  Ma Boutique
                </button>
              </Link>
            )}
            <NotificationCenter />
            <div className="h-10 w-px bg-border/30" />
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-black text-foreground uppercase">{user?.name}</span>
                  <span className="text-[10px] font-bold text-primary italic uppercase tracking-tighter">
                    {isAdmin ? 'Administrateur' : 'Vendeur'}
                  </span>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white font-black">
                  {user?.name?.[0].toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* Confirm Logout Modal */}
      <ConfirmLogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          router.push('/');
        }}
      />

    </div>
  );
}
