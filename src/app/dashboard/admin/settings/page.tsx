'use client';

import { useState } from 'react';
import { 
  Settings, 
  Percent, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  History,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { toast } from '@/stores/useToastStore';

export default function AdminSettings() {
  const [commission, setCommission] = useState(15);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fils & Laines', count: 450, status: 'ACTIF', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Crochets & Aiguilles', count: 120, status: 'ACTIF', image: 'https://images.unsplash.com/photo-1610450849156-3c059f0f906e?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Kits & Patrons', count: 0, status: 'INACTIF', image: 'https://images.unsplash.com/photo-1598514983918-291fd18d699d?auto=format&fit=crop&q=80&w=400' },
  ]);

  const handleSaveAll = () => {
    toast.success('Tous les paramètres ont été enregistrés');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/10">
        <div>
          <h1 className="text-4xl font-black text-[#3D2B1F] tracking-tighter">Paramètres Plateforme</h1>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] italic mt-1">Gérez les règles globales, les catégories et les accès</p>
        </div>
        <button 
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-8 py-4 bg-[#E07A5F] text-white rounded-[20px] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          <Save size={18} />
          Enregistrer tout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Commission */}
        <div className="lg:col-span-12">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                 <Percent size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight">Commission Globale</h2>
           </div>

           <div className="bg-white rounded-[40px] border border-border/10 p-10 shadow-sm relative overflow-hidden group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
                 <div className="aspect-square bg-[#FDFCFB] rounded-3xl flex items-center justify-center border-2 border-border/5 group-hover:border-primary/20 transition-all">
                    <span className="text-8xl font-black text-primary/10">%</span>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-lg font-black text-[#3D2B1F]">Taux de Commission Marketplace</h3>
                       <p className="text-xs text-foreground/50 font-medium leading-relaxed mt-2">
                          Définit le pourcentage prélevé sur chaque transaction effectuée par les vendeurs sur la plateforme.
                       </p>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="relative w-32">
                          <input 
                            type="number" 
                            value={commission}
                            onChange={(e) => setCommission(Number(e.target.value))}
                            className="w-full bg-[#FDFCFB] border-2 border-border/10 rounded-2xl py-3 px-4 text-sm font-black text-[#3D2B1F] outline-none focus:border-primary transition-all pr-12"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 font-bold text-xs">%</span>
                       </div>
                       <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Taux actuel : <span className="text-primary">{commission}.0%</span></span>
                    </div>

                    <div className="flex gap-3 pt-4">
                       <Button className="px-10 rounded-2xl">Mettre à jour</Button>
                       <button className="px-6 py-3 bg-border/5 text-foreground/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border/10 transition-all flex items-center gap-2">
                         <History size={14} />
                         Historique
                       </button>
                    </div>
                 </div>
              </div>
              <TrendingUp className="absolute -right-10 -bottom-10 text-primary/5 group-hover:text-primary/10 transition-all" size={240} />
           </div>
        </div>

        {/* Categories Section */}
        <div className="lg:col-span-12 pt-6">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-leaf/10 rounded-xl text-leaf">
                    <Layers size={20} />
                 </div>
                 <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight">Gestion des Catégories</h2>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E07A5F] hover:gap-3 transition-all">
                 <Plus size={16} />
                 Ajouter une catégorie
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-[32px] border border-border/10 overflow-hidden group hover:shadow-2xl hover:shadow-chocolate/5 transition-all">
                   <div className="aspect-video w-full overflow-hidden relative">
                      <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={cat.name} />
                      <div className="absolute top-4 right-4">
                         <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.status === 'ACTIF' ? 'bg-leaf/90 text-white' : 'bg-foreground/20 text-white'}`}>
                            {cat.status}
                         </span>
                      </div>
                   </div>
                   <div className="p-6">
                      <h4 className="text-lg font-black text-[#3D2B1F] tracking-tight">{cat.name}</h4>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{cat.count} produits référencés</p>
                      
                      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/10">
                         <button className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-all flex items-center gap-1.5">
                            Modifier
                         </button>
                         <button className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all flex items-center gap-1.5">
                            Supprimer
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Access & Security */}
        <div className="lg:col-span-12 pt-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                 <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] tracking-tight">Accès & Sécurité Équipe</h2>
           </div>

           <div className="bg-white rounded-[40px] border border-border/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 group">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:rotate-12 transition-transform">
                    <Edit3 size={32} />
                 </div>
                 <div>
                    <h4 className="font-black text-[#3D2B1F]">Gérer les administrateurs</h4>
                    <p className="text-xs text-foreground/40 font-medium">Configurez qui peut accéder à ce dashboard et avec quels droits.</p>
                 </div>
              </div>
              <ChevronRight className="text-foreground/10 group-hover:translate-x-2 transition-transform" />
           </div>
        </div>

      </div>
    </div>
  );
}
