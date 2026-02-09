'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  Download,
  ExternalLink,
  Store,
  Tag,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';
import { toast } from '@/stores/useToastStore';
import { Pagination } from '@/components/shared/Pagination';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { AdminProductDetails } from '@/components/admin/AdminProductDetails';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingVisibility, setTogglingVisibility] = useState<number | null>(null);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products', {
        params: { page, limit: 10, search: searchQuery || undefined }
      });
      if (res.data.data) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } else {
        setProducts(res.data);
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: number, currentStatus: boolean) => {
    setTogglingVisibility(id);
    try {
      await api.patch(`/admin/products/${id}/visibility`, { isActive: !currentStatus });
      toast.success(currentStatus ? 'Produit masqué' : 'Produit activé');
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    } finally {
      setTogglingVisibility(null);
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedProductId(id);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Modération Produits</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] italic mt-1">Surveillez et modérez l'ensemble du catalogue global</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-border/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border/10 transition-all shadow-sm">
            <Download size={16} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Catalogue', value: meta.total, icon: Package, color: 'bg-blue-50 text-blue-600' },
          { label: 'En Ligne', value: products.filter(p => p.isActive).length, icon: Eye, color: 'bg-leaf/10 text-leaf' },
          { label: 'Masqués', value: products.filter(p => !p.isActive).length, icon: EyeOff, color: 'bg-primary/10 text-primary' },
          { label: 'Premium', value: products.length, icon: Tag, color: 'bg-sand/20 text-foreground/60' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-border/30 flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest leading-tight">{s.label}</p>
              <h4 className="text-xl font-black text-foreground">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[32px] border border-border/30 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <input
            type="text"
            placeholder="Rechercher par nom, SKU ou boutique..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
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
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] hidden md:table-cell">Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Prix</th>
                <th className="px-8 py-6 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] hidden sm:table-cell">Statut</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sand/20 overflow-hidden border border-border/10 flex items-center justify-center">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-foreground/40" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-foreground tracking-tight truncate">{p.name}</span>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest truncate">SKU: ART-{p.id.toString().substring(0, 8)}</span>
                        <div className="sm:hidden mt-2">
                           <Badge variant={p.isActive ? 'success' : 'danger'}>
                             {p.isActive ? 'En ligne' : 'Masqué'}
                           </Badge>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                       <Store size={14} className="text-primary" />
                       <span className="text-xs font-bold text-foreground/60 truncate max-w-[150px]">{p.supplier?.shopName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-foreground tracking-tighter">{p.price.toLocaleString()} FCFA</span>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <Badge variant={p.isActive ? 'success' : 'danger'}>
                      {p.isActive ? 'En ligne' : 'Masqué'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                      <button 
                         onClick={() => toggleVisibility(p.id, p.isActive)}
                         disabled={togglingVisibility === p.id}
                         className={`p-2 rounded-xl transition-all shadow-sm ${p.isActive ? 'bg-primary/10 text-primary hover:bg-primary' : 'bg-leaf/10 text-leaf hover:bg-leaf'} hover:text-white disabled:opacity-50`}
                         title={p.isActive ? "Masquer" : "Publier"}
                       >
                         {togglingVisibility === p.id ? <Loader2 size={18} className="animate-spin" /> : (p.isActive ? <EyeOff size={18} /> : <Eye size={18} />)}
                       </button>
                      <button 
                        onClick={() => handleViewDetails(p.id)}
                        className="p-2 bg-background text-foreground/60 rounded-xl hover:bg-foreground hover:text-white transition-all shadow-sm"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                      <Link 
                        href={`/public/product/${p.id}`}
                        target="_blank"
                        className="p-2 bg-background text-foreground/60 rounded-xl hover:bg-foreground hover:text-white transition-all shadow-sm"
                        title="Voir fiche publique"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-border/10 bg-background/50">
           <Pagination 
              currentPage={page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
           />
        </div>
      </div>

      {/* Product Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedProductId(null); }}
        title="Détails du Produit"
        maxWidth="4xl"
      >
        <div className="max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
          {selectedProductId && (
            <AdminProductDetails 
              productId={selectedProductId} 
              onUpdate={() => { fetchProducts(); }} 
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
