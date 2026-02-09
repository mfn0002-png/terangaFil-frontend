'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ConfirmLogoutModal } from '@/components/shared/ConfirmLogoutModal';
import { fr } from 'date-fns/locale';
import NotificationCenter from '@/components/shared/NotificationCenter';

export default function AdminLayout({
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
    // Fermer par défaut sur mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    // Protection de base
    if (mounted && user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, mounted, router]);

  // Fermer la sidebar après navigation sur mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const navItems = [
    { name: 'Vue d\'ensemble', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Fournisseurs', href: '/dashboard/admin/suppliers', icon: Users },
    { name: 'Produits', href: '/dashboard/admin/products', icon: Package },
    { name: 'Commissions', href: '/dashboard/admin/commissions', icon: Banknote },
    { name: 'Litiges', href: '/dashboard/admin/disputes', icon: AlertCircle },
    { name: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Admin (Brun Chocolat via bg-foreground) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-foreground text-white flex flex-col transition-all duration-300 transform lg:relative ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`h-full flex flex-col ${isSidebarOpen ? 'p-8' : 'p-4 items-center'}`}>
          {/* Logo/Branding */}
          <div className={`flex items-center gap-3 mb-12 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
               <ShieldCheck size={26} className="text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xl font-black tracking-tight leading-none uppercase whitespace-nowrap">Teranga Fil</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">Super Admin Portal</span>
              </div>
            )}
          </div>

          {/* Navigation Admin */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
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
          </nav>

          {/* Profile Admin Footer */}
          <div className={`mt-auto pt-8 border-t border-white/5 space-y-4 ${!isSidebarOpen && 'items-center flex flex-col'}`}>
            <div className={`flex items-center gap-4 ${isSidebarOpen ? 'px-2' : ''}`}>
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <User size={20} />
               </div>
               {isSidebarOpen && (
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black truncate uppercase">{user?.name || 'Administrateur'}</span>
                    <span className="text-[10px] font-bold text-white/30 truncate italic">Admin Principal</span>
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
        
        {/* Top Header Admin */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-xl border-b border-border/30 shrink-0">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="p-2 text-foreground hover:bg-border/20 rounded-xl transition-all"
             >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <h2 className="text-lg font-black text-foreground tracking-tight whitespace-nowrap hidden md:block">
                {navItems.find(i => i.href === pathname)?.name || 'Admin'}
             </h2>
             <div className="relative max-w-md w-full hidden sm:block">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-full bg-background border-2 border-border/30 rounded-2xl py-3 px-12 text-xs font-bold outline-none focus:border-primary/30 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
             </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <NotificationCenter />
            <div className="h-10 w-px bg-border/30" />
            <button className="flex items-center gap-2 p-1.5 pr-4 bg-foreground text-white rounded-2xl hover:opacity-90 transition-all">
               <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-black">?</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Aide</span>
            </button>
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
