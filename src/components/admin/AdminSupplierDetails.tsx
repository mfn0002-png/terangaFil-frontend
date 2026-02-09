'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Store, 
  MapPin, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Wallet,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { toast } from '@/stores/useToastStore';

interface AdminSupplierDetailsProps {
  supplierId: number;
  onStatusUpdate?: () => void;
}

export const AdminSupplierDetails = ({ supplierId, onStatusUpdate }: AdminSupplierDetailsProps) => {
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSupplierDetails();
  }, [supplierId]);

  const fetchSupplierDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/suppliers/${supplierId}`);
      setSupplier(res.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails fournisseur');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/admin/suppliers/${supplierId}/status`, { status });
      toast.success(`Statut mis à jour : ${status}`);
      fetchSupplierDetails();
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-terracotta" size={48} />
        <p className="text-chocolate/40 font-bold animate-pulse">Chargement du profil artisan...</p>
      </div>
    );
  }

  if (!supplier) return null;

  const { user, stats, subscriptions } = supplier;
  const plan = subscriptions?.[0]?.plan;

  return (
    <div className="space-y-8 pb-8">
      {/* Header Banner & Logo */}
      <div className="relative group">
        <div className="h-48 w-full rounded-[40px] bg-gradient-to-r from-chocolate to-terracotta overflow-hidden shadow-2xl relative">
          {supplier.bannerUrl ? (
            <Image src={supplier.bannerUrl} alt="Banner" fill className="object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-6xl uppercase tracking-[0.5em] select-none italic">Teranga Fil</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <div className="absolute -bottom-10 left-10 flex items-end gap-6">
          <div className="w-32 h-32 rounded-full border-[10px] border-white overflow-hidden shadow-2xl relative bg-white">
            {supplier.logoUrl ? (
              <Image src={supplier.logoUrl} alt={supplier.shopName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
            )}
          </div>
          <div className="mb-4">
            <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg leading-tight">{supplier.shopName}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={supplier.status === 'ACTIVE' ? 'success' : supplier.status === 'PENDING' ? 'warning' : 'danger'}>
                {supplier.status}
              </Badge>
              {plan && (
                <Badge variant="info" className="bg-gold text-chocolate border-none shadow-lg shadow-gold/20">
                  Plan {plan.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 pt-8">
        {/* Left Column: Account Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <div className="bg-white p-8 rounded-[40px] border border-sand shadow-xl shadow-chocolate/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-sand pb-6">
              <div className="w-12 h-12 bg-sand/30 rounded-2xl flex items-center justify-center text-chocolate">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-chocolate italic uppercase tracking-tighter">Informations de l'Artisan</h3>
                <p className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Identité & Contact</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Nom Complet</label>
                <div className="flex items-center gap-3 text-chocolate font-bold">
                  <span className="text-lg">{user.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Email</label>
                <div className="flex items-center gap-3 text-chocolate font-bold">
                  <Mail size={18} className="text-terracotta" />
                  <span className="text-lg font-mono">{user.email || 'Non renseigné'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Téléphone</label>
                <div className="flex items-center gap-3 text-chocolate font-bold">
                  <Phone size={18} className="text-terracotta" />
                  <span className="text-lg font-mono">{user.phoneNumber}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Membre depuis</label>
                <div className="flex items-center gap-3 text-chocolate font-bold">
                  <Calendar size={18} className="text-terracotta" />
                  <span className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-sand/20 p-8 rounded-[40px] border border-sand shadow-inner space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-chocolate shadow-md">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-chocolate italic uppercase tracking-tighter">Configuration des Paiements</h3>
                <p className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Versements PayDunya</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Méthode</label>
                <div className="flex items-center gap-3">
                  {supplier.paymentMethod === 'WAVE' ? (
                    <div className="px-4 py-2 bg-blue-500 text-white rounded-xl font-black text-xs">WAVE</div>
                  ) : supplier.paymentMethod === 'OM' ? (
                    <div className="px-4 py-2 bg-orange-500 text-white rounded-xl font-black text-xs">ORANGE MONEY</div>
                  ) : (
                    <div className="px-4 py-2 bg-sand text-chocolate/40 rounded-xl font-black text-xs">NON CONFIGURÉ</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Numéro de Versement</label>
                <div className="text-xl font-black text-chocolate font-mono tracking-widest">
                  {supplier.paymentPhoneNumber || '---'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Stats & Actions */}
        <div className="space-y-8">
          {/* Performance Card */}
          <div className="bg-chocolate text-white p-8 rounded-[40px] shadow-2xl shadow-chocolate/20 space-y-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-white/5 font-black text-9xl italic tracking-tighter select-none">$$</div>
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-black italic uppercase tracking-tighter opacity-70 flex items-center gap-2">
                <TrendingUp size={20} /> Performances
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter">{(stats?.totalRevenue || 0).toLocaleString()} <span className="text-sm font-bold opacity-50 not-italic">FCFA</span></p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Chiffre d'Affaire</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-3xl">
                    <p className="text-2xl font-black italic tracking-tighter">{stats?.totalSales || 0}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Ventes</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-3xl">
                    <p className="text-2xl font-black italic tracking-tighter">{supplier._count?.products || 0}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Produits</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 relative z-10">
                <a 
                    href={`/public/supplier/${supplierId}`} 
                    target="_blank" 
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ExternalLink size={14} /> Prévisualiser la boutique
                </a>
            </div>
          </div>

          {/* Validation Actions */}
          <div className="bg-white p-8 rounded-[40px] border border-sand shadow-xl shadow-chocolate/5 space-y-6">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-chocolate flex items-center gap-2">
              <ShieldCheck size={20} className="text-leaf" /> Modération
            </h3>
            
            <div className="space-y-3">
              {supplier.status === 'PENDING' && (
                <Button 
                  onClick={() => handleUpdateStatus('ACTIVE')} 
                  disabled={updating}
                  className="w-full py-6 rounded-2xl bg-leaf hover:bg-leaf/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-leaf/20 flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  Approuver l'artisan
                </Button>
              )}
              
              {supplier.status === 'ACTIVE' && (
                <Button 
                  onClick={() => handleUpdateStatus('SUSPENDED')} 
                  disabled={updating}
                  className="w-full py-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-orange/20 flex items-center justify-center gap-2"
                >
                   {updating ? <Loader2 className="animate-spin" size={18} /> : <AlertCircle size={18} />}
                   Suspendre le compte
                </Button>
              )}

              {supplier.status !== 'SUSPENDED' && supplier.status !== 'PENDING' && (
                <div className="text-center py-4 bg-sand/20 rounded-2xl border border-sand">
                    <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Aucune action requise</p>
                </div>
              )}

              {supplier.status === 'PENDING' && (
                <Button 
                    onClick={() => handleUpdateStatus('SUSPENDED')} // On peut appeler ça 'REBUTER' si on veut
                    disabled={updating}
                    variant="outline"
                    className="w-full py-6 rounded-2xl border-terracotta/20 text-terracotta hover:bg-terracotta/5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <XCircle size={18} /> Rejeter la demande
                </Button>
              )}
              
              {supplier.status === 'SUSPENDED' && (
                 <Button 
                   onClick={() => handleUpdateStatus('ACTIVE')} 
                   disabled={updating}
                   className="w-full py-6 rounded-2xl bg-leaf hover:bg-leaf/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-leaf/20 flex items-center justify-center gap-2"
                 >
                    {updating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Réactiver le compte
                 </Button>
              )}
            </div>
            
            <p className="text-[10px] text-center text-chocolate/30 font-bold leading-relaxed px-4">
              La modification du statut enverra automatiquement une notification à l'artisan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
