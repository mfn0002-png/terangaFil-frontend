'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  ArrowUpDown,
  Filter,
  Package,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supplierService } from '@/services/supplierService';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { PageHeader } from '@/components/shared/PageHeader';
import { toast } from '@/stores/useToastStore';

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await supplierService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await supplierService.toggleProductActive(id, !currentStatus);
      const updatedProducts = products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p);
      setProducts(updatedProducts);
      if (selectedProduct?.id === id) {
        setSelectedProduct({ ...selectedProduct, isActive: !currentStatus });
      }
      toast.success(currentStatus ? 'Produit masqué' : 'Produit mis en ligne');
    } catch (error) {
      toast.error("Erreur lors du changement de statut.");
    }
  };

  const handleDelete = (product: any) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const id = productToDelete.id;
    setIsDeleting(id);
    try {
      await supplierService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
      toast.success('Produit supprimé avec succès');
      setProductToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#E07A5F]" size={40} />
        <p className="text-[#3D2B1F]/40 font-black text-[10px] uppercase tracking-widest">Chargement de votre catalogue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      <PageHeader 
        title="Mes Produits" 
        subtitle="Gérez votre catalogue d'articles et vos stocks"
        actions={
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/dashboard/supplier/products/new'}
            icon={Plus}
          >
            Ajouter un produit
          </Button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D2B1F]/20 group-focus-within:text-[#E07A5F] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Rechercher par nom ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-[#F0E6D2]/30 rounded-3xl py-4 pl-16 pr-8 text-sm font-bold outline-none focus:border-[#E07A5F]/30 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[50px] shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FDFCFB] border-b border-[#F0E6D2]/30">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Prix</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Statut</th>
                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#3D2B1F]/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D2]/10">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock < 10;
                return (
                  <tr key={p.id} className="group hover:bg-[#FDFCFB] transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-[#FDFCFB] border border-[#F0E6D2]/30 overflow-hidden relative group-hover:shadow-lg transition-all duration-500">
                          {p.imageUrl ? (
                             <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                             <span className="absolute inset-0 flex items-center justify-center text-2xl">🧶</span>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-black text-[#3D2B1F] tracking-tight">{p.name}</p>
                          <p className="text-[10px] font-bold text-[#E07A5F] uppercase tracking-widest italic">{p.material || 'Standard'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base font-black text-[#3D2B1F] tracking-tighter">{p.price.toLocaleString()} CFA</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <span className={`text-sm font-black ${isLowStock ? 'text-red-500' : 'text-[#3D2B1F]'}`}>
                           {p.stock} pces
                         </span>
                         {isLowStock && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-500 animate-pulse' : 'bg-[#3D2B1F]/20'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.isActive ? 'text-green-600' : 'text-[#3D2B1F]/30'}`}>
                            {p.isActive ? 'Actif' : 'Masqué'}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedProduct(p)}
                            icon={Eye}
                            title="Voir détails"
                         />
                         <Link href={`/dashboard/supplier/products/${p.id}/edit`}>
                            <Button variant="ghost" size="sm" icon={Edit} title="Modifier" />
                         </Link>
                         <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(p)}
                            loading={isDeleting === p.id}
                            icon={Trash2}
                            title="Supprimer"
                         />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails Produit */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || ''}
        subtitle={`${selectedProduct?.category} - ${selectedProduct?.price?.toLocaleString()} CFA`}
        icon={Package}
        maxWidth="4xl"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <div className="aspect-square rounded-[40px] bg-[#FDFCFB] border border-[#F0E6D2]/30 overflow-hidden relative shadow-2xl">
                  {selectedProduct.imageUrl ? (
                     <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-6xl">🧶</div>
                  )}
               </div>
               <div className="grid grid-cols-4 gap-4">
                  {selectedProduct.images?.map((img: string, i: number) => (
                     <div key={i} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative">
                        <Image src={img} alt="" fill className="object-cover" />
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <Badge variant="primary">{selectedProduct.category}</Badge>
                  <Badge variant={selectedProduct.isActive ? 'success' : 'gray'}>
                     {selectedProduct.isActive ? 'Actif' : 'Masqué'}
                  </Badge>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/30">Description</p>
                  <p className="text-sm font-bold text-[#3D2B1F]/60 leading-relaxed font-serif">{selectedProduct.description || 'Aucune description fournie.'}</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-[#FDFCFB] rounded-3xl border border-[#F0E6D2]/30">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/30 mb-1">Stock</p>
                     <p className="text-xl font-black text-[#3D2B1F]">{selectedProduct.stock} unités</p>
                  </div>
                  <div className="p-6 bg-[#FDFCFB] rounded-3xl border border-[#F0E6D2]/30">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/30 mb-1">Matière</p>
                     <p className="text-xl font-black text-[#3D2B1F]">{selectedProduct.material || 'N/A'}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 pt-4">
                  <Link href={`/dashboard/supplier/products/${selectedProduct.id}/edit`} className="flex-1">
                    <Button variant="primary" className="w-full" icon={Edit}>
                       Modifier
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleToggleActive(selectedProduct.id, selectedProduct.isActive)}
                    icon={selectedProduct.isActive ? EyeOff : Eye}
                    title={selectedProduct.isActive ? 'Masquer' : 'Mettre en ligne'}
                  />
               </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Supprimer le produit"
        subtitle={productToDelete?.name}
        icon={Trash2}
        maxWidth="md"
      >
        <div className="space-y-8">
           <p className="text-sm font-bold text-[#3D2B1F]/60 leading-relaxed italic">Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et retirera l'article de la boutique.</p>
           <div className="flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={() => setProductToDelete(null)}>Annuler</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete} loading={!!isDeleting}>Oui, supprimer</Button>
           </div>
        </div>
      </Modal>

    </div>
  );
}
