'use client';

import { useState, useEffect } from 'react';
import { 
  Banknote, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Search, 
  Download,
  TrendingUp,
  Wallet,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';
import { toast } from '@/stores/useToastStore';

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/commissions');
      setCommissions(res.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayout = async (id: number) => {
    try {
      await api.patch(`/admin/payouts/${id}/retry`);
      toast.success('Paiement relancé avec succès');
      fetchCommissions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de la relance');
    }
  };

  const totalCommissions = commissions.reduce((acc, c) => acc + (c.commission || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E07A5F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#3D2B1F] tracking-tighter">Suivi Commissions</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] italic mt-1">Gérez les revenus et les reversements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-border/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border/10 transition-all shadow-sm">
            <Download size={16} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#3D2B1F] p-8 rounded-[40px] text-white shadow-2xl shadow-chocolate/20 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Revenu Plateforme</p>
            <h3 className="text-4xl font-black tracking-tighter">{totalCommissions.toLocaleString()} <span className="text-lg">FCFA</span></h3>
            <div className="mt-6 flex items-center gap-2 text-leaf text-[10px] font-black uppercase tracking-widest">
               <ArrowUpRight size={14} />
               Frais de service (10%)
            </div>
          </div>
          <Banknote className="absolute -right-6 -bottom-6 text-white/5" size={160} />
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-border/30 flex flex-col justify-between group">
           <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-4">Volume total traité</p>
              <h3 className="text-3xl font-black text-[#3D2B1F] tracking-tighter">{(totalCommissions * 10).toLocaleString()} FCFA</h3>
           </div>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none">Transactions Marketplace</span>
              <TrendingUp size={20} className="text-primary" />
           </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-border/30 flex flex-col justify-between group">
           <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-4">Transferts Réussis</p>
              <h3 className="text-3xl font-black text-[#3D2B1F] tracking-tighter">{commissions.filter(c => c.status === 'COMPLETED').length}</h3>
           </div>
           <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-bold text-leaf uppercase tracking-widest">Paiements automatisés</span>
              <CheckCircle2 size={20} className="text-leaf" />
           </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-foreground/5 border border-border/30 overflow-hidden">
        <div className="p-8 border-b border-border/30 flex items-center justify-between bg-[#FDFCFB]/30">
           <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Historique des Transactions</h3>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Ventilation par commande et boutique</p>
           </div>
           <div className="relative group max-w-xs w-full">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-white border-2 border-border/30 rounded-2xl py-3 px-12 text-xs font-bold outline-none focus:border-primary/30 transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FDFCFB] border-b border-border/10">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Commande</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Commission</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Statut</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {commissions.map((c) => (
                <tr key={c.id} className="hover:bg-[#FDFCFB]/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-foreground tracking-widest">#{c.orderId}</span>
                    <p className="text-[9px] font-bold text-foreground/30 uppercase mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Wallet size={14} className="text-primary" />
                       <span className="text-xs font-bold text-foreground/60">{c.supplier.shopName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-primary tracking-tighter">{c.commission.toLocaleString()} FCFA</span>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={c.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {c.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleRetryPayout(c.id)}
                        className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all group-hover:scale-105"
                        title="Relancer le paiement"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
