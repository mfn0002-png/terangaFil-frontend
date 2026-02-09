'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  Check
} from 'lucide-react';
import { catalogService, Product } from '@/services/catalogService';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/stores/useToastStore';

interface ProductDetailsContentProps {
  productId: number;
}

export const ProductDetailsContent = ({ productId }: ProductDetailsContentProps) => {
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await catalogService.getProductById(productId);
        setProduct(data);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        
        // Fetch similar products
        const products = await catalogService.getProducts({ 
          category: data.category,
          supplierId: data.supplier.id 
        });
        setSimilarProducts(products.filter(p => p.id !== data.id).slice(0, 4));
      } catch (error) {
        toast.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        supplierId: product.supplier.id,
        supplierName: product.supplier.shopName
      });
      toast.success(`${product.name} ajouté au panier !`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-terracotta" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-black text-chocolate">Produit introuvable</h2>
        <Link href="/" className="text-terracotta font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square bg-white rounded-[45px] overflow-hidden shadow-2xl shadow-chocolate/5 border border-sand">
            <Image
              src={images[selectedImage] || '/images/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            
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
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all ${selectedImage === idx ? 'border-terracotta shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black text-terracotta uppercase tracking-[0.2em]">
                {product.supplier.shopName}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < 4 ? 'fill-gold text-gold' : 'text-sand'} />
                ))}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-chocolate tracking-tighter mb-4 leading-none">{product.name}</h1>
            <p className="text-3xl font-black text-terracotta tracking-tighter">{product.price.toLocaleString()} FCFA</p>
          </div>

          <div className="space-y-6 bg-white p-8 rounded-[40px] border border-sand shadow-xl shadow-chocolate/5">
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <span className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] italic">Couleurs disponibles</span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${selectedColor === color ? 'border-terracotta scale-110 shadow-lg' : 'border-sand hover:border-chocolate/20'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <span className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] italic">Tailles / Longueurs</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-terracotta text-white shadow-lg' : 'bg-sand/30 text-chocolate/60 hover:bg-sand/50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <span className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] italic">Quantité</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-sand/30 rounded-2xl p-1 border border-sand">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center font-black text-chocolate hover:bg-white rounded-xl transition-all">-</button>
                  <span className="w-12 text-center font-black text-chocolate">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center font-black text-chocolate hover:bg-white rounded-xl transition-all">+</button>
                </div>
                {product.stock > 0 ? (
                  <span className="text-[10px] font-bold text-leaf flex items-center gap-2">
                    <Check size={14} /> En stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-terracotta">Rupture de stock</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="flex-1 bg-terracotta text-white py-6 rounded-[30px] font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {isAdding ? <Loader2 size={24} className="animate-spin" /> : <ShoppingCart size={24} />}
              {isAdding ? 'Ajout...' : 'Ajouter au panier'}
            </button>
            <button className="w-20 h-[72px] bg-white border-2 border-sand rounded-[30px] flex items-center justify-center text-chocolate hover:text-red-500 hover:border-red-500 transition-all active:scale-95 group">
              <Heart size={24} className="group-hover:fill-red-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-5 bg-sand/10 rounded-3xl border border-sand/50">
              <Truck size={20} className="text-terracotta flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-chocolate uppercase tracking-widest">Livraison</p>
                <p className="text-[10px] font-bold text-chocolate/40 leading-tight">Expédié en 48h partout au Sénégal</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-leaf/5 rounded-3xl border border-leaf/10">
              <ShieldCheck size={20} className="text-leaf flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-leaf uppercase tracking-widest">Qualité</p>
                <p className="text-[10px] font-bold text-leaf/40 leading-tight">Artisanat 100% Teranga Fil vérifié</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-sand pb-6">
              <h3 className="text-2xl font-black text-chocolate italic uppercase tracking-tighter">Du même artisan</h3>
              <Link href={`/public/supplier/${product.supplier.id}`} className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] border-b-2 border-terracotta/20 hover:border-terracotta pb-1 transition-all">Tout voir</Link>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <Link href={`/public/product/${p.id}`} key={p.id} className="group flex flex-col gap-4">
                   <div className="relative aspect-square rounded-[35px] overflow-hidden bg-white border border-sand shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-110 transition-all duration-700" />
                   </div>
                   <div className="px-2">
                       <h4 className="font-bold text-chocolate text-sm line-clamp-1">{p.name}</h4>
                       <p className="font-black text-terracotta text-lg tracking-tighter">{p.price.toLocaleString()} CFA</p>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
