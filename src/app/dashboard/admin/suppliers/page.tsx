'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Download, 
  UserPlus, 
  Store, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Mail,
  Eye,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { AdminSupplierDetails } from '@/components/admin/AdminSupplierDetails';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from '@/stores/useToastStore';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', phoneNumber: '', shopName: '', status: 'PENDING' });
  const [isInviting, setIsInviting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [page, filter]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/suppliers', {
        params: { page, limit: 10, status: filter !== 'ALL' ? filter : undefined }
      });
      if (res.data.data) {
        setSuppliers(res.data.data);
        setMeta(res.data.meta);
      } else {
        setSuppliers(res.data);
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await api.post('/admin/suppliers/invite', inviteData);
      toast.success('Invitation envoyée au fournisseur !');
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', phoneNumber: '', shopName: '', status: 'PENDING' });
      fetchSuppliers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setUpdatingStatus(id);
    try {
      await api.patch(`/admin/suppliers/${id}/status`, { status });
      toast.success(`Statut mis à jour : ${status}`);
      fetchSuppliers();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedSupplierId(id);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Gestion Fournisseurs</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] italic mt-1">Pilotez les boutiques et les performances</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-border/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border/10 transition-all shadow-sm">
            <Download size={16} />
            Exporter CSV
          </button>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus size={16} />
            Inviter un Fournisseur
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-border/30 flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Store size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Total Fournisseurs</p>
              <h4 className="text-2xl font-black text-foreground">{meta.total}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-border/30 flex items-center gap-4">
           <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">En Attente</p>
              <h4 className="text-2xl font-black text-foreground">{suppliers.filter(s => s.status === 'PENDING').length}</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-border/30 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
           <div className="w-14 h-14 bg-leaf/10 text-leaf rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">CA Total Vendeurs</p>
              <h4 className="text-2xl font-black text-foreground">{suppliers.reduce((acc, s) => acc + (s.totalRevenue || 0), 0).toLocaleString()} <span className="text-xs font-bold">FCFA</span></h4>
           </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[32px] border border-border/30 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex items-center gap-1 bg-background p-1.5 rounded-2xl border border-border/30 w-full md:w-auto overflow-x-auto">
          {['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-foreground text-white shadow-lg' : 'text-foreground/40 hover:text-foreground hover:bg-border/10'}`}
            >
              {f === 'ALL' ? 'Tous' : f === 'PENDING' ? 'En Attente' : f === 'ACTIVE' ? 'Actifs' : 'Suspendus'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 group w-full">
          <input
            type="text"
            placeholder="Rechercher boutique ou propriétaire..."
            className="w-full bg-background border-2 border-border/30 rounded-2xl py-3 px-12 text-xs font-bold outline-none focus:border-primary/30 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-foreground/5 border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border/10">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] hidden md:table-cell">Propriétaire</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Flux</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] hidden sm:table-cell">Statut</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                   </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-xs font-bold text-foreground/30 uppercase tracking-widest italic">
                      Aucun fournisseur trouvé
                   </td>
                </tr>
              ) : suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sand/20 flex items-center justify-center overflow-hidden border border-border/10">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} alt={s.shopName} className="w-full h-full object-cover" />
                        ) : (
                          <Store size={20} className="text-foreground/40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-foreground tracking-tight truncate">{s.shopName}</p>
                        <p className="text-[10px] font-bold text-foreground/40 italic flex items-center gap-1 truncate">
                          <Mail size={10} /> {s.user?.email || 'N/A'}
                        </p>
                        <div className="sm:hidden mt-2">
                           <Badge variant={s.status === 'ACTIVE' ? 'success' : s.status === 'PENDING' ? 'warning' : 'danger'}>
                             {s.status}
                           </Badge>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <span className="text-xs font-bold text-foreground/60">{s.user?.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground tracking-tighter">{(s.totalRevenue || 0).toLocaleString()} FCFA</span>
                      <span className="text-[10px] font-bold text-leaf uppercase">{s.totalSales || 0} ventes</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <Badge variant={s.status === 'ACTIVE' ? 'success' : s.status === 'PENDING' ? 'warning' : 'danger'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                      {s.status === 'PENDING' && (
                        <button 
                          onClick={() => handleUpdateStatus(s.id, 'ACTIVE')}
                          disabled={updatingStatus === s.id}
                          className="p-2 bg-leaf/10 text-leaf rounded-xl hover:bg-leaf hover:text-white transition-all shadow-sm disabled:opacity-50"
                          title="Activer"
                        >
                          {updatingStatus === s.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        </button>
                      )}
                      {(s.status === 'ACTIVE' || s.status === 'PENDING') && (
                        <button 
                          onClick={() => handleUpdateStatus(s.id, 'SUSPENDED')}
                          disabled={updatingStatus === s.id}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                          title="Suspendre"
                        >
                          {updatingStatus === s.id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewDetails(s.id)}
                        className="p-2 bg-background text-foreground/60 rounded-xl hover:bg-foreground hover:text-white transition-all shadow-sm"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                      <Link 
                        href={`/public/supplier/${s.id}`}
                        target="_blank"
                        className="p-2 bg-background text-foreground/60 rounded-xl hover:bg-foreground hover:text-white transition-all shadow-sm"
                        title="Voir boutique"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button className="p-2 bg-background text-foreground/60 rounded-xl hover:bg-foreground hover:text-white transition-all shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 border-t border-border/10 bg-background/50">
           <Pagination 
              currentPage={page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
           />
           <p className="text-center mt-4 text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] italic">
              Affichage de {suppliers.length} sur {meta.total} boutiques Teranga Fil
           </p>
        </div>
      </div>

      {/* Invitation Modal */}
      <Modal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)}
        title="Ajouter un nouveau Fournisseur"
      >
        <form onSubmit={handleInvite} className="space-y-6 pt-4">
           <div className="bg-background p-4 rounded-2xl mb-6 border border-border/30">
              <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest leading-relaxed">
                Note : Un email sera envoyé au vendeur avec un lien pour configurer son mot de passe et activer sa boutique.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Nom du propriétaire"
                placeholder="Ex: Fatou Niang"
                value={inviteData.name}
                onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                required
              />
              <Input 
                label="Email professionnel"
                type="email"
                placeholder="vendeur@example.com"
                value={inviteData.email}
                onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                required
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Téléphone"
                placeholder="77 XXXXXXX"
                value={inviteData.phoneNumber}
                onChange={(e) => setInviteData({...inviteData, phoneNumber: e.target.value})}
                required
              />
              <Input 
                label="Nom de la Boutique"
                placeholder="Teranga Textiles"
                value={inviteData.shopName}
                onChange={(e) => setInviteData({...inviteData, shopName: e.target.value})}
                required
              />
           </div>

           <div className="flex justify-end gap-3 pt-6 border-t border-border/10">
              <button 
                type="button" 
                onClick={() => setIsInviteModalOpen(false)}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-all"
              >
                Annuler
              </button>
              <Button type="submit" disabled={isInviting} className="px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
                {isInviting && <Loader2 size={18} className="animate-spin" />}
                {isInviting ? 'Traitement...' : 'Envoyer l\'invitation'}
              </Button>
           </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedSupplierId(null); }}
        title="Détails du Fournisseur"
        maxWidth="4xl"
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
          {selectedSupplierId && (
            <AdminSupplierDetails 
              supplierId={selectedSupplierId} 
              onStatusUpdate={() => { fetchSuppliers(); }} 
            />
          )}
        </div>
        <div className="flex justify-end pt-8 border-t border-border/10 mt-8">
          <Button onClick={() => setIsDetailsModalOpen(false)} className="px-10 py-4 rounded-2xl">
            Fermer
          </Button>
        </div>
      </Modal>

    </div>
  );
}
