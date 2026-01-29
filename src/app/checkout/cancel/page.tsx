'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Nettoyer le localStorage
    localStorage.removeItem('pendingOrderId');
  }, []);

  return (
    <div className="min-h-screen bg-sand/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl shadow-chocolate/5 border border-sand text-center space-y-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-chocolate">Paiement annulé</h1>
          <p className="text-chocolate/60 font-bold">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>
        </div>

        <div className="bg-sand/20 rounded-3xl p-6 space-y-2">
          <p className="text-xs font-black text-chocolate/40 uppercase tracking-widest">Besoin d'aide ?</p>
          <p className="text-sm font-bold text-chocolate/80">
            Si vous rencontrez des difficultés, n'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/checkout"
            className="w-full bg-terracotta text-white py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-chocolate transition-all active:scale-95 shadow-lg shadow-terracotta/20"
          >
            Réessayer le paiement
          </Link>
          <Link 
            href="/"
            className="w-full bg-sand/50 text-chocolate py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-sand transition-all active:scale-95"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
