import { create } from 'zustand';
import { favoriteService, Favorite } from '@/services/favoriteService';
import { toast } from '@/stores/useToastStore';

interface FavoriteState {
  favorites: Favorite[];
  favoriteIds: Set<number>;
  togglingIds: Set<number>;
  loading: boolean;
  initialized: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  togglingIds: new Set(),
  loading: false,
  initialized: false,

  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const data = await favoriteService.getFavorites();
      set({ 
        favorites: data, 
        favoriteIds: new Set(data.map(f => f.product.id)),
        initialized: true 
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // If unauthorized, just clear (likely not logged in)
      set({ favorites: [], favoriteIds: new Set(), initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (productId: number) => {
    // Prevent multiple clicks for the same product
    if (get().togglingIds.has(productId)) return;

    set((state) => {
      const newToggling = new Set(state.togglingIds);
      newToggling.add(productId);
      return { togglingIds: newToggling };
    });

    try {
      const result = await favoriteService.toggle(productId);
      const isFav = result.isFavorite;
      
      set((state) => {
        const newIds = new Set(state.favoriteIds);
        if (isFav) {
          newIds.add(productId);
        } else {
          newIds.delete(productId);
        }
        return { favoriteIds: newIds };
      });

      if (isFav) {
        toast.success('Ajouté aux favoris');
      } else {
        toast.success('Retiré des favoris');
      }
      
      // Refresh full list in background
      const data = await favoriteService.getFavorites();
      set({ favorites: data, favoriteIds: new Set(data.map(f => f.product.id)) });
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Connectez-vous pour ajouter des favoris');
      } else {
        toast.error('Une erreur est survenue');
      }
    } finally {
      set((state) => {
        const newToggling = new Set(state.togglingIds);
        newToggling.delete(productId);
        return { togglingIds: newToggling };
      });
    }
  },

  isFavorite: (productId: number) => {
    return get().favoriteIds.has(productId);
  },

  clearFavorites: () => {
    set({ favorites: [], favoriteIds: new Set(), togglingIds: new Set(), initialized: false });
  }
}));
