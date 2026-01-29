import api from '@/lib/api';

export interface SupplierStats {
  overview: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    lowStockItems: number;
  };
  bestSellers: any[];
  hasAdvancedStats: boolean;
}

export const supplierService = {
  getStats: async () => {
    const res = await api.get<SupplierStats>('/premium/stats');
    return res.data;
  },

  getProducts: async () => {
    const res = await api.get('/supplier/products');
    return res.data;
  },

  getProduct: async (id: number) => {
    const res = await api.get(`/supplier/products/${id}`);
    return res.data;
  },

  updateProduct: async (id: number, data: any) => {
    const res = await api.put(`/supplier/products/${id}`, data);
    return res.data;
  },

  createProduct: async (data: any) => {
    const res = await api.post('/supplier/products', data);
    return res.data;
  },

  updateProductStock: async (id: number, stock: number) => {
    const res = await api.patch(`/supplier/products/${id}/stock`, { stock });
    return res.data;
  },

  toggleProductActive: async (id: number, isActive: boolean) => {
    const res = await api.patch(`/supplier/products/${id}/active`, { isActive });
    return res.data;
  },

  deleteProduct: async (id: number) => {
    const res = await api.delete(`/supplier/products/${id}`);
    return res.data;
  },

  getOrders: async () => {
    const res = await api.get('/supplier/orders');
    return res.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const res = await api.patch(`/supplier/orders/${id}/status`, { status });
    return res.data;
  },

  getShippingRates: async () => {
    const res = await api.get('/supplier/shipping');
    return res.data;
  },

  saveShippingRate: async (data: any) => {
    if (data.id) {
      const res = await api.put(`/supplier/shipping/${data.id}`, data);
      return res.data;
    } else {
      const res = await api.post('/supplier/shipping', data);
      return res.data;
    }
  },

  deleteShippingRate: async (id: number) => {
    const res = await api.delete(`/supplier/shipping/${id}`);
    return res.data;
  },

  getPaymentSettings: async () => {
    const res = await api.get('/supplier/settings/payment');
    return res.data;
  },

  updatePaymentSettings: async (data: { method: string, phoneNumber: string }) => {
    const res = await api.patch('/supplier/settings/payment', data);
    return res.data;
  },
  
  updateBranding: async (data: any) => {
    const res = await api.patch('/supplier/branding', data);
    return res.data;
  }
};
