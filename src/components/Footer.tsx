'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-chocolate text-sand pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white tracking-tighter">
                Teranga <span className="text-terracotta italic font-normal">Fil</span>
              </span>
            </Link>
            <p className="text-sand/50 text-sm leading-relaxed max-w-xs font-medium">
              Le premier marché panafricain dédié aux passionnés du crochet et de la mercerie. Connectez-vous avec le meilleur de l'artisanat local.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-terracotta hover:text-white transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Marketplace</h4>
            <ul className="space-y-4 text-xs font-bold text-sand/40">
              <li><Link href="/public/catalog" className="hover:text-terracotta transition-colors uppercase tracking-widest">Tous les produits</Link></li>
              <li><Link href="/auth/register" className="hover:text-terracotta transition-colors uppercase tracking-widest">Devenir vendeur</Link></li>
              <li><Link href="/public/suppliers" className="hover:text-terracotta transition-colors uppercase tracking-widest">Nos fournisseurs</Link></li>
              <li><Link href="#" className="hover:text-terracotta transition-colors uppercase tracking-widest">Fils & Laines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Support</h4>
            <ul className="space-y-4 text-xs font-bold text-sand/40">
              <li><Link href="#" className="hover:text-terracotta transition-colors uppercase tracking-widest">Centre d&apos;aide</Link></li>
              <li><Link href="#" className="hover:text-terracotta transition-colors uppercase tracking-widest">Livraison</Link></li>
              <li><Link href="#" className="hover:text-terracotta transition-colors uppercase tracking-widest">Retours</Link></li>
              <li><Link href="#" className="hover:text-terracotta transition-colors uppercase tracking-widest">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-8 uppercase tracking-[0.2em] text-[10px]">Communauté</h4>
            <ul className="space-y-4 text-xs font-bold text-sand/40">
              <li><span className="opacity-50">© 2026 Teranga Fil. Fait avec passion en Afrique.</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-sand/30 uppercase tracking-[0.2em]">
          <p>Teranga Fil - Marketplace Artisanale</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-terracotta transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-terracotta transition-colors">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
