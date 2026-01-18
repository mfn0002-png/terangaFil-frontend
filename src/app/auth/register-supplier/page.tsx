'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, User, Mail, Phone, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const supplierSchema = z.object({
  shopName: z.string().min(3, 'Le nom de la boutique doit faire au moins 3 caractères'),
  managerName: z.string().min(3, 'Le nom du responsable est requis'),
  email: z.string().email('Email invalide'),
  phoneNumber: z.string().min(8, 'Numéro de téléphone invalide'),
  category: z.string().min(1, 'Veuillez choisir une catégorie'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SupplierRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  });

  const onSubmit = async (data: SupplierFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { user, token } = await authService.registerSupplier({
        name: data.managerName,
        email: data.email,
        password: data.password,
        shopName: data.shopName,
        phoneNumber: data.phoneNumber,
        category: data.category
      });
      
      setAuth(user, token);
      router.push('/dashboard/supplier');
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-16 flex-col justify-between text-white">
        <Image src="/images/auth_sidebar.png" alt="Artisanat Textile" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-chocolate/50 backdrop-blur-[4px]" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="bg-terracotta p-3 rounded-2xl shadow-xl shadow-terracotta/20">
            <Store className="text-white" size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter italic">Teranga Fil</span>
        </Link>

        <div className="relative z-10 space-y-8 max-w-lg">
          <h1 className="text-7xl font-black leading-[0.95] tracking-tighter">
            Faites grandir votre boutique
          </h1>
          <p className="text-2xl text-sand/80 font-bold leading-relaxed">
            Rejoignez le premier marché dédié à l&apos;artisanat textile d&apos;Afrique.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[30px] border border-white/20 inline-flex items-center gap-6 shadow-2xl">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-sand/20 flex items-center justify-center text-[10px] font-black uppercase">
                  ART
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-terracotta text-white flex items-center justify-center text-[10px] font-black">
                +500
              </div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest opacity-80">Artisans déjà inscrits</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 md:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-chocolate tracking-tighter leading-none">Inscription Vendeur</h2>
            <p className="text-chocolate/40 font-bold text-sm tracking-tight italic">C&apos;est le moment de commencer votre aventure.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="p-5 bg-red-50 text-red-600 rounded-3xl text-sm font-bold border border-red-100 italic">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Boutique</label>
                <div className="relative group">
                  <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                  <input {...register('shopName')} className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="Nom" />
                </div>
                {errors.shopName && <p className="text-[10px] text-red-500 font-black px-2">{errors.shopName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Gérant</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                  <input {...register('managerName')} className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="Nom complet" />
                </div>
                {errors.managerName && <p className="text-[10px] text-red-500 font-black px-2">{errors.managerName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Email Pro</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <input {...register('email')} type="email" className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="contact@boutique.com" />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-black px-2">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                  <input {...register('phoneNumber')} className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="77..." />
                </div>
                {errors.phoneNumber && <p className="text-[10px] text-red-500 font-black px-2">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Sécurité</label>
                <input {...register('password')} type="password" className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 px-6 outline-none transition-all font-bold text-sm" placeholder="••••••" />
                {errors.password && <p className="text-[10px] text-red-500 font-black px-2">{errors.password.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Spécialité</label>
              <div className="relative group">
                <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <select {...register('category')} className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-10 outline-none transition-all appearance-none cursor-pointer font-bold text-sm">
                  <option value="">Sélectionnez</option>
                  <option value="fils">Fils & Pelotes</option>
                  <option value="accessoires">Accessoires</option>
                  <option value="kits">Kits de création</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta pointer-events-none" size={20} />
              </div>
              {errors.category && <p className="text-[10px] text-red-500 font-black px-2">{errors.category.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-terracotta text-white py-6 rounded-[30px] font-black text-lg hover:bg-chocolate transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <>Créer mon shop <ArrowRight size={24} /></>}
            </button>

            <p className="text-center text-sm font-bold text-chocolate/40 tracking-tight">
              Déjà inscrit ? <Link href="/auth/login" className="text-terracotta font-black hover:underline uppercase tracking-widest text-[10px] ml-1">Se connecter</Link>
            </p>
          </form>

          <footer className="pt-10 border-t border-sand flex justify-between text-[9px] font-black text-chocolate/20 uppercase tracking-widest italic">
            <Link href="#">CGV</Link>
            <Link href="#">Confidentialité</Link>
            <Link href="#">Support</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
