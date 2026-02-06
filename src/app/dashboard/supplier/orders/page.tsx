'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Loader2,
  Filter,
  Eye,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import NextImage from 'next/image';
import { supplierService } from '@/services/supplierService';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { PageHeader } from '@/components/shared/PageHeader';
import { toast } from '@/stores/useToastStore';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const computeTotals = (o: any) => {
    const itemsSubtotal = (o.order.items || []).reduce((s: number, it: any) => s + (Number(it.price) * Number(it.quantity)), 0);
    const supplierTotal = itemsSubtotal + (Number(o.shippingPrice || 0));
    return { ...o, itemsSubtotal, supplierTotal };
  };

  useEffect(() => {
    fetchOrdersAndStats();
  }, []);

  const fetchOrdersAndStats = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        supplierService.getOrders(),
        supplierService.getStats()
      ]);
      const processed = (ordersData || []).map(computeTotals);
      setOrders(processed);
      setStats(statsData.overview);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Échec du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    setUpdating(true);
    try {
      await supplierService.updateOrderStatus(id, status);
      // Refresh
      const ordersRaw = await supplierService.getOrders();
      const updated = (ordersRaw || []).map(computeTotals);
      setOrders(updated);
      const newSelected = updated.find((o: any) => o.id === id);
      setSelectedOrder(newSelected);
      // Update stats
      const newStats = await supplierService.getStats();
      setStats(newStats.overview);
      toast.success(`Statut mis à jour : ${status}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return o.status === 'PENDING' || o.status === 'PREPARING';
    if (activeTab === 'SHIPPED') return o.status === 'SHIPPED';
    if (activeTab === 'DELIVERED') return o.status === 'DELIVERED';
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-foreground/40 font-black text-[10px] uppercase tracking-widest">Chargement de vos commandes...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'ALL', label: 'Toutes', count: stats?.totalOrders || 0 },
    { id: 'PENDING', label: 'À préparer', count: stats?.pendingOrders || 0 },
    { id: 'SHIPPED', label: 'En cours', count: orders.filter(o => o.status === 'SHIPPED').length },
    { id: 'DELIVERED', label: 'Livrées', count: orders.filter(o => o.status === 'DELIVERED').length },
  ];

  return (
    <div className="space-y-10">
      
      <PageHeader 
        title="Commandes" 
        subtitle="Suivez et préparez les commandes de vos clients"
        actions={
          <div className="bg-border/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              CA Total: <span className="text-primary">{stats?.totalRevenue?.toLocaleString() || 0} CFA</span>
            </span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border/30 pb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-foreground text-white shadow-lg' : 'text-foreground/40 hover:bg-border/10'}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[50px] shadow-2xl shadow-foreground/5 border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background border-b border-border/30">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">ID & Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Client</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Montant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Statut</th>
                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="group hover:bg-background transition-colors">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-foreground">#{o.id}</p>
                    <p className="text-[10px] font-bold text-foreground/20">{new Date(o.order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-foreground">{o.order.customerFirstName} {o.order.customerLastName}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{o.order.customerPhoneNumber}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-base font-black text-foreground tracking-tighter">{(o.supplierTotal || 0).toLocaleString()} CFA</span>
                  </td>
                  <td className="px-8 py-6">
                     <Badge 
                       variant={o.status === 'DELIVERED' ? 'success' : o.status === 'SHIPPED' ? 'info' : 'warning'}
                       icon={o.status === 'DELIVERED' ? CheckCircle2 : o.status === 'SHIPPED' ? Truck : Package}
                     >
                       {o.status}
                     </Badge>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedOrder(o)}
                      icon={Eye}
                      size="sm"
                    >
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails Commande */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Détails de la commande"
        subtitle={`#${selectedOrder?.id} - Passée le ${selectedOrder ? new Date(selectedOrder.order.createdAt).toLocaleDateString() : ''}`}
        icon={ShoppingBag}
        maxWidth="2xl"
      >
        {selectedOrder && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8 border-y border-border/30 py-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Informations Livraison</p>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">{selectedOrder.order.customerFirstName || 'Client'} {selectedOrder.order.customerLastName || ''}</p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{selectedOrder.order.customerPhoneNumber || 'Pas de numéro'}</p>
                    <p className="text-xs font-serif italic text-foreground/60">{selectedOrder.order.customerAddress || 'Adresse non renseignée'}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Expédition</p>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-primary">{selectedOrder.shippingPrice.toLocaleString()} CFA</p>
                    <p className="text-xs font-bold text-foreground/60">{selectedOrder.order.items?.[0]?.shippingZone || 'Zone Standard'}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Articles commandés</p>
               <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                  {selectedOrder.order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-6 p-4 bg-background rounded-[30px] border border-border/20 group">
                       <div className="w-16 h-16 rounded-2xl bg-white border border-border/30 overflow-hidden relative">
                          {item.product.imageUrl ? (
                             <NextImage src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                          ) : (
                             <span className="absolute inset-0 flex items-center justify-center text-xl">🧶</span>
                          )}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-black text-foreground">{item.product.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">Qté: {item.quantity}</span>
                            {item.color && <span className="text-[9px] font-black text-primary uppercase tracking-widest">• {item.color}</span>}
                            {item.size && <span className="text-[9px] font-black text-[#81B29A] uppercase tracking-widest">• {item.size}</span>}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-primary">{(item.price * item.quantity).toLocaleString()} CFA</p>
                          <p className="text-[9px] font-bold text-foreground/20">{item.price.toLocaleString()} CFA / unité</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex justify-end items-center gap-6 pt-4">
               <div className="text-right">
                  <p className="text-sm font-black text-foreground">{(selectedOrder.supplierTotal || 0).toLocaleString()} CFA</p>
                  <p className="text-[10px] font-bold text-foreground/20">Articles: {(selectedOrder.itemsSubtotal || 0).toLocaleString()} CFA • Livraison: {(selectedOrder.shippingPrice || 0).toLocaleString()} CFA</p>
               </div>
            </div>

            <div className="space-y-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Mettre à jour le statut</p>
               <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'PREPARING', label: 'Préparation', icon: Package },
                    { id: 'SHIPPED', label: 'Expédiée', icon: Truck },
                    { id: 'DELIVERED', label: 'Livrée', icon: CheckCircle2 },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s.id as OrderStatus)}
                      disabled={updating || selectedOrder.status === s.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                        selectedOrder.status === s.id 
                          ? 'bg-foreground border-foreground text-white shadow-xl' 
                          : 'bg-background border-border/30 text-foreground/40 hover:border-foreground/20'
                      } ${updating && 'opacity-50'}`}
                    >
                      {updating && selectedOrder.status !== s.id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <s.icon size={20} />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex justify-between items-center pt-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">ID Interne: {selectedOrder.id}</p>
               <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                 Fermer
               </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
