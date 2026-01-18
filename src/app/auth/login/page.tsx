'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, ArrowRight, Loader2, User, Store } from 'lucide-react';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Email ou numéro de téléphone requis'),
  password: z.string().min(6, 'Mot de passe requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { user, token } = await authService.login(data);
      setAuth(user, token);
      
      if (user.role === 'ADMIN') router.push('/dashboard/admin');
      else if (user.role === 'SUPPLIER') router.push('/dashboard/supplier');
      else router.push('/');
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Identifiants invalides.');
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
            Bon de vous revoir !
          </h1>
          <p className="text-2xl text-sand/80 font-bold leading-relaxed">
            Accédez à vos outils et gérez votre passion en quelques clics.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          Teranga Fil © 2026
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 md:p-24">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-chocolate tracking-tighter leading-none">Connexion</h2>
            <p className="text-chocolate/40 font-bold text-sm tracking-tight italic">Entrez dans votre univers créatif.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {serverError && (
              <div className="p-5 bg-red-50 text-red-600 rounded-3xl text-sm font-bold border border-red-100 italic">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Identifiant</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <input {...register('identifier')} className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="Email ou Téléphone" />
              </div>
              {errors.identifier && <p className="text-[10px] text-red-500 font-black px-2">{errors.identifier.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em]">Sécurité</label>
                <Link href="#" className="text-[9px] font-black text-terracotta hover:underline uppercase tracking-widest italic leading-none">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <input {...register('password')} type="password" className="w-full bg-sand/30 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-[25px] py-4 pl-14 pr-6 outline-none transition-all font-bold text-sm" placeholder="••••••••" />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-black px-2">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-terracotta text-white py-6 rounded-[30px] font-black text-lg hover:bg-chocolate transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <>Entrer dans mon espace <ArrowRight size={24} /></>}
            </button>

            <p className="text-center text-sm font-bold text-chocolate/40 tracking-tight">
              Nouveau ici ? <Link href="/auth/register" className="text-terracotta font-black hover:underline uppercase tracking-widest text-[10px] ml-1">Créer un compte</Link>
            </p>
          </form>

          <footer className="pt-10 border-t border-sand flex justify-center gap-10 text-[9px] font-black text-chocolate/20 uppercase tracking-[0.3em] italic">
            <Link href="#" className="hover:text-terracotta transition-all">Aide</Link>
            <Link href="#" className="hover:text-terracotta transition-all">Confidentialité</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
