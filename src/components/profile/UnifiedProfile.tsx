'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Store, 
  LogOut, 
  Camera, 
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Heart,
  MapPin,
  ExternalLink,
  Link
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { favoriteService, Favorite } from '@/services/favoriteService';
import api from '@/lib/api';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { toast } from '@/stores/useToastStore';

export const UnifiedProfile = () => {
  const { user, token, logout, setAuth } = useAuthStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'NOTIFICATIONS' | 'SHOP' | 'FAVORITES'>('PROFILE');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    shopName: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    address: 'Dakar, Sénégal',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userData, favData, subData] = await Promise.all([
          authService.getMe(),
          user?.role === 'CLIENT' ? favoriteService.getFavorites() : Promise.resolve([]),
          user?.role === 'SUPPLIER' ? api.get('/premium/my-subscription').catch(() => ({ data: null })) : Promise.resolve({ data: null })
        ]);

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          shopName: userData.supplier?.shopName || '',
          description: userData.supplier?.description || '',
          logoUrl: userData.supplier?.logoUrl || '',
          bannerUrl: userData.supplier?.bannerUrl || '',
          address: 'Dakar, Sénégal',
        });

        if (favData) setFavorites(favData);
        if (subData?.data) setCurrentSubscription(subData.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router, user?.role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'PROFILE') {
        const updatedUser = await authService.updateMe({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        });
        if (user) setAuth({ ...user, ...updatedUser }, token!);
        toast.success('Profil mis à jour !');
      } else if (activeTab === 'SHOP') {
        await api.post('/supplier/setup', {
          shopName: formData.shopName,
          description: formData.description
        });
        const userData = await authService.getMe();
        if (userData && user) setAuth({ ...user, ...userData }, token!);
        toast.success('Boutique mise à jour !');
      } else if (activeTab === 'SECURITY') {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
           throw new Error('Les mots de passe ne correspondent pas.');
        }
        await api.patch('/users/me/password', {
           currentPassword: passwordData.currentPassword,
           newPassword: passwordData.newPassword
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Mot de passe modifié !');
      }
    } catch (error: any) {
      toast.error(error.message || error.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#E07A5F]" size={40} />
        <p className="text-[#3D2B1F]/40 font-black text-[10px] uppercase tracking-widest">Chargement de votre univers...</p>
      </div>
    );
  }

  const navItems = [
    { id: 'PROFILE', label: 'Mon Profil', icon: User },
    { id: 'SECURITY', label: 'Sécurité', icon: Shield },
    { id: 'NOTIFICATIONS', label: 'Alertes', icon: Bell },
    ...(user.role === 'CLIENT' ? [{ id: 'FAVORITES', label: 'Mes Favoris', icon: Heart }] : []),
    ...(user.role === 'SUPPLIER' ? [{ id: 'SHOP', label: 'Ma Boutique', icon: Store }] : []),
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#3D2B1F] tracking-tighter italic">Espace Personnel</h1>
          <p className="text-[10px] font-bold text-[#3D2B1F]/40 uppercase tracking-[0.2em]">Rédigez votre histoire, gérez vos trésors</p>
        </div>
        {user.role === 'SUPPLIER' && (
          <div className="flex items-center gap-4">
             <Link href={`/public/supplier/${user.supplier?.id}`} target="_blank">
                <Button variant="outline" size="sm" icon={ExternalLink}>Voir Boutique Publique</Button>
             </Link>
             <button 
                onClick={() => router.push('/dashboard/supplier/premium')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg transition-all hover:scale-105 ${
                  currentSubscription ? 'bg-leaf text-white shadow-leaf/20' : 'bg-gold text-white shadow-gold/20'
                }`}
            >
                {currentSubscription ? <CheckCircle2 size={14} /> : <ImageIcon size={14} />}
                {currentSubscription ? `${currentSubscription.plan.name} Actif` : 'Passer Premium'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-[40px] p-6 shadow-xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30">
          <div className="flex flex-col items-center text-center gap-4 mb-10 px-2 pt-4">
            <div className="relative group">
               <div className="w-24 h-24 bg-[#E07A5F] rounded-[35px] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-[#E07A5F]/20 overflow-hidden">
                 {user.role === 'SUPPLIER' && formData.logoUrl ? <img src={formData.logoUrl} alt="" className="w-full h-full object-cover" /> : formData.name?.[0]?.toUpperCase()}
               </div>
               <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#3D2B1F] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg  hover:bg-[#E07A5F] transition-all">
                  <Camera size={16} />
               </button>
            </div>
            <div className="space-y-1">
               <p className="text-base font-black text-[#3D2B1F] tracking-tight truncate max-w-[200px]">{user.role === 'SUPPLIER' ? formData.shopName : formData.name}</p>
               <div className="flex items-center justify-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'SUPPLIER' ? 'bg-[#E07A5F]' : 'bg-leaf'}`} />
                 <span className="text-[10px] font-black text-[#3D2B1F]/40 uppercase tracking-widest">{user.role}</span>
               </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#3D2B1F] text-white shadow-xl' 
                    : 'text-[#3D2B1F]/40 hover:bg-[#FDFCFB] hover:text-[#3D2B1F]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-10 pt-6 border-t border-[#F0E6D2]/30">
             <button 
               onClick={logout}
               className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#E07A5F]/60 hover:bg-[#E07A5F]/5 transition-all"
             >
                <LogOut size={18} />
                Déconnexion
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 min-h-[600px]">
             <form onSubmit={handleSave} className="space-y-12">
               
               {activeTab === 'PROFILE' && (
                 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#3D2B1F] italic tracking-tight">Mon Identité</h2>
                        <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-[0.2em]">Gérez vos informations de contact</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Input 
                         label="Nom Complet"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                       <Input 
                         label="Téléphone"
                         value={formData.phoneNumber}
                         onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                       />
                    </div>
                    <Input 
                      label="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
               )}

               {activeTab === 'SECURITY' && (
                 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#3D2B1F] italic tracking-tight">Sécurité</h2>
                        <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-[0.2em]">Protégez vos données artisanales</p>
                    </div>
                    <div className="space-y-6">
                      <Input label="Mot de passe actuel" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                      <Input label="Nouveau mot de passe" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                      <Input label="Confirmer" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                    </div>
                 </div>
               )}

               {activeTab === 'SHOP' && user.role === 'SUPPLIER' && (
                 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#3D2B1F] italic tracking-tight">Ma Boutique Teranga</h2>
                        <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-[0.2em]">Gérez votre présence sur la marketplace</p>
                    </div>

                    <div className="space-y-8">
                      <Input 
                         label="Nom Commercial"
                         value={formData.shopName}
                         onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                         className="text-xl italic font-black"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <Input label="Localisation" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} icon={MapPin} />
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 px-2 block">Médias</label>
                            <div className="flex gap-4">
                               <div className="flex-1 p-6 bg-[#FDFCFB] border-2 border-dashed border-[#F0E6D2] rounded-3xl flex flex-col items-center gap-2 group cursor-pointer hover:border-[#E07A5F]/30">
                                  <ImageIcon size={20} className="text-[#3D2B1F]/20" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#3D2B1F]/30">Logo</span>
                               </div>
                               <div className="flex-1 p-6 bg-[#FDFCFB] border-2 border-dashed border-[#F0E6D2] rounded-3xl flex flex-col items-center gap-2 group cursor-pointer hover:border-[#E07A5F]/30">
                                  <ImageIcon size={20} className="text-[#3D2B1F]/20" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Bannière</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      <Input isTextArea rows={6} label="Histoire de la boutique" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                 </div>
               )}

               {activeTab === 'FAVORITES' && user.role === 'CLIENT' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#3D2B1F] italic tracking-tight">Mes Perles Favorites</h2>
                        <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-[0.2em]">Vos articles préférés en un coup d'œil</p>
                    </div>
                    
                    {favorites.length === 0 ? (
                      <div className="py-20 text-center space-y-6">
                        <Heart size={64} className="mx-auto text-[#3D2B1F]/10 mb-4" />
                        <p className="text-chocolate/40 font-bold">Votre collection est encore vide.</p>
                        <Button variant="primary" onClick={() => router.push('/public/catalog')}>Explorer le catalogue</Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {favorites.map((fav) => (
                           <Link key={fav.id} href={`/public/product/${fav.product.id}`} className="group bg-[#FDFCFB] rounded-3xl p-4 border border-[#F0E6D2]/30 hover:shadow-xl transition-all">
                              <div className="aspect-square relative rounded-2xl overflow-hidden mb-4">
                                 <Image src={fav.product.imageUrl || '/images/placeholder.png'} alt={fav.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                              </div>
                              <h4 className="font-black text-[#3D2B1F] text-sm tracking-tight truncate">{fav.product.name}</h4>
                              <p className="text-[10px] font-bold text-[#E07A5F] uppercase tracking-widest">{fav.product.supplier.shopName}</p>
                              <div className="mt-4 flex items-center justify-between">
                                 <span className="text-sm font-black text-[#3D2B1F]">{fav.product.price.toLocaleString()} CFA</span>
                                 <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors">
                                    <ExternalLink size={14} />
                                 </div>
                              </div>
                           </Link>
                         ))}
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'NOTIFICATIONS' && (
                  <div className="py-24 text-center space-y-6 animate-in zoom-in-95 duration-500">
                     <Bell size={64} className="mx-auto text-[#3D2B1F]/10" />
                     <h3 className="text-2xl font-black text-[#3D2B1F] italic">Alertes Teranga</h3>
                     <p className="text-[10px] font-bold text-[#3D2B1F]/30 uppercase tracking-[0.2em] max-w-sm mx-auto">Configurez vos préférences de réception dès que cette perle sera disponible.</p>
                  </div>
               )}

               {['PROFILE', 'SECURITY', 'SHOP'].includes(activeTab) && (
                 <div className="flex justify-end pt-8 border-t border-[#F0E6D2]/30">
                    <Button type="submit" loading={saving} size="lg" icon={CheckCircle2}>Enregistrer les modifications</Button>
                 </div>
               )}
             </form>
          </div>
        </main>
      </div>
    </div>
  );
};
