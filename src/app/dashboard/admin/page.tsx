'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  MoreVertical,
  Banknote,
  Store
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E07A5F]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Chiffre d\'Affaires Global',
      value: `${stats?.totalRevenue?.toLocaleString()} FCFA`,
      change: '+15%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-leaf/10 text-leaf'
    },
    {
      title: 'Total Commissions (10%)',
      value: `${stats?.totalCommissions?.toLocaleString()} FCFA`,
      change: '+12%',
      isPositive: true,
      icon: Banknote,
      color: 'bg-[#E07A5F]/10 text-[#E07A5F]'
    },
    {
      title: 'Nouveaux Fournisseurs',
      value: stats?.pendingSuppliersCount || 0,
      subtitle: 'En attente de validation',
      isUrgent: (stats?.pendingSuppliersCount || 0) > 0,
      icon: Store,
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl shadow-foreground/5 border border-border/30 group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <card.icon size={24} />
              </div>
              {card.change && (
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.isPositive ? 'text-leaf' : 'text-red-500'}`}>
                  {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">{card.value}</h3>
              {card.subtitle && (
                <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${card.isUrgent ? 'text-[#E07A5F]' : 'text-foreground/40'}`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-xl shadow-foreground/5 border border-border/30 overflow-hidden">
          <div className="p-8 border-b border-border/30 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Dernières Transactions</h3>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Flux financier en temps réel</p>
            </div>
            <button className="text-[10px] font-black text-[#E07A5F] border-2 border-[#E07A5F]/10 px-4 py-2 rounded-xl hover:bg-[#E07A5F] hover:text-white transition-all uppercase tracking-widest">
              Exporter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FDFCFB]/50 border-b border-border/10">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Boutique</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Montant</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {stats?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-[#FDFCFB]/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sand/20 flex items-center justify-center text-chocolate">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-black text-foreground uppercase tracking-wider">#{tx.id.toString().padStart(6, '0')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-bold text-foreground/60 tracking-tight">{tx.shopName}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-foreground tracking-tighter">{tx.amount.toLocaleString()} FCFA</span>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Suppliers Validation */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-foreground/5 border border-border/30 p-8 flex flex-col">
          <h3 className="text-xl font-black text-foreground tracking-tight mb-2">Actions Prioritaires</h3>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-8 text-leaf">Validation requise</p>
          
          <div className="space-y-6 flex-1">
            {stats?.pendingSuppliersCount > 0 ? (
              <div className="bg-[#E07A5F]/5 border-2 border-dashed border-[#E07A5F]/20 rounded-3xl p-6 flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 bg-[#E07A5F] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#E07A5F]/20">
                    <Users size={30} />
                 </div>
                 <h4 className="text-sm font-black text-[#3D2B1F]">{stats.pendingSuppliersCount} Nouveau(x) Fournisseur(s)</h4>
                 <p className="text-[10px] font-bold text-foreground/40 italic">Des entrepreneurs talentueux attendent votre feu vert pour rejoindre Teranga Fil.</p>
                 <button className="w-full bg-[#3D2B1F] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E07A5F] transition-all">
                    Examiner les Dossiers
                 </button>
              </div>
            ) : (
              <div className="bg-leaf/5 border-2 border-dashed border-leaf/20 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 bg-leaf/20 rounded-2xl flex items-center justify-center text-leaf">
                    <CheckCircle2 size={30} />
                 </div>
                 <h4 className="text-sm font-black text-leaf">Tout est à jour</h4>
                 <p className="text-[10px] font-bold text-foreground/40">Aucun dossier en attente de validation actuellement.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/30">
             <button className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-all">
                Voir toutes les boutiques
                <ArrowUpRight size={18} />
             </button>
          </div>
        </div>

      </div>

    </div>
  );
}
