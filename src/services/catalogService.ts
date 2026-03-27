import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  category: string;
  description: string;
  material?: string;
  weight?: string;
  length?: string;
  usage?: string;
  colors: { name: string; hex: string }[];
  sizes?: string[]; // Tailles disponibles (ex: ["S", "M", "L", "XL"] ou ["10m", "20m"])
  isSpotlight: boolean;
  supplier: {
    id: number;
    shopName: string;
    shipping?: ShippingRate[];
  };
}

export interface ShippingRate {
  id: number;
  zone: string;
  price: number;
  delay: string;
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
  shipping?: ShippingRate[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  supplierId?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { name: string; avatarUrl?: string };
}

export interface ReviewStats {
  total: number;
  average: number;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export const catalogService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters.supplierId) params.append('supplierId', filters.supplierId.toString());
    if (filters.category && filters.category !== 'Toutes') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/catalog/products?${params.toString()}`);
    return response.data;
  },

  async getSuppliers(page?: number, limit?: number): Promise<PaginatedResponse<Supplier>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/catalog/suppliers?${params.toString()}`);
    return response.data;
  },

  async getSupplierById(id: number | string): Promise<Supplier> {
    const response = await api.get(`/catalog/suppliers/${id}`);
    return response.data;
  },

  async getProductById(id: number | string): Promise<Product> {
    const response = await api.get(`/catalog/products/${id}`);
    return response.data;
  },

  async getProductReviews(productId: number | string): Promise<ProductReviewsResponse> {
    const response = await api.get(`/catalog/products/${productId}/reviews`);
    return response.data;
  },

  async submitReview(data: { productId: number; rating: number; comment?: string }): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data;
  },
};

