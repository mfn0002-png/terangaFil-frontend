'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  ChevronRight,
  ArrowUpRight,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { supplierService, SupplierStats } from '@/services/supplierService';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

export default function SupplierDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, productsData] = await Promise.all([
          supplierService.getStats(),
          supplierService.getProducts()
        ]);
        setStats(statsData);
        setProducts(productsData.slice(0, 5)); // Just show top 5
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#E07A5F]" size={40} />
        <p className="text-[#3D2B1F]/40 font-black text-[10px] uppercase tracking-widest">Chargement des performances...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Intro */}
      <div className="space-y-2">
         <h1 className="text-5xl font-black text-[#3D2B1F] tracking-tighter">
           Bonjour, <span className="text-[#E07A5F] italic">{user?.name?.split(' ')[0] || 'Artisan'}</span>
         </h1>
         <p className="text-sm font-bold text-[#3D2B1F]/40 uppercase tracking-widest">
           Membre depuis {new Date().getFullYear()} • Boutique Certifiée
         </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            label: 'Ventes du mois', 
            value: `${stats?.overview.totalRevenue.toLocaleString()} CFA`, 
            icon: TrendingUp, 
            color: 'bg-orange-50 text-orange-600',
            trend: '+12%' 
          },
          { 
            label: 'Commandes en attente', 
            value: stats?.overview.pendingOrders.toString(), 
            icon: ShoppingBag, 
            color: 'bg-blue-50 text-blue-600',
            trend: 'Action requise'
          },
          { 
            label: 'Alertes Stock', 
            value: `${stats?.overview.lowStockItems} articles`, 
            icon: AlertTriangle, 
            color: 'bg-red-50 text-red-600',
            trend: 'Niveaux bas'
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[40px] p-8 shadow-xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 flex items-center gap-6 group hover:scale-[1.02] transition-all">
             <div className={`w-16 h-16 rounded-3xl ${item.color} flex items-center justify-center shadow-lg`}>
                <item.icon size={28} />
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/30">{item.label}</p>
                <h3 className="text-2xl font-black text-[#3D2B1F] tracking-tight">{item.value}</h3>
                <p className={`text-[10px] font-bold ${item.color.split(' ')[1]} flex items-center gap-1`}>
                   {item.trend} <ArrowUpRight size={10} />
                </p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Inventory Quick Access */}
        <section className="lg:col-span-8 bg-white rounded-[50px] p-10 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-10">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#3D2B1F] italic">Inventaire Rapide</h2>
                <p className="text-xs font-bold text-[#3D2B1F]/30 uppercase tracking-widest text-left">Gérez vos articles et niveaux de stock</p>
              </div>
              <Link href="/dashboard/supplier/products" className="text-[10px] font-black text-[#E07A5F] underline uppercase tracking-widest hover:text-[#3D2B1F] transition-colors">Voir tout l'inventaire</Link>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F0E6D2]/30">
                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/20">Article</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/20">Prix</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/20">Quantité</th>
                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/20">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6D2]/10">
                  {products.map((product) => (
                    <tr key={product.id} className="group cursor-pointer hover:bg-[#FDFCFB]">
                      <td className="py-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F0E6D2]/20 relative overflow-hidden flex-shrink-0">
                           {product.imageUrl ? (
                             <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                           ) : (
                             <span className="absolute inset-0 flex items-center justify-center text-xs">📦</span>
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#3D2B1F]">{product.name}</p>
                          <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase">{product.category}</p>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="text-sm font-black text-[#3D2B1F]">{product.price.toLocaleString()} CFA</span>
                      </td>
                      <td className="py-6">
                        <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-[#3D2B1F]/60'}`}>{product.stock}</span>
                      </td>
                      <td className="py-6 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {product.stock < 10 ? 'Critique' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-[#3D2B1F]/20 font-bold uppercase text-[10px] tracking-widest">
                        Aucun produit trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </section>

        {/* Shipping Preview */}
        <section className="lg:col-span-4 space-y-8">
           <div className="bg-gradient-to-br from-[#3D2B1F] to-[#2B1E16] rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-[#E07A5F]/20 transition-all duration-700" />
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-[#E07A5F] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E07A5F]/20">
                   <Truck size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic mb-2 leading-tight">Tarifs de Livraison</h3>
                  <p className="text-xs font-medium text-white/50 leading-relaxed uppercase tracking-widest">Configurez vos frais par zones géographiques.</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Dakar Ville</span>
                      <span className="text-xs font-black">1 500 CFA</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Thiès</span>
                      <span className="text-xs font-black">3 000 CFA</span>
                   </div>
                </div>
                <Link href="/dashboard/supplier/delivery" className="w-full flex items-center justify-between p-5 bg-[#E07A5F] rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#3D2B1F] transition-all transform hover:scale-[1.02]">
                   Gérer les zones
                   <ChevronRight size={18} />
                </Link>
              </div>
           </div>

           <div className="relative bg-[#E07A5F]/10 rounded-[40px] border-2 border-dashed border-[#E07A5F]/30 p-8 flex flex-col items-center text-center gap-4 group cursor-pointer hover:bg-[#E07A5F]/15 transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E07A5F] shadow-lg group-hover:rotate-12 transition-transform">
                <Plus size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-[#3D2B1F] uppercase text-xs tracking-widest">Nouveau Produit</h4>
                <p className="text-[10px] font-bold text-[#E07A5F] uppercase italic">Ajouter un article en 2 min</p>
              </div>
              <Link href="/dashboard/supplier/products/new" className="absolute inset-0" title="Ajouter" />
           </div>
        </section>

      </div>
    </div>
  );
}
