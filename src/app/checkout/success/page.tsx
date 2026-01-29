'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
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
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-chocolate/5 border border-sand text-center space-y-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-chocolate">Paiement réussi !</h1>
          <p className="text-chocolate/60 font-bold">
            Votre commande {orderId && `#${orderId}`} a été confirmée avec succès.
          </p>
        </div>

        <div className="bg-sand/20 rounded-3xl p-6 space-y-2">
          <p className="text-xs font-black text-chocolate/40 uppercase tracking-widest">Prochaines étapes</p>
          <p className="text-sm font-bold text-chocolate/80">
            Vous recevrez un SMS de confirmation avec les détails de votre commande et le suivi de livraison.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/"
            className="w-full bg-terracotta text-white py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-lg shadow-terracotta/20"
          >
            Retour à l'accueil
          </Link>
          <Link 
            href="/products"
            className="w-full bg-sand/50 text-chocolate py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-sand transition-all active:scale-95"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
