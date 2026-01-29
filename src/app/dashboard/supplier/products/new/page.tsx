'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Save, 
  Send,
  HelpCircle,
  Info,
  Package,
  ArrowLeft,
  Loader2,
  Plus,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supplierService } from '@/services/supplierService';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { toast } from '@/stores/useToastStore';

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const isEdit = !!id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fils',
    description: '',
    material: '',
    weight: '',
    length: '',
    usage: '',
    hookSize: '',
    price: 0,
    stock: 0,
    colors: [] as string[],
    sizes: [] as string[],
    imageUrl: '',
    images: [] as string[],
  });

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const product = await supplierService.getProduct(id!);
          setFormData({
            name: product.name,
            category: product.category,
            description: product.description || '',
            material: product.material || '',
            weight: product.weight || '',
            length: product.length || '',
            usage: product.usage || '',
            hookSize: product.hookSize || '',
            price: product.price,
            stock: product.stock,
            colors: product.colors || [],
            sizes: product.sizes || [],
            imageUrl: product.imageUrl || '',
            images: product.images || [],
          });
          const allImages = [];
          if (product.imageUrl) allImages.push(product.imageUrl);
          if (product.images) allImages.push(...product.images);
          setPreviews(allImages);
        } catch (error) {
          console.error("Erreur chargement produit:", error);
          toast.error("Erreur lors de la récupération du produit.");
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setPreviews(prev => [...prev, base64]);
          setFormData(prev => {
            if (!prev.imageUrl) {
               return { ...prev, imageUrl: base64 };
            } else {
               return { ...prev, images: [...prev.images, base64] };
            }
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removePreview = (index: number) => {
    const removedSrc = previews[index];
    setPreviews(prev => prev.filter((_, i) => i !== index));
    
    setFormData(prev => {
       if (prev.imageUrl === removedSrc) {
          const nextMain = prev.images[0] || '';
          const nextGallery = prev.images.slice(1);
          return { ...prev, imageUrl: nextMain, images: nextGallery };
       } else {
          return { ...prev, images: prev.images.filter(img => img !== removedSrc) };
       }
    });
  };

  const addTag = (type: 'colors' | 'sizes', value: string) => {
    if (!value) return;
    if (formData[type].includes(value)) return;
    setFormData({ ...formData, [type]: [...formData[type], value] });
    if (type === 'colors') setNewColor('');
    else setNewSize('');
  };

  const removeTag = (type: 'colors' | 'sizes', value: string) => {
    setFormData({ ...formData, [type]: formData[type].filter(v => v !== value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await supplierService.updateProduct(id!, formData);
        toast.success('Produit mis à jour avec succès !');
      } else {
        await supplierService.createProduct(formData);
        toast.success('Produit créé avec succès !');
      }
      router.push('/dashboard/supplier/products');
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#E07A5F]" size={40} />
        <p className="text-[#3D2B1F]/40 font-black text-[10px] uppercase tracking-widest">Récupération des données...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      
      <PageHeader 
        title={isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
        subtitle={isEdit ? `#${id} - Mettez à jour vos informations` : 'Mettez en valeur vos créations artisanales'}
        backHref="/dashboard/supplier/products"
      />

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Section 1: Gallery */}
        <section className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E07A5F]/10 rounded-xl flex items-center justify-center text-[#E07A5F]">
                 <Package size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">1. Galerie Photos</h2>
           </div>

           <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple
              className="hidden" 
              accept="image/*"
           />

           {previews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-[40px] overflow-hidden border-4 border-[#F0E6D2] group">
                    <Image src={src} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button" 
                         onClick={() => removePreview(i)}
                         className="p-4 bg-red-500 text-white rounded-3xl shadow-xl hover:scale-110 transition-transform"
                       >
                         <X size={20} />
                       </button>
                    </div>
                    {i === 0 && (
                       <span className="absolute top-4 left-4 px-3 py-1 bg-[#3D2B1F] text-white text-[8px] font-black uppercase tracking-widest rounded-full">Principale</span>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={triggerUpload}
                  className="aspect-square rounded-[40px] border-4 border-dashed border-[#F0E6D2] flex flex-col items-center justify-center text-[#3D2B1F]/20 hover:border-[#E07A5F]/30 hover:text-[#E07A5F] transition-all group"
                >
                   <div className="w-16 h-16 bg-[#F0E6D2]/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest mt-4">Ajouter</span>
                </button>
              </div>
           ) : (
             <div 
              onClick={triggerUpload}
              className="border-4 border-dashed border-[#F0E6D2]/30 rounded-[40px] p-20 flex flex-col items-center gap-8 group hover:border-[#E07A5F]/30 transition-all cursor-pointer"
             >
                <div className="w-20 h-20 bg-[#F0E6D2]/20 rounded-[30px] flex items-center justify-center text-[#E07A5F] group-hover:scale-110 transition-transform">
                   <Upload size={32} />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-lg font-black text-[#3D2B1F]">Cliquez pour ajouter des photos</p>
                   <p className="text-xs font-bold text-[#3D2B1F]/30 uppercase tracking-widest leading-relaxed">Plusieurs fichiers autorisés</p>
                </div>
             </div>
           )}
        </section>

        {/* Section 2: General Info */}
        <section className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E07A5F]/10 rounded-xl flex items-center justify-center text-[#E07A5F]">
                 <Info size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">2. Informations Générales</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input 
                label="Nom du produit"
                required
                placeholder="Ex: Fil de coton bio - Bleu Indigo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 px-2">Catégorie</label>
                 <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-[#E07A5F]/30 transition-all appearance-none"
                 >
                    <option>Fils</option>
                    <option>Crochets</option>
                    <option>Tissus</option>
                    <option>Accessoires</option>
                 </select>
              </div>
           </div>

           <Input 
             label="Description"
             isTextArea
             rows={5}
             placeholder="Décrivez les spécificités de votre produit..."
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           />
        </section>

        {/* Section 3: Technical Specs */}
        <section className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E07A5F]/10 rounded-xl flex items-center justify-center text-[#E07A5F]">
                 <HelpCircle size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">3. Caractéristiques Techniques</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Input 
                label="Taille de crochet (mm)"
                placeholder="Ex: 3.5 - 4.0"
                value={formData.hookSize}
                onChange={(e) => setFormData({...formData, hookSize: e.target.value})}
              />
              <Input 
                label="Poids / Métrage"
                placeholder="Ex: 100g / 250m"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
              <Input 
                label="Composition"
                placeholder="Ex: 100% Coton"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 px-2">Couleurs disponibles</label>
                 <div className="flex flex-wrap gap-3">
                    {formData.colors.map(color => (
                       <Badge key={color} variant="secondary" className="pl-4 pr-2 py-2">
                          {color}
                          <button type="button" onClick={() => removeTag('colors', color)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                             <X size={12} />
                          </button>
                       </Badge>
                    ))}
                    <div className="relative group">
                       <input 
                          type="text" 
                          placeholder="Ajouter une couleur..."
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('colors', newColor))}
                          className="bg-[#F0E6D2]/20 border-2 border-dashed border-[#F0E6D2]/60 rounded-full py-2 px-6 text-[10px] font-bold outline-none focus:border-[#E07A5F] w-48"
                       />
                       <button type="button" onClick={() => addTag('colors', newColor)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40 hover:text-[#E07A5F]">
                          <Plus size={14} />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 px-2">Tailles disponibles</label>
                 <div className="flex flex-wrap gap-3">
                    {formData.sizes.map(size => (
                       <Badge key={size} variant="primary" className="pl-4 pr-2 py-2">
                          {size}
                          <button type="button" onClick={() => removeTag('sizes', size)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                             <X size={12} />
                          </button>
                       </Badge>
                    ))}
                    <div className="relative group">
                       <input 
                          type="text" 
                          placeholder="Ex: Mètre, S, 6 yards..."
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('sizes', newSize))}
                          className="bg-[#F0E6D2]/20 border-2 border-dashed border-[#F0E6D2]/60 rounded-full py-2 px-6 text-[10px] font-bold outline-none focus:border-[#E07A5F] w-48"
                       />
                       <button type="button" onClick={() => addTag('sizes', newSize)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D2B1F]/40 hover:text-[#E07A5F]">
                          <Plus size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 4: Pricing & Stock */}
        <section className="bg-white rounded-[50px] p-12 shadow-2xl shadow-[#3D2B1F]/5 border border-[#F0E6D2]/30 space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E07A5F]/10 rounded-xl flex items-center justify-center text-[#E07A5F]">
                 <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-black text-[#3D2B1F] uppercase tracking-widest">4. Tarification et Stock</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#3D2B1F]/40 px-2">Prix de vente (FCFA)</label>
                 <div className="relative">
                    <input 
                        type="number" 
                        min={0}
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-[#FDFCFB] border-2 border-[#F0E6D2]/30 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:border-[#E07A5F]/30 transition-all pr-16"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#3D2B1F]/20">FCFA</span>
                 </div>
              </div>
              <Input 
                label="Quantité en stock"
                type="number"
                min={0}
                required
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
           </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-10">
           <Link href="/dashboard/supplier/products" className="px-12 py-5 bg-white border-2 border-[#3D2B1F]/10 text-[#3D2B1F] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#FDFCFB] transition-all text-center">
              Annuler
           </Link>
           <Button 
              type="submit" 
              loading={loading}
              variant={isEdit ? 'primary' : 'secondary'}
              size="xl"
              icon={isEdit ? Save : Send}
           >
              {isEdit ? 'Enregistrer les modifications' : 'Publier le produit'}
           </Button>
        </div>

      </form>
    </div>
  );
}
