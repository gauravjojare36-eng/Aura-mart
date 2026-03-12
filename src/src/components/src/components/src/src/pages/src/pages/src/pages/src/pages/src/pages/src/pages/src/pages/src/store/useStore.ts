import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
}

interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    ),
  })),
  clearCart: () => set({ cart: [] }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
