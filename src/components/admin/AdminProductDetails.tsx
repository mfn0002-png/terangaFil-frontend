'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Package, 
  Tag, 
  Layers, 
  BarChart3, 
  Eye, 
  EyeOff, 
  Star, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  Info,
  Beaker,
  Scale,
  Maximize2,
  Store
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { toast } from '@/stores/useToastStore';

interface AdminProductDetailsProps {
  productId: number;
  onUpdate?: () => void;
}

export const AdminProductDetails = ({ productId, onUpdate }: AdminProductDetailsProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // On utilise le catalogue public ou l'admin selon les droits, 
      // ici on va tenter api.get(`/catalog/products/${productId}`) car il est complet
      const res = await api.get(`/catalog/products/${productId}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails produit');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    setUpdating(true);
    try {
      await api.patch(`/admin/products/${productId}/visibility`, { isActive: !product.isActive });
      toast.success(product.isActive ? 'Produit masqué' : 'Produit activé');
      fetchProductDetails();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la modification de la visibilité');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-terracotta" size={48} />
        <p className="text-chocolate/40 font-bold animate-pulse">Analyse du produit...</p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="space-y-10 pb-8">
      {/* Top Section: Gallery & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="relative aspect-square bg-white rounded-[45px] overflow-hidden shadow-2xl shadow-chocolate/5 border border-sand">
            <Image
              src={images[selectedImage] || '/images/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge variant={product.isActive ? 'success' : 'danger'} className="shadow-lg backdrop-blur-md">
                    {product.isActive ? 'VISIBLE' : 'MASQUÉ'}
                </Badge>
                {product.isSpotlight && (
                    <Badge variant="warning" className="bg-gold text-chocolate border-none shadow-lg">
                        <Star size={12} className="fill-current mr-1" /> EN VEDETTE
                    </Badge>
                )}
            </div>

            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-chocolate shadow-xl hover:bg-terracotta hover:text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-chocolate shadow-xl hover:bg-terracotta hover:text-white transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border-4 transition-all ${selectedImage === idx ? 'border-terracotta shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
             <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] mb-2">{product.category}</p>
             <h1 className="text-4xl font-black text-chocolate tracking-tighter leading-none mb-4">{product.name}</h1>
             <p className="text-3xl font-black text-chocolate italic tracking-tighter">{product.price.toLocaleString()} FCFA</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[35px] border border-sand shadow-xl shadow-chocolate/5 space-y-2">
                <p className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest">Stock Restant</p>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-black italic tracking-tighter ${product.stock < 10 ? 'text-terracotta' : 'text-leaf'}`}>
                        {product.stock}
                    </span>
                    <span className="text-xs font-bold text-chocolate/40 pb-1 uppercase italic">unités</span>
                </div>
            </div>
            <div className="bg-chocolate text-white p-6 rounded-[35px] shadow-xl shadow-chocolate/20 space-y-2 relative overflow-hidden">
                <BarChart3 size={48} className="absolute -right-2 -bottom-2 text-white/5" />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">HistoriqueVentes</p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black italic tracking-tighter text-white">
                        {product._count?.items || 0}
                    </span>
                    <span className="text-xs font-bold text-white/40 pb-1 uppercase italic">commandées</span>
                </div>
            </div>
          </div>

          <div className="bg-sand/20 p-8 rounded-[40px] border border-sand space-y-6">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-sm">
                      <Store size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest">Artisan</p>
                    <p className="text-lg font-black text-chocolate italic -mt-1 tracking-tighter">{product.supplier.shopName}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-sm">
                      <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest">Date d'Ajout</p>
                    <p className="text-lg font-black text-chocolate italic -mt-1 tracking-tighter">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
              </div>
          </div>

          {/* Admin Controls */}
          <div className="flex flex-col gap-4">
              <Button 
                onClick={handleToggleVisibility} 
                disabled={updating}
                className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${product.isActive ? 'bg-terracotta hover:bg-chocolate' : 'bg-leaf hover:bg-leaf/90'}`}
              >
                  {updating ? <Loader2 className="animate-spin" size={20} /> : (product.isActive ? <EyeOff size={20} /> : <Eye size={20} />)}
                  {product.isActive ? 'Masquer du catalogue' : 'Rendre visible'}
              </Button>
              <a 
                href={`/public/product/${productId}`} 
                target="_blank"
                className="w-full py-6 rounded-3xl border-2 border-sand bg-white text-chocolate hover:bg-sand/30 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                  <ExternalLink size={20} /> Voir la fiche publique
              </a>
          </div>
        </div>
      </div>

      {/* Specifications Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-sand shadow-xl shadow-chocolate/5 space-y-6">
              <div className="flex items-center gap-3 border-b border-sand pb-4">
                  <Info size={20} className="text-terracotta" />
                  <h3 className="text-xl font-black text-chocolate italic uppercase tracking-tighter">Description</h3>
              </div>
              <p className="text-chocolate/60 font-bold leading-relaxed italic">
                  {product.description || "Aucune description fournie par l'artisan."}
              </p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-sand shadow-xl shadow-chocolate/5 space-y-6">
              <div className="flex items-center gap-3 border-b border-sand pb-4">
                  <ShieldCheck size={20} className="text-terracotta" />
                  <h3 className="text-xl font-black text-chocolate italic uppercase tracking-tighter">Spécifications</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  {product.material && (
                    <div className="p-4 bg-sand/10 rounded-2xl">
                         <div className="flex items-center gap-2 text-[10px] font-black text-chocolate/30 uppercase mb-1">
                            <Beaker size={12} /> Matière
                         </div>
                         <p className="font-black text-chocolate italic tracking-tight">{product.material}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div className="p-4 bg-sand/10 rounded-2xl">
                         <div className="flex items-center gap-2 text-[10px] font-black text-chocolate/30 uppercase mb-1">
                            <Scale size={12} /> Poids
                         </div>
                         <p className="font-black text-chocolate italic tracking-tight">{product.weight}</p>
                    </div>
                  )}
                  {product.length && (
                    <div className="p-4 bg-sand/10 rounded-2xl">
                         <div className="flex items-center gap-2 text-[10px] font-black text-chocolate/30 uppercase mb-1">
                            <Maximize2 size={12} /> Longueur
                         </div>
                         <p className="font-black text-chocolate italic tracking-tight">{product.length}</p>
                    </div>
                  )}
                  {product.category && (
                    <div className="p-4 bg-sand/10 rounded-2xl">
                         <div className="flex items-center gap-2 text-[10px] font-black text-chocolate/30 uppercase mb-1">
                            <Layers size={12} /> Catégorie
                         </div>
                         <p className="font-black text-chocolate italic tracking-tight">{product.category}</p>
                    </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};
