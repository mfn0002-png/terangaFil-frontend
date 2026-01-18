'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Shield, 
  Bell, 
  Store, 
  LogOut, 
  Loader2, 
  Camera, 
  CheckCircle2 
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, token, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'NOTIFICATIONS' | 'SHOP'>('PROFILE');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch latest user data
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setFormData({
          name: res.data.name,
          email: res.data.email || '',
          phoneNumber: res.data.phoneNumber || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/me', formData);
      // Update local store with new info (keeping token and id/role same)
      if (user) {
        setAuth({ ...user, ...res.data }, token!);
      }
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sand/10 py-12 font-sans">
      <div className="container mx-auto px-4">
        
        {/* Header simple */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black text-chocolate tracking-tighter">Mon Compte</h1>
          {user.role === 'SUPPLIER' && (
            <button 
                onClick={() => router.push('/premium')}
                className="bg-gradient-to-r from-gold to-yellow-500 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-gold/20 hover:scale-105 transition-transform"
            >
                Passer Premium
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[35px] p-6 shadow-xl shadow-chocolate/5 border border-sand">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center text-white font-black text-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-chocolate truncate">{user.name}</h3>
                  <p className="text-[10px] font-black text-terracotta uppercase tracking-widest">{user.role}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'PROFILE', label: 'Mon Profil', icon: User },
                  { id: 'SECURITY', label: 'Sécurité', icon: Shield },
                  { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
                  ...(user.role === 'client' ? [{ id: 'ADDRESS', label: 'Adresses', icon: MapPin }] : []),
                  ...(user.role !== 'client' ? [{ id: 'SHOP', label: 'Ma Boutique', icon: Store }] : []),
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === item.id 
                        ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' 
                        : 'text-chocolate/40 hover:bg-sand/20 hover:text-chocolate'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-6 mt-6 border-t border-sand">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-[45px] p-10 shadow-2xl shadow-chocolate/5 border border-sand min-h-[600px]">
              
              {activeTab === 'PROFILE' && (
                <div className="space-y-10 max-w-2xl">
                   <div className="flex items-center gap-6">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-sand/20 border-2 border-sand flex items-center justify-center overflow-hidden">
                           <User size={40} className="text-chocolate/20" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="text-white" size={24} />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-chocolate italic">Photo de profil</h2>
                        <p className="text-xs text-chocolate/40 font-bold mt-1">.JPG, .PNG (Max 2MB)</p>
                      </div>
                   </div>

                   <hr className="border-sand" />

                   <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Nom Complet</label>
                           <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Téléphone</label>
                           <input 
                              type="tel" 
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                              className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" 
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                           <label className="text-[10px] font-black text-chocolate/30 uppercase tracking-[0.2em] px-2">Email</label>
                           <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-sand/20 border-2 border-transparent focus:border-terracotta/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all" 
                           />
                      </div>
                   </div>

                   <div className="flex justify-end pt-8">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-terracotta text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-chocolate transition-all flex items-center gap-3 disabled:opacity-70"
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        Enregistrer
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'SECURITY' && (
                <div className="space-y-8 opacity-50 cursor-not-allowed filter grayscale">
                   <h2 className="text-2xl font-black text-chocolate italic">Sécurité</h2>
                   <p className="text-sm font-bold text-chocolate/40">La modification du mot de passe sera disponible bientôt.</p>
                </div>
              )}

              {activeTab === 'SHOP' && (
                <div className="text-center py-20 space-y-6">
                   <Store size={64} className="mx-auto text-chocolate/10" />
                   <h2 className="text-2xl font-black text-chocolate">Votre Boutique</h2>
                   <p className="max-w-md mx-auto text-chocolate/40 font-bold">
                     Gérez vos produits, commandes et abonnements depuis votre dashboard dédié.
                   </p>
                   <button 
                      onClick={() => router.push('/dashboard/supplier')}
                      className="px-8 py-4 bg-terracotta text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-chocolate transition-all"
                   >
                     Accéder au Dashboard Vendeur
                   </button>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
