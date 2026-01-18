import api from '@/lib/api';

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    supplier: {
      shopName: string;
    };
  };
}

export const favoriteService = {
  async toggle(productId: number): Promise<{ isFavorite: boolean }> {
    const response = await api.post('/favorites/toggle', { productId });
    return response.data;
  },

  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get('/favorites');
    return response.data;
  }
};
