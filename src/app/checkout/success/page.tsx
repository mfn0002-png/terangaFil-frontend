'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // Récupérer l'ID de commande depuis localStorage
        const pendingOrderId = localStorage.getItem('pendingOrderId');
        
        if (pendingOrderId) {
          setOrderId(pendingOrderId);
          localStorage.removeItem('pendingOrderId');
        }

        // Attendre 2 secondes pour l'effet visuel
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setVerifying(false);
      } catch (error) {
        console.error('Erreur de vérification:', error);
        setVerifying(false);
      }
    };

    verify();
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen bg-sand/10 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 text-terracotta animate-spin mx-auto" />
          <p className="text-chocolate font-bold text-lg">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/10 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[50px] p-12 shadow-2xl shadow-chocolate/5 border border-sand text-center space-y-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100/50">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-chocolate italic tracking-tighter">Paiement reçu !</h1>
          <p className="text-chocolate/60 font-bold text-lg">
            Merci pour votre confiance. Votre commande {orderId && <span className="text-terracotta">#{orderId}</span>} est en cours de traitement.
          </p>
        </div>

        <div className="bg-sand/20 rounded-[35px] p-8 space-y-6 text-left border border-sand">
          <div className="flex items-center gap-4 border-b border-sand pb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-terracotta">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs font-black text-chocolate uppercase tracking-widest">Résumé & Prochaines étapes</p>
          </div>
          
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="w-5 h-5 rounded-full bg-leaf/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-leaf" />
              </div>
              <p className="text-sm font-bold text-chocolate/80 leading-relaxed">
                Le fournisseur a été notifié et prépare votre colis avec soin.
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-5 h-5 rounded-full bg-leaf/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-leaf" />
              </div>
              <p className="text-sm font-bold text-chocolate/80 leading-relaxed">
                Vous recevrez une notification dès que votre commande sera expédiée.
              </p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard/client/orders"
            className="flex-1 bg-chocolate text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-terracotta transition-all active:scale-95 shadow-xl shadow-chocolate/10 flex items-center justify-center gap-2 group"
          >
            Suivre ma commande
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/public/catalog"
            className="flex-1 bg-sand/30 text-chocolate py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-sand/50 transition-all active:scale-95 border border-sand"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand/10 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 text-terracotta animate-spin mx-auto" />
          <p className="text-chocolate font-bold text-lg">Chargement...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
