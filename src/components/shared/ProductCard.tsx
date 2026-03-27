'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useFavoriteStore } from '@/stores/favoriteStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/catalogService';

interface ProductCardProps {
  product: Product;
  showSupplier?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showSupplier = true }) => {
  const router = useRouter();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleFavorite, favoriteIds, fetchFavorites, initialized, togglingIds } = useFavoriteStore();
  const isFavorite = favoriteIds.has(product.id);
  const isToggling = togglingIds.has(product.id);

  useEffect(() => {
    if (!initialized) {
      fetchFavorites();
    }
  }, [initialized, fetchFavorites]);
  
  const cartQuantity = cartItems
    .filter(item => item.id === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartQuantity > 0) {
      router.push('/cart');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
      supplierId: product.supplier.id,
      supplierName: product.supplier.shopName
    });
  };

  return (
    <Link 
      href={`/public/product/${product.id}`}
      className="group bg-white rounded-[40px] p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-sand flex flex-col h-full"
    >
      <div className="relative aspect-square rounded-[30px] overflow-hidden bg-sand/5 mb-4 md:mb-6 shrink-0">
        <Image 
          src={product.imageUrl || '/images/placeholder.png'} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {cartQuantity > 0 && (
          <div className="absolute top-3 left-3 bg-leaf text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg z-10">
            <ShoppingCart size={10} />
            {cartQuantity}
          </div>
        )}
        
        {product.isSpotlight && (
          <div className="absolute top-3 right-3 bg-gold text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Star
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          disabled={isToggling}
          className={`absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-md z-20 ${isFavorite ? 'text-red-500' : 'text-chocolate/20 hover:text-red-500'} ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isToggling ? (
            <Loader2 size={16} className="animate-spin text-terracotta" />
          ) : (
            <Heart size={16} className={isFavorite ? 'fill-red-500' : ''} />
          )}
        </button>
      </div>

      <div className="px-2 pb-2 flex flex-col flex-1">
        {showSupplier && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-terracotta"></div>
            <span 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/public/supplier/${product.supplier.id}`;
              }}
              className="text-[9px] font-black text-chocolate/40 uppercase tracking-widest hover:text-terracotta transition-colors"
            >
              {product.supplier.shopName}
            </span>
          </div>
        )}
        
        <div className="space-y-1">
          {!showSupplier && (
            <p className="text-[9px] font-black text-terracotta uppercase tracking-widest">{product.category}</p>
          )}
          <h3 className="font-bold text-chocolate text-base md:text-lg leading-tight mb-4 line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-sand/30">
          <span className="text-lg font-black text-chocolate tracking-tighter">
            {product.price.toLocaleString()} <span className="text-xs font-bold text-chocolate/40">CFA</span>
          </span>
          
          <div 
            className="w-10 h-10 rounded-xl bg-sand/20 flex items-center justify-center text-chocolate group-hover:bg-terracotta group-hover:text-white transition-all transform active:scale-90"
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};
