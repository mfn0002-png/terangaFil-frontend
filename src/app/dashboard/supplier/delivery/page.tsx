'use client';

import { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Plus, 
  Trash2, 
  Smartphone, 
  CreditCard, 
  Building2,
  Save,
  Info,
  Loader2,
  Check
} from 'lucide-react';
import { supplierService } from '@/services/supplierService';
import { toast } from '@/stores/useToastStore';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';

export default function DeliverySettingsPage() {
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'WAVE',
    phoneNumber: ''
  });
  const [rateToRemoveIndex, setRateToRemoveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rates, settings] = await Promise.all([
          supplierService.getShippingRates(),
          supplierService.getPaymentSettings().catch(() => ({ method: 'WAVE', phoneNumber: '' }))
        ]);
        setShippingRates(rates || []);
        if (settings) setPaymentInfo({
          method: settings.paymentMethod || 'WAVE',
          phoneNumber: settings.paymentPhoneNumber || ''
        });
      } catch (error) {
        console.error('Error fetching delivery settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddZone = () => {
    setShippingRates([...shippingRates, { zone: '', price: 0, delay: '24-48h' }]);
  };

  const handleUpdateRate = (index: number, field: string, value: any) => {
    const updated = [...shippingRates];
    updated[index][field] = value;
    setShippingRates(updated);
  };

  const handleRemoveRate = (index: number) => {
    const rate = shippingRates[index];
    if (rate.id) {
       setRateToRemoveIndex(index);
    } else {
       setShippingRates(shippingRates.filter((_, i) => i !== index));
    }
  };

  const confirmRemoveRate = async () => {
    if (rateToRemoveIndex === null) return;
    const rate = shippingRates[rateToRemoveIndex];
    try {
      await supplierService.deleteShippingRate(rate.id);
      setShippingRates(shippingRates.filter((_, i) => i !== rateToRemoveIndex));
      toast.success('Zone supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setRateToRemoveIndex(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save rates
      await Promise.all(shippingRates.map(rate => supplierService.saveShippingRate(rate)));
      // Save payment
      await supplierService.updatePaymentSettings(paymentInfo);
      toast.success('Paramètres enregistrés avec succès !');
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#E07A5F]" size={40} />
        <p className="text-[#3D2B1F]/40 font-black text-[10px] uppercase tracking-widest">Chargement de vos paramètres...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-[#F0E6D2]/30">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#3D2B1F] tracking-tighter">Paramètres de Livraison</h1>
          <p className="text-xs font-bold text-[#3D2B1F]/40 uppercase tracking-[0.2em] italic">Gérez vos zones de couverture et modes de paiement</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="px-10 py-4 bg-[#E07A5F] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#3D2B1F] transition-all shadow-2xl shadow-[#E07A5F]/20 active:scale-95 disabled:opacity-70 flex items-center gap-3"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Enregistrer les modifications
        </button>
      </div>

      {/* Shipping Zones */}
      <section className="space-y-8">
         <div className="flex items-center gap-3">
             <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">Zones de Livraison</h2>
             <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">Actif</span>
         </div>
         <p className="text-[11px] font-bold text-[#3D2B1F]/40 uppercase tracking-widest">Ajoutez les régions où vous pouvez expédier vos produits crochetés.</p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shippingRates.map((rate, i) => (
               <div key={i} className="bg-white rounded-[40px] p-8 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-8 relative group">
                  <button 
                    onClick={() => handleRemoveRate(i)}
                    className="absolute top-8 right-8 p-2 text-red-500/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#E07A5F]/10 rounded-xl flex items-center justify-center text-[#E07A5F]">
                        <MapPin size={20} />
                     </div>
                     <input 
                        type="text" 
                        value={rate.zone}
                        onChange={(e) => handleUpdateRate(i, 'zone', e.target.value)}
                        placeholder="Nom de la zone (ex: Dakar Plateau)"
                        className="flex-1 bg-transparent border-none text-lg font-black text-[#3D2B1F] outline-none placeholder:text-[#3D2B1F]/10"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#3D2B1F]/30 italic px-2">Tarif (FCFA)</label>
                        <input 
                           type="number"
                           value={rate.price}
                           onChange={(e) => handleUpdateRate(i, 'price', Number(e.target.value))}
                           className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E07A5F]/30"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#3D2B1F]/30 italic px-2">Délai (jours)</label>
                        <input 
                           type="text"
                           value={rate.delay}
                           onChange={(e) => handleUpdateRate(i, 'delay', e.target.value)}
                           className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E07A5F]/30"
                        />
                     </div>
                  </div>
               </div>
            ))}
            
            <button 
               onClick={handleAddZone}
               className="h-full min-h-[180px] bg-[#FDFCFB] border-2 border-dashed border-[#F0E6D2] rounded-[40px] flex flex-col items-center justify-center gap-3 text-[#3D2B1F]/30 hover:border-[#E07A5F]/30 hover:bg-white hover:text-[#E07A5F] transition-all group"
            >
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plus size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Ajouter une zone</span>
            </button>
         </div>
      </section>

      {/* Payment Info */}
      <section className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-12">
         <div className="space-y-2">
            <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">Informations de Paiement</h2>
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
               <Info className="text-blue-500 shrink-0" size={20} />
               <div className="space-y-1">
                  <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Calcul des commissions</p>
                  <p className="text-[10px] font-bold text-blue-900/40">Note: Une commission de 15% est déduite automatiquement de chaque vente pour les frais de service de la plateforme.</p>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 italic px-2">Comment souhaitez-vous recevoir vos gains ?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { id: 'WAVE', name: 'Wave', detail: 'Paiement instantané', icon: Smartphone, color: 'border-orange-500 bg-orange-50/10' },
                 { id: 'OM', name: 'Orange Money', detail: 'Sous 24 heures', icon: Smartphone, color: 'border-[#3D2B1F] bg-black text-white' },
                 { id: 'BANK', name: 'Virement Bancaire', detail: 'Sous 3-5 jours', icon: Building2, color: 'border-gray-100 bg-gray-50' },
               ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentInfo({...paymentInfo, method: m.id})}
                    className={`relative p-8 rounded-[35px] border-4 text-left transition-all ${paymentInfo.method === m.id ? m.color : 'border-[#FDFCFB] bg-[#FDFCFB] hover:border-[#F0E6D2]'}`}
                  >
                     <div className={`p-3 rounded-xl mb-4 inline-block ${paymentInfo.method === m.id ? 'bg-white/20' : 'bg-[#3D2B1F]/5 text-[#3D2B1F]/30'}`}>
                        <m.icon size={24} />
                     </div>
                     <p className={`text-base font-black ${paymentInfo.method === m.id ? '' : 'text-[#3D2B1F]'}`}>{m.name}</p>
                     <p className={`text-[10px] font-bold opacity-40 uppercase tracking-widest`}>{m.detail}</p>
                     {paymentInfo.method === m.id && (
                        <div className="absolute top-6 right-6 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                           <Check size={14} />
                        </div>
                     )}
                  </button>
               ))}
            </div>

            <div className="space-y-4 max-w-md">
               <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 italic px-2">Numéro de téléphone lié</label>
               <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <span className="text-sm font-black text-[#3D2B1F]/30">+221</span>
                     <div className="w-px h-4 bg-[#F0E6D2]" />
                  </div>
                  <input 
                    type="tel" 
                    value={paymentInfo.phoneNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, phoneNumber: e.target.value})}
                    placeholder="77 000 00 00"
                    className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-5 pl-24 pr-8 text-sm font-black outline-none focus:border-[#E07A5F]/30"
                  />
               </div>
               <p className="text-[9px] font-bold text-[#3D2B1F]/40 uppercase italic px-4">Utilisé pour les transferts automatiques de fonds.</p>
            </div>
         </div>

         <div className="pt-10 border-t border-[#F0E6D2]/20 flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#3D2B1F]/20 uppercase tracking-widest">Les transferts sont effectués chaque mardi à 10:00 AM UTC.</p>
             <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" onClick={() => {}}>Annuler</Button>
                <Button 
                  onClick={handleSaveAll}
                  loading={saving}
                  size="md"
                >
                  Sauvegarder tout
                </Button>
             </div>
         </div>
      </section>

      <Modal
        isOpen={rateToRemoveIndex !== null}
        onClose={() => setRateToRemoveIndex(null)}
        title="Supprimer la zone"
        subtitle={rateToRemoveIndex !== null ? shippingRates[rateToRemoveIndex]?.zone : ''}
        icon={Trash2}
        maxWidth="md"
      >
        <div className="space-y-8">
           <p className="text-sm font-bold text-[#3D2B1F]/60 leading-relaxed italic">Êtes-vous sûr de vouloir supprimer cette zone de livraison ? Cette action est irréversible.</p>
           <div className="flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={() => setRateToRemoveIndex(null)}>Annuler</Button>
              <Button variant="danger" className="flex-1" onClick={confirmRemoveRate}>Oui, supprimer</Button>
           </div>
        </div>
      </Modal>

    </div>
  );
}
