import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number; // en CFA
  image: string;
  quantity: number;
  supplierId: number;
  supplierName: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: 'WAVE' | 'OM' | 'CARD' | null;
}

interface CartState {
  items: CartItem[];
  checkoutInfo: CheckoutInfo;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
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
      checkoutInfo: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: null,
      },

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),

      clearCart: () => set({ items: [] }),

      setCheckoutInfo: (info) => set((state) => ({
        checkoutInfo: { ...state.checkoutInfo, ...info }
      })),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () => get().items.reduce((sum, item) => {
        const priceNum = parseInt(item.price.toString().replace(/[^0-9]/g, ''));
        return sum + (priceNum * item.quantity);
      }, 0),

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
      name: 'teranga-cart-v2',
    }
  )
);
