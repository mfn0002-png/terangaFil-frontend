import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isSpotlight: boolean;
  supplier: {
    id: number;
    shopName: string;
  };
}

export interface Supplier {
  id: number;
  shopName: string;
  description: string;
  status: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  deliveryTime?: string;
  rating?: string;
}

export interface ProductFilters {
  supplierId?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export const catalogService = {
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters.supplierId) params.append('supplierId', filters.supplierId.toString());
    if (filters.category && filters.category !== 'Toutes') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    
    // Note: 'featured' filtering is currently client-side or implicit by sorting on backend, 
    // but we can pass it if we add a dedicated endpoint flag later.
    
    const response = await api.get(`/catalog/products?${params.toString()}`);
    return response.data;
  },

  async getSuppliers(): Promise<Supplier[]> {
    const response = await api.get('/catalog/suppliers');
    return response.data;
  },

  async getSupplierById(id: number | string): Promise<Supplier> {
    const response = await api.get(`/catalog/suppliers/${id}`);
    return response.data;
  }
};
