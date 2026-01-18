'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  CreditCard, 
  MapPin, 
  ChevronRight,
  Info,
  ArrowRight
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function CheckoutPage() {
  const { items, getItemsBySupplier, getTotalPrice, checkoutInfo, setCheckoutInfo } = useCartStore();
  const groupedItems = getItemsBySupplier();
  
  const [activePayment, setActivePayment] = useState<'WAVE' | 'OM' | 'CARD'>('WAVE');

  const shippingFeesPerSupplier = 1500; // Frais fixes par boutique pour l'exemple
  const totalVendors = Object.keys(groupedItems).length;
  const totalShipping = totalVendors * shippingFeesPerSupplier;
  const grandTotal = getTotalPrice() + totalShipping;

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chocolate/30 mb-8">
          <Link href="/cart" className="hover:text-terracotta">Panier</Link>
          <ChevronRight size={10} />
          <span className="text-chocolate/60">Paiement</span>
        </nav>

        <h1 className="text-5xl font-black text-chocolate tracking-tighter mb-12 italic">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Step 1: Livraison */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-terracotta text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg shadow-terracotta/20">1</div>
                <h2 className="text-3xl font-black text-chocolate tracking-tight">Informations de livraison</h2>
              </div>
              
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-chocolate/5 border border-sand space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest ml-2 italic">Prénom</label>
                    <div className="relative">
                       <input 
                        type="text" 
                        placeholder="Ex: Aminata" 
                        value={checkoutInfo.firstName}
                        onChange={(e) => setCheckoutInfo({ firstName: e.target.value })}
                        className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all placeholder:text-chocolate/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest ml-2 italic">Nom</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Diop" 
                      value={checkoutInfo.lastName}
                      onChange={(e) => setCheckoutInfo({ lastName: e.target.value })}
                      className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all placeholder:text-chocolate/20" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest ml-2 italic">Téléphone</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-chocolate/30 font-bold text-sm">
                       <span>+221</span>
                       <div className="w-px h-4 bg-chocolate/10" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="77 000 00 00" 
                      value={checkoutInfo.phoneNumber}
                      onChange={(e) => setCheckoutInfo({ phoneNumber: e.target.value })}
                      className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 pl-20 pr-6 text-sm font-bold outline-none transition-all placeholder:text-chocolate/20" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-widest ml-2 italic">Adresse complète</label>
                  <input 
                    type="text" 
                    placeholder="Rue, Quartier, Ville" 
                    value={checkoutInfo.address}
                    onChange={(e) => setCheckoutInfo({ address: e.target.value })}
                    className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all placeholder:text-chocolate/20" 
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Paiement */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-terracotta text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg shadow-terracotta/20">2</div>
                <h2 className="text-3xl font-black text-chocolate tracking-tight">Moyen de paiement</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { id: 'WAVE', name: 'Wave', color: 'bg-[#40DAFF]' },
                   { id: 'OM', name: 'Orange Money', color: 'bg-[#FF6600]' },
                   { id: 'CARD', name: 'Carte Bancaire', color: 'bg-chocolate' }
                 ].map((method) => (
                   <button 
                     key={method.id}
                     onClick={() => setActivePayment(method.id as any)}
                     className={`relative overflow-hidden bg-white rounded-[30px] p-8 border-2 transition-all flex flex-col items-center gap-4 text-center group ${activePayment === method.id ? 'border-terracotta shadow-2xl shadow-terracotta/10 scale-[1.02]' : 'border-sand hover:border-sand/80'}`}
                   >
                     {activePayment === method.id && (
                       <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-4 border-terracotta bg-white" />
                     )}
                     <div className={`w-12 h-12 rounded-2xl ${method.color} flex items-center justify-center text-white shadow-lg`}>
                       {method.id === 'CARD' ? <CreditCard /> : <span className="font-black text-[10px] italic">WAVE</span>}
                     </div>
                     <span className="font-black text-xs uppercase tracking-widest text-chocolate">{method.name}</span>
                   </button>
                 ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-8">
             <div className="bg-white rounded-[45px] p-8 shadow-2xl shadow-chocolate/5 border border-sand space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-chocolate italic">Récapitulatif de la commande</h3>
                </div>

                <div className="bg-leaf/5 rounded-3xl p-6 border border-leaf/10 flex gap-4">
                   <Info className="text-leaf shrink-0" size={20} />
                   <p className="text-[11px] font-bold text-leaf leading-relaxed uppercase tracking-tight">Note: Vos articles seront livrés séparément par chaque boutique.</p>
                </div>

                {/* Grouped items by supplier */}
                <div className="space-y-10">
                   {Object.keys(groupedItems).map((supplierId) => {
                     const items = groupedItems[supplierId];
                     return (
                       <div key={supplierId} className="space-y-6">
                          <div className="flex items-center justify-between border-b border-sand pb-4">
                             <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em]">{items[0].supplierName}</h4>
                                <p className="text-[8px] font-bold text-chocolate/30 uppercase tracking-widest">Livraison 24-48h</p>
                             </div>
                             <span className="text-[9px] font-black text-leaf uppercase tracking-widest bg-leaf/10 px-3 py-1 rounded-full">En stock</span>
                          </div>

                          <div className="space-y-6">
                             {items.map((item) => (
                               <div key={item.id} className="flex gap-4">
                                  <div className="w-16 h-16 rounded-2xl bg-sand/20 overflow-hidden shrink-0 relative">
                                     <Image src={item.image} alt={item.name} fill className="object-cover p-2" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                     <h5 className="font-bold text-chocolate text-sm tracking-tight">{item.name}</h5>
                                     <p className="text-[10px] font-bold text-chocolate/30">Qté: {item.quantity}</p>
                                     <p className="font-black text-chocolate text-xs tracking-tighter">{item.price.toLocaleString()} CFA</p>
                                  </div>
                               </div>
                             ))}
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold text-chocolate/40 uppercase tracking-widest">
                             <span>Frais de port ({items[0].supplierName})</span>
                             <span className="text-terracotta">+{shippingFeesPerSupplier.toLocaleString()} CFA</span>
                          </div>
                       </div>
                     );
                   })}
                </div>

                {/* Subtotals & Total */}
                <div className="pt-8 border-t-2 border-dashed border-sand space-y-4">
                   <div className="flex justify-between text-xs font-bold text-chocolate/60">
                      <span>Sous-total articles</span>
                      <span className="font-black text-chocolate">{getTotalPrice().toLocaleString()} CFA</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-chocolate/60">
                      <span>Total Frais de port</span>
                      <span className="font-black text-chocolate">{totalShipping.toLocaleString()} CFA</span>
                   </div>
                   <div className="flex justify-between items-center pt-6">
                      <span className="text-xl font-black text-chocolate uppercase tracking-widest">Total</span>
                      <span className="text-3xl font-black text-terracotta tracking-tighter">{grandTotal.toLocaleString()} CFA</span>
                   </div>
                </div>

                <button className="w-full bg-terracotta text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-4 group">
                  Confirmer la commande
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <p className="text-center text-[8px] font-bold text-chocolate/20 uppercase tracking-widest leading-relaxed">En confirmant, vous acceptez nos conditions générales de vente et la politique de confidentialité.</p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
