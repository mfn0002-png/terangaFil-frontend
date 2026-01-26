import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number; // en CFA
  image: string;
  imageUrl?: string; // Optional alias for compatibility
  quantity: number;
  supplierId: number;
  supplierName: string;
  selectedColor?: string; // Couleur sélectionnée par l'utilisateur
  selectedSize?: string; // Taille sélectionnée par l'utilisateur (ex: "M", "L", "10m")
  shippingZone?: string; // Zone de livraison choisie pour ce produit
  shippingPrice?: number; // Prix de livraison pour cette zone
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: 'WAVE' | 'OM' | 'CARD' | null;
}

const initialCheckoutInfo: CheckoutInfo = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  paymentMethod: null,
};

interface CartState {
  items: CartItem[];
  checkoutInfo: CheckoutInfo;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, color?: string, size?: string, zone?: string) => void;
  updateQuantity: (productId: number, quantity: number, color?: string, size?: string, zone?: string) => void;
  clearCart: () => void;
  setCheckoutInfo: (info: Partial<CheckoutInfo>) => void;
  
  // Helpers
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsBySupplier: () => Record<string, CartItem[]>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutInfo: initialCheckoutInfo,

      addItem: (item) => set((state) => {
        const normalizedItem = {
          ...item,
          id: Number(item.id),
          supplierId: Number(item.supplierId),
        };

        const existingItemIndex = state.items.findIndex((i) => 
          i.id === normalizedItem.id && 
          i.selectedColor === normalizedItem.selectedColor && 
          i.selectedSize === normalizedItem.selectedSize &&
          i.shippingZone === normalizedItem.shippingZone
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += normalizedItem.quantity;
          return { items: newItems };
        }

        return { items: [...state.items, normalizedItem] };
      }),

      removeItem: (productId, color, size, zone) => set((state) => ({
        items: state.items.filter((i) => 
          !(i.id === productId && i.selectedColor === color && i.selectedSize === size && i.shippingZone === zone)
        ),
      })),

      updateQuantity: (productId, quantity, color, size, zone) => set((state) => ({
        items: state.items.map((i) => 
          (i.id === productId && i.selectedColor === color && i.selectedSize === size && i.shippingZone === zone)
            ? { ...i, quantity: Math.max(1, quantity) } 
            : i
        ),
      })),

      clearCart: () => set({ items: [], checkoutInfo: initialCheckoutInfo }),

      setCheckoutInfo: (info) => set((state) => ({
        checkoutInfo: { ...state.checkoutInfo, ...info }
      })),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () => {
        const { items, getItemsBySupplier } = get();
        
        // Sous-total articles
        const subtotal = items.reduce((sum, item) => {
          const priceNum = parseInt(item.price.toString().replace(/[^0-9]/g, ''));
          return sum + (priceNum * item.quantity);
        }, 0);

        // Frais de port : par boutique par zone unique
        const grouped = getItemsBySupplier();
        let totalShipping = 0;

        Object.values(grouped).forEach(supplierItems => {
          const uniqueZones = new Set();
          supplierItems.forEach(item => {
            if (item.shippingZone) {
              uniqueZones.add(`${item.shippingZone}_${item.shippingPrice}`);
            }
          });
          
          uniqueZones.forEach(zoneKey => {
            const [_, price] = (zoneKey as string).split('_');
            totalShipping += Number(price || 0);
          });
        });

        return subtotal + totalShipping;
      },

      getItemsBySupplier: () => {
        const grouped: Record<string, CartItem[]> = {};
        get().items.forEach((item) => {
          if (!grouped[item.supplierId]) {
            grouped[item.supplierId] = [];
          }
          grouped[item.supplierId].push(item);
        });
        return grouped;
      },
    }),
    {
      name: 'teranga-cart-v3',
    }
  )
);
