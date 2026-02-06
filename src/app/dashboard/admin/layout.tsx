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
  Bell,
  Search,
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ConfirmLogoutModal } from '@/components/shared/ConfirmLogoutModal';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Protection de base - à renforcer avec un middleware
    if (mounted && user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, mounted, router]);

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
    <div className="min-h-screen bg-[#FDFCFB] flex">
      
      {/* Sidebar Admin (Brun Chocolat) */}
      <aside className="w-72 bg-[#3D2B1F] text-white flex flex-col p-8 fixed h-full z-40 transition-all duration-300">
        
        {/* Logo/Branding */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-[#E07A5F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E07A5F]/20">
             <ShieldCheck size={26} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none uppercase">Teranga Fil</span>
            <span className="text-[9px] font-black text-[#E07A5F] uppercase tracking-[0.2em]">Super Admin Portal</span>
          </div>
        </div>

        {/* Navigation Admin */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-[#E07A5F] text-white shadow-xl shadow-[#E07A5F]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : ''} />
                {item.name}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Profile Admin Footer */}
        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-2">
             <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
                <User size={20} />
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate uppercase">{user?.name || 'Administrateur'}</span>
                <span className="text-[10px] font-bold text-white/30 truncate italic">Admin Principal</span>
             </div>
          </div>
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#E07A5F]/60 hover:text-[#E07A5F] hover:bg-[#E07A5F]/5 transition-all"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col ml-72">
        
        {/* Top Header Admin */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between px-10 bg-white/80 backdrop-blur-xl border-b border-[#F0E6D2]/30">
          <div className="flex items-center gap-8 flex-1">
             <h2 className="text-lg font-black text-[#3D2B1F] tracking-tight whitespace-nowrap">Vue d'ensemble</h2>
             <div className="relative max-w-md w-full">
                <input 
                  type="text" 
                  placeholder="Rechercher une transaction, un fournisseur..." 
                  className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-3 px-12 text-xs font-bold outline-none focus:border-[#E07A5F]/30 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2B1F]/20" size={16} />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-[#F0E6D2]/20 text-[#3D2B1F] rounded-2xl hover:bg-[#F0E6D2]/40 transition-all">
               <Bell size={20} />
               <span className="absolute top-3 right-3 w-2 h-2 bg-[#E07A5F] rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-px bg-[#F0E6D2]/30" />
            <button className="flex items-center gap-2 p-1.5 pr-4 bg-[#3D2B1F] text-white rounded-2xl hover:opacity-90 transition-all">
               <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-black">?</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Aide</span>
            </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-10">
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
