'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2,
  Loader2,
  ChevronDown,
  Filter
} from 'lucide-react';
import { catalogService, Product } from '@/services/catalogService';
import { usePagination } from '@/hooks/usePagination';
import { ProductCard } from '@/components/shared/ProductCard';
import { Pagination } from '@/components/shared/Pagination';

interface ProductDiscoveryProps {
  supplierId?: number;
  showSupplierOnCard?: boolean;
  sectionTitle?: string;
  initialCategory?: string;
  itemsPerPage?: number;
  showSearchInSidebar?: boolean;
  searchPlaceholder?: string;
}

export function ProductDiscovery({ 
  supplierId, 
  showSupplierOnCard = true,
  sectionTitle,
  initialCategory = '',
  itemsPerPage = 9,
  showSearchInSidebar = true,
  searchPlaceholder = "Rechercher..."
}: ProductDiscoveryProps) {
  const { page, onPageChange, handleResponse, meta } = usePagination(itemsPerPage);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: initialCategory,
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filtersObj: any = {
          page,
          limit: itemsPerPage
        };
        if (supplierId) filtersObj.supplierId = supplierId;
        if (filters.category && filters.category !== 'Toutes' && filters.category !== 'Tous les produits') {
          filtersObj.category = filters.category;
        }
        if (filters.minPrice) filtersObj.minPrice = Number(filters.minPrice);
        if (filters.maxPrice) filtersObj.maxPrice = Number(filters.maxPrice);
        
        const response = await catalogService.getProducts(filtersObj);
        setProducts(response.data);
        handleResponse(response.meta);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId, filters.category, filters.minPrice, filters.maxPrice, page, itemsPerPage]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const categories = ["Toutes", "Fils", "Crochets", "Accessoires", "Kits"];

  return (
    <div className="flex flex-col lg:flex-row gap-10 md:gap-16">
      
      {/* Sidebar FILTERS */}
      <aside className="lg:w-1/4 space-y-8 md:space-y-12">
        {showSearchInSidebar && (
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full bg-white border-2 border-sand/50 rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-terracotta/20 transition-all shadow-sm"
            />
          </div>
        )}

        <div>
          <h3 className="text-[11px] font-black text-chocolate/30 uppercase tracking-[0.2em] mb-6 md:mb-8 border-b border-sand pb-4 italic">Catégories</h3>
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <label key={i} className="flex items-center gap-4 group cursor-pointer">
                <input 
                  type="radio" 
                  name="category" 
                  className="hidden"
                  checked={filters.category === (cat === "Toutes" ? "" : cat)}
                  onChange={() => {
                    setFilters({...filters, category: cat === "Toutes" ? "" : cat});
                    onPageChange(1);
                  }} 
                />
                <div className={`w-5 h-5 rounded-md border-2 border-sand flex items-center justify-center transition-all ${
                  (filters.category === "" && cat === "Toutes") || filters.category === cat 
                    ? 'bg-terracotta border-terracotta shadow-lg shadow-terracotta/20' : 'group-hover:border-terracotta/50'
                }`}>
                  {((filters.category === "" && cat === "Toutes") || filters.category === cat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                  (filters.category === "" && cat === "Toutes") || filters.category === cat 
                    ? 'text-chocolate' : 'text-chocolate/30 group-hover:text-terracotta'
                }`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black text-chocolate/30 uppercase tracking-[0.2em] mb-6 md:mb-8 border-b border-sand pb-4 italic">Tranche de prix</h3>
          <div className="space-y-6 px-1">
            <input 
              type="range" 
              min="0"
              max="100000"
              step="1000"
              value={filters.maxPrice || 100000}
              onChange={(e) => {
                setFilters({...filters, maxPrice: e.target.value === '100000' ? '' : e.target.value });
                onPageChange(1);
              }}
              className="w-full accent-terracotta cursor-pointer h-1.5 bg-primary rounded-lg appearance-none" 
            />
            <div className="flex justify-between items-center bg-sand/30 p-4 rounded-2xl border border-sand">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-chocolate/30 uppercase tracking-widest mb-1">Min</span>
                <span className="text-[11px] font-black text-chocolate tracking-tighter">0 CFA</span>
              </div>
              <div className="w-px h-8 bg-chocolate/10" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-black text-chocolate/30 uppercase tracking-widest mb-1">Max</span>
                <span className="text-[11px] font-black text-chocolate tracking-tighter">
                  {filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : '100 000+'} CFA
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => { setFilters({ category: '', minPrice: '', maxPrice: '', search: '' }); onPageChange(1); }}
          className="w-full py-5 bg-white border-2 border-sand rounded-2xl text-[10px] font-black uppercase tracking-widest text-chocolate/40 hover:border-chocolate hover:text-chocolate hover:shadow-xl transition-all active:scale-95"
        >
          Effacer les filtres
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {sectionTitle && (
            <h2 className="text-xl md:text-3xl font-black text-chocolate italic uppercase tracking-tighter">
              {sectionTitle} <span className="text-terracotta/40 ml-2 font-normal">({meta.total} articles)</span>
            </h2>
          )}
          
          <div className="flex flex-col md:flex-row items-center gap-4 ml-auto">
            {!showSearchInSidebar && (
              <div className="relative group w-full md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/20 group-focus-within:text-terracotta transition-colors" size={16} />
                <input 
                  placeholder={searchPlaceholder} 
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-white border-2 border-sand/50 rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-terracotta/20 transition-all"
                />
              </div>
            )}
            <button className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-sand/50 rounded-xl text-[11px] font-black uppercase tracking-widest text-chocolate/60 w-full md:w-auto justify-between md:justify-start">
              Trier par <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square rounded-[40px] bg-sand/10 animate-pulse border border-sand/20" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[50px] border border-sand shadow-sm">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-sand/20 rounded-full text-chocolate/20">
              <Filter size={32} />
            </div>
            <p className="text-chocolate/60 font-bold text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-chocolate/30 text-sm max-w-xs mx-auto">Essayez de modifier vos filtres ou de réinitialiser la recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} showSupplier={showSupplierOnCard} />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <div className="mt-12">
          <Pagination 
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </main>
    </div>
  );
}
