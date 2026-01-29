'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Store
} from 'lucide-react';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { toast } from '@/stores/useToastStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemsBySupplier, clearCart } = useCartStore();
  const groupedItems = getItemsBySupplier();
  const totalPrice = getTotalPrice();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success('Panier vidé');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-sand/50 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={48} className="text-chocolate/20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-chocolate tracking-tighter">Votre panier est vide</h1>
          <p className="text-chocolate/40 font-bold italic">Commencez à explorer nos merceries locales.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-terracotta text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-chocolate transition-all shadow-xl shadow-terracotta/20">
          Explorer la boutique
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sand/10 min-h-screen pb-32">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-1.5 bg-terracotta rounded-full"></div>
            <h1 className="text-4xl font-black text-chocolate uppercase tracking-[0.1em]">Mon Panier</h1>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-200 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Main Cart Content */}
          <div className="lg:col-span-2 space-y-12">
            {Object.entries(groupedItems).map(([supplierId, supplierItems]) => (
              <div key={supplierId} className="bg-white rounded-[45px] shadow-sm border border-sand overflow-hidden">
                {/* Supplier Header */}
                <div className="bg-sand/30 px-10 py-6 flex items-center justify-between border-b border-sand">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Store size={24} className="text-terracotta" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-chocolate uppercase tracking-widest leading-none">
                        Vendu par{' '}
                        <Link 
                          href={`/public/supplier/${supplierId}`} 
                          className="text-terracotta hover:underline"
                        >
                          {supplierItems[0].supplierName}
                        </Link>
                      </h3>
                      <p className="text-[10px] font-bold text-chocolate/30 uppercase mt-1">Expédié depuis Dakar</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-leaf bg-leaf/10 px-4 py-2 rounded-full">
                    <Truck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Livraison groupée disponible</span>
                  </div>
                </div>

                {/* Items from this supplier */}
                <div className="divide-y divide-sand">
                  {supplierItems.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${item.shippingZone}`} className="p-10 flex flex-col sm:flex-row items-center gap-10">
                      <div className="relative w-32 h-32 bg-sand/20 rounded-[30px] overflow-hidden flex-shrink-0 border border-sand">
                        <Image src={item.image} alt={item.name} fill className="object-cover p-4" />
                      </div>
                      
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-chocolate tracking-tight italic">{item.name}</h4>
                        <p className="text-xs font-bold text-chocolate/30 uppercase tracking-widest">{item.supplierName}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.selectedColor && (
                            <span className="inline-block px-3 py-1 bg-terracotta/10 text-terracotta text-[10px] font-bold rounded-full uppercase tracking-widest">
                              Couleur: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="inline-block px-3 py-1 bg-leaf/10 text-leaf text-[10px] font-bold rounded-full uppercase tracking-widest">
                              Taille: {item.selectedSize}
                            </span>
                          )}
                          {item.shippingZone && (
                            <span className="inline-block px-3 py-1 bg-sand text-chocolate text-[10px] font-bold rounded-full uppercase tracking-widest">
                              Zone: {item.shippingZone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center bg-sand/30 rounded-full p-2 border border-sand">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize, item.shippingZone)}
                            className="w-10 h-10 flex items-center justify-center text-chocolate/50 hover:text-terracotta transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-black text-chocolate text-sm line-clamp-1">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize, item.shippingZone)}
                             className="w-10 h-10 flex items-center justify-center text-chocolate/50 hover:text-terracotta transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.selectedColor, item.selectedSize, item.shippingZone)}
                          className="text-[10px] font-black text-chocolate/20 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>

                      <div className="text-right sm:min-w-[120px]">
                        <p className="text-2xl font-black text-chocolate tracking-tighter">
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Warning Multi-Supplier */}
            {Object.keys(groupedItems).length > 1 && (
              <div className="bg-chocolate text-sand p-10 rounded-[40px] flex items-start gap-6 shadow-2xl">
                <div className="p-4 bg-terracotta rounded-3xl">
                  <Truck size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-extrabold tracking-tight">Information Livraison</h4>
                  <p className="text-sm font-medium opacity-70 leading-relaxed">
                    Vous commandez auprès de <span className="text-white font-bold">{Object.keys(groupedItems).length} boutiques différentes</span>. 
                    Vous recevrez donc vos articles dans des colis séparés et les frais de livraison s'appliqueront par vendeur.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          <div className="space-y-8 sticky top-32">
            <div className="bg-white rounded-[45px] shadow-xl border border-sand p-10 space-y-8">
              <h3 className="text-2xl font-black text-chocolate tracking-tighter border-b border-sand pb-6">Récapitulatif</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-chocolate/40 uppercase tracking-widest">
                  <span>Sous-total items</span>
                  <span className="text-chocolate font-black">{totalPrice.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-chocolate/40 uppercase tracking-widest">
                  <span>Frais de port (est.)</span>
                  <span className="text-leaf font-black">À calculer</span>
                </div>
                <div className="pt-6 border-t border-sand flex justify-between items-end">
                  <span className="text-xs font-black text-chocolate uppercase tracking-[0.2em]">Total TTC</span>
                  <span className="text-4xl font-black text-terracotta tracking-tighter">{totalPrice.toLocaleString()} CFA</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Link 
                  href="/checkout"
                  className="w-full bg-terracotta text-white py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-4"
                >
                  Passer à la caisse
                  <ArrowRight size={20} />
                </Link>
                <div className="flex items-center justify-center gap-3 text-[9px] font-black text-chocolate/30 uppercase tracking-widest italic">
                  <ShieldCheck size={14} /> Paiements sécurisés Wave & Orange Money
                </div>
              </div>
            </div>

            {/* Quick Promo */}
            <div className="bg-leaf p-10 rounded-[40px] text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Offre de bienvenue</p>
              <h5 className="text-2xl font-black tracking-tight mb-4 leading-none italic">-10% sur votre première commande</h5>
              <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center">
                <span className="font-black tracking-widest">TERANGA24</span>
                <button className="text-[10px] font-black underline uppercase">Copier</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Vider le panier"
        subtitle="Cette action supprimera tous vos articles."
        icon={Trash2}
        maxWidth="md"
      >
        <div className="space-y-8">
           <p className="text-sm font-bold text-chocolate/60 leading-relaxed italic">Êtes-vous sûr de vouloir vider complètement votre panier ? Cette action est irréversible.</p>
           <div className="flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={() => setShowClearModal(false)}>Annuler</Button>
              <Button variant="danger" className="flex-1" onClick={confirmClearCart}>Oui, vider tout</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
}
