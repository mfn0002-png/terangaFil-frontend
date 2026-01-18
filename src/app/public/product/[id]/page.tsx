'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Truck, Shield, ArrowLeft, Star } from 'lucide-react';
import { catalogService, Product } from '@/services/catalogService';
import { favoriteService } from '@/services/favoriteService';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = Number(params.id);
        const data = await catalogService.getProductById(id);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl,
      imageUrl: product.imageUrl,
      supplierId: product.supplier.id,
      supplierName: product.supplier.shopName,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
    });
    alert('Produit ajouté au panier !');
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const result = await favoriteService.toggle(product!.id);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-terracotta"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10">
        <div className="text-center">
          <h2 className="text-2xl font-black text-chocolate mb-4">Produit non trouvé</h2>
          <button onClick={() => router.back()} className="text-terracotta font-bold hover:underline">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="min-h-screen bg-sand/10 py-12 font-sans">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-bold text-chocolate/40 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-terracotta transition-colors">
            Accueil
          </button>
          <span>/</span>
          <button onClick={() => router.push('/public/catalog')} className="hover:text-terracotta transition-colors">
            Catalogue
          </button>
          <span>/</span>
          <span className="text-chocolate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-[45px] overflow-hidden shadow-2xl shadow-chocolate/5 border border-sand">
              <Image
                src={images[selectedImage] || '/images/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isSpotlight && (
                <div className="absolute top-6 left-6 bg-gold text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  ⭐ Artisanal
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-terracotta shadow-lg' : 'border-sand hover:border-chocolate/20'
                    }`}
                  >
                    <Image src={img || '/images/placeholder.png'} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-terracotta uppercase tracking-widest">
                  {product.supplier.shopName}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-gold text-gold" />
                  <span className="text-xs font-bold text-chocolate/60">4.9 (124 avis)</span>
                </div>
              </div>
              <h1 className="text-5xl font-black text-chocolate tracking-tighter mb-4">{product.name}</h1>
              <p className="text-3xl font-black text-terracotta">{product.price.toLocaleString()} FCFA</p>
            </div>

            {/* Specifications */}
            {(product.material || product.weight || product.length || product.usage) && (
              <div className="bg-white rounded-[35px] p-6 shadow-xl shadow-chocolate/5 border border-sand">
                <h3 className="text-xs font-black text-chocolate/30 uppercase tracking-[0.2em] mb-4">Spécifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.material && (
                    <div>
                      <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest mb-1">Matière</p>
                      <p className="font-bold text-chocolate">{product.material}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest mb-1">Poids</p>
                      <p className="font-bold text-chocolate">{product.weight}</p>
                    </div>
                  )}
                  {product.length && (
                    <div>
                      <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest mb-1">Longueur</p>
                      <p className="font-bold text-chocolate">{product.length}</p>
                    </div>
                  )}
                  {product.usage && (
                    <div>
                      <p className="text-[10px] font-black text-chocolate/40 uppercase tracking-widest mb-1">Crochet</p>
                      <p className="font-bold text-chocolate">{product.usage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-chocolate/30 uppercase tracking-[0.2em] mb-4">Couleurs disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        selectedColor === color
                          ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20'
                          : 'bg-sand/30 text-chocolate hover:bg-sand/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-chocolate/30 uppercase tracking-[0.2em] mb-4">Tailles disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-leaf text-white shadow-lg shadow-leaf/20'
                          : 'bg-sand/30 text-chocolate hover:bg-sand/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black text-chocolate/30 uppercase tracking-[0.2em] mb-4">Quantité</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-2xl bg-sand/30 hover:bg-sand/50 font-black text-chocolate transition-all"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-chocolate w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-2xl bg-sand/30 hover:bg-sand/50 font-black text-chocolate transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-terracotta text-white py-5 rounded-[30px] font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-5 rounded-[30px] font-black transition-all shadow-xl ${
                    isFavorite
                      ? 'bg-red-50 text-red-500 border-2 border-red-200'
                      : 'bg-white text-chocolate/20 border-2 border-sand hover:text-red-500'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-6 pt-6 border-t border-sand">
              <div className="flex items-center gap-3">
                <Truck className="text-terracotta" size={24} />
                <div>
                  <p className="text-xs font-black text-chocolate">Livraison rapide</p>
                  <p className="text-[10px] text-chocolate/40 font-bold">Sous 2-5 jours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-terracotta" size={24} />
                <div>
                  <p className="text-xs font-black text-chocolate">Paiement sécurisé</p>
                  <p className="text-[10px] text-chocolate/40 font-bold">100% protégé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="bg-white rounded-[45px] p-10 shadow-2xl shadow-chocolate/5 border border-sand mb-16">
          <div className="flex gap-8 border-b border-sand mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === 'description'
                  ? 'text-terracotta border-b-4 border-terracotta'
                  : 'text-chocolate/40 hover:text-chocolate'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === 'reviews'
                  ? 'text-terracotta border-b-4 border-terracotta'
                  : 'text-chocolate/40 hover:text-chocolate'
              }`}
            >
              Avis clients (124)
            </button>
          </div>

          {activeTab === 'description' && (
            <div className="prose prose-lg max-w-none">
              <p className="text-chocolate/80 font-medium leading-relaxed">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <p className="text-chocolate/40 font-bold italic">Les avis clients seront bientôt disponibles.</p>
            </div>
          )}
        </div>

        {/* More from this shop */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-chocolate tracking-tighter">Plus de la boutique {product.supplier.shopName}</h2>
            <button
              onClick={() => router.push(`/public/supplier/${product.supplier.id}`)}
              className="text-terracotta font-black text-sm uppercase tracking-widest hover:underline"
            >
              Voir tout →
            </button>
          </div>
          <p className="text-chocolate/40 font-bold text-center py-12">Chargement des produits similaires...</p>
        </div>
      </div>
    </div>
  );
}
