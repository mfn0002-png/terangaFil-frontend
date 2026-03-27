'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

interface PaymentSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentSandboxModal: React.FC<PaymentSandboxModalProps> = ({
  isOpen,
  onClose,
  token,
  orderId,
  amount,
  onSuccess,
  onCancel
}) => {
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen || status !== 'IDLE') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, status]);

  const handleConfirm = async () => {
    setStatus('PROCESSING');
    try {
      // Simuler le délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Appeler le callback backend pour confirmer le paiement
      await api.post('/payment/callback', {
        token: token,
        status: 'completed',
        transaction_id: `sandbox_txn_${Date.now()}`,
        payment_method: 'WAVE',
        order_id: Number(orderId)
      });
      
      setStatus('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement sandbox:', error);
      setStatus('ERROR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-chocolate/40 backdrop-blur-md transition-opacity"
        onClick={status === 'IDLE' ? onCancel : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[50px] overflow-hidden shadow-2xl border border-sand animate-in fade-in zoom-in duration-300">
        
        // h-32 Gradient removed, using solid chocolate
        <div className="h-32 bg-chocolate flex items-center justify-center relative">
          <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Paiement Sécurisé</p>
          </div>
        </div>

        <div className="p-10 -mt-10 bg-white rounded-t-[40px] space-y-8 text-center">
          
          {status === 'IDLE' && (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-chocolate tracking-tighter italic">Confirmation de votre Paiement</h2>
                <p className="text-chocolate/40 text-xs font-bold uppercase tracking-widest">Finalisation de la transaction</p>
              </div>

              <div className="text-5xl font-black text-terracotta tracking-tighter py-4">
                {amount.toLocaleString()} <span className="text-sm uppercase italic">FCFA</span>
              </div>

              <div className="bg-sand/20 rounded-[30px] p-6 space-y-4 text-left border border-sand">
                <div className="flex justify-between items-center border-b border-sand pb-3">
                  <span className="text-[10px] font-black text-chocolate/30 uppercase italic">Commande</span>
                  <span className="text-sm font-black text-chocolate italic">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-sand pb-3">
                  <span className="text-[10px] font-black text-chocolate/30 uppercase italic">Token</span>
                  <span className="text-[10px] font-mono font-bold text-chocolate/60 truncate max-w-[150px]">{token}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-chocolate/30 uppercase italic">Méthode</span>
                  <span className="text-sm font-black text-chocolate italic">WAVE / OM</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 bg-sand/30 text-chocolate py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Annuler
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 bg-terracotta text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-xl shadow-terracotta/20 flex items-center justify-center gap-2 group"
                >
                  <CheckCircle size={18} />
                  Confirmer
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-[10px] font-bold text-chocolate/30 uppercase tracking-widest">
                Paiement automatique dans <span className="text-terracotta">{countdown}s</span>...
              </p>
            </>
          )}

          {status === 'PROCESSING' && (
            <div className="py-20 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 border-4 border-sand border-t-terracotta rounded-full animate-spin" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-chocolate italic">Traitement en cours</h3>
                <p className="text-chocolate/40 text-xs font-bold uppercase tracking-widest">Veuillez patienter un instant</p>
              </div>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center justify-center gap-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-chocolate italic">Succès !</h3>
                <p className="text-chocolate/40 text-sm font-bold uppercase tracking-widest">Redirection en cours...</p>
              </div>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="py-12 flex flex-col items-center justify-center gap-6 animate-in shake-in">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-chocolate italic">Une erreur est survenue</h3>
                <button 
                  onClick={() => setStatus('IDLE')}
                  className="bg-chocolate text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-terracotta transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
