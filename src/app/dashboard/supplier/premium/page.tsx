'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Zap, Shield, Crown, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { toast } from '@/stores/useToastStore';
import { Button } from '@/components/shared/Button';

interface Plan {
  id: number;
  name: string;
  price: number;
  productLimit: number;
  hasSpotlight: boolean;
  hasStats: boolean;
  hasBadge: boolean;
  priorityLevel: number;
}

export default function PremiumPage() {
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.role !== 'SUPPLIER') {
      router.replace('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get('/premium/plans'),
          user?.role === 'SUPPLIER' ? api.get('/premium/my-subscription').catch(() => ({ data: null })) : Promise.resolve({ data: null })
        ]);
        setPlans(plansRes.data.sort((a: Plan, b: Plan) => a.price - b.price));
        setCurrentSubscription(subRes.data);
      } catch (error) {
        console.error('Error fetching premium data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'SUPPLIER') {
      toast.error("Seuls les vendeurs peuvent souscrire à un abonnement.");
      return;
    }

    setSubscribing(plan.id);
    try {
      // For now, default to MOBILE_MONEY as payment method
      const res = await api.post('/premium/subscribe', {
        planName: plan.name,
        paymentMethod: 'MOBILE_MONEY',
      });
      
      // Update local state immediately
      setCurrentSubscription(res.data);
      
      // Update user's subscription in the auth store
      if (user) setAuth({ ...user, supplier: { ...user.supplier!, subscription: res.data } as any }, token!); 
      toast.success(`Félicitations ! Vous êtes maintenant abonné au plan ${plan.name}.`);
      // Optional: keep them on page to see the change, or move to profile
      // router.push('/profile'); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'abonnement.");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10">
        <Loader2 className="animate-spin text-terracotta" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="container mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
           <div className="flex justify-center mb-8">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-black text-[10px] uppercase tracking-widest">
              <Crown size={14} />
              Programme Partenaire
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-chocolate tracking-tighter leading-none">
            Abonnements Premium Fournisseur
          </h1>
          <p className="text-xl text-chocolate/60 font-medium leading-relaxed">
            Propulsez votre boutique au niveau supérieur avec nos outils de vente avancés et une visibilité prioritaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.name === 'PREMIUM';
            const isUltimate = plan.name === 'ULTIMATE';

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col p-10 rounded-[40px] transition-all duration-300 ${
                  isPopular 
                    ? 'bg-white shadow-2xl shadow-terracotta/10 border-2 border-terracotta scale-105 z-10' 
                    : 'bg-white/80 border border-sand hover:border-terracotta/30 hover:shadow-xl'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-terracotta text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-terracotta/20">
                    Plus Populaire
                  </div>
                )}

                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3">
                    {plan.name === 'FREE' && <Shield className="text-chocolate/20" size={28} />}
                    {plan.name === 'PREMIUM' && <Star className="text-terracotta" size={28} />}
                    {plan.name === 'ULTIMATE' && <Zap className="text-gold" size={28} />}
                    <h3 className="text-lg font-black text-chocolate uppercase tracking-widest">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-chocolate tracking-tighter">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-chocolate/40 uppercase">CFA /mois</span>
                  </div>
                  <p className="text-xs font-bold text-chocolate/50 leading-relaxed min-h-[40px]">
                    {plan.name === 'FREE' && "Idéal pour débuter votre activité sans frais fixes."}
                    {plan.name === 'PREMIUM' && "Maximisez votre impact local et gagnez en crédibilité."}
                    {plan.name === 'ULTIMATE' && "La solution ultime pour les entreprises en pleine expansion."}
                  </p>
                </div>

                <div className="flex-1 mb-10">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-sm font-bold text-chocolate/70">
                      <Check className="text-terracotta shrink-0" size={18} />
                      <span>Jurqu'à {plan.productLimit} produits</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-bold text-chocolate/70">
                      <Check className={plan.hasSpotlight ? "text-terracotta" : "text-sand"} size={18} />
                      <span className={!plan.hasSpotlight ? "text-chocolate/30 line-through" : ""}>Mise en avant sur l'accueil</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-bold text-chocolate/70">
                      <Check className={plan.hasStats ? "text-terracotta" : "text-sand"} size={18} />
                      <span className={!plan.hasStats ? "text-chocolate/30 line-through" : ""}>Statistiques avancées</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-bold text-chocolate/70">
                      <Check className={plan.hasBadge ? "text-terracotta" : "text-sand"} size={18} />
                      <span className={!plan.hasBadge ? "text-chocolate/30 line-through" : ""}>Badge Vendeur Vérifié</span>
                    </li>
                    {isUltimate && (
                      <li className="flex items-start gap-3 text-sm font-bold text-chocolate/70">
                        <Check className="text-terracotta" size={18} />
                        <span>Support prioritaire 24/7</span>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing === plan.id || currentSubscription?.planId === plan.id}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    currentSubscription?.planId === plan.id
                      ? 'bg-leaf text-white cursor-default'
                      : isPopular
                        ? 'bg-terracotta text-white shadow-xl shadow-terracotta/20 hover:bg-chocolate hover:scale-[1.02]'
                        : 'bg-sand/20 text-chocolate hover:bg-chocolate hover:text-white'
                  } disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                >
                  {subscribing === plan.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : currentSubscription?.planId === plan.id ? (
                    'Plan Actuel'
                  ) : (
                    plan.price === 0 ? 'Commencer' : 'Choisir ce plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-20 max-w-4xl mx-auto bg-chocolate/5 rounded-[40px] p-12 text-center md:text-left md:flex items-center gap-12">
          <div className="flex-1 space-y-4">
             <h3 className="text-2xl font-black text-chocolate tracking-tighter">Besoin d'un accompagnement personnalisé ?</h3>
             <p className="text-chocolate/60 font-bold leading-relaxed">
               Nos experts Teranga Fil sont là pour vous aider à configurer votre boutique et choisir le plan qui correspond à vos objectifs de croissance.
             </p>
          </div>
          <button className="flex-shrink-0 bg-white text-chocolate px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
             Prendre rendez-vous
          </button>
        </div>

      </div>
    </div>
  );
}
