import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        const newProduct = {
          id: generateId(),
          ...product,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        return newProduct;
      },
      
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      
      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },
      
      searchProducts: (query) => {
        if (!query) return get().products;
        const lowerQuery = query.toLowerCase();
        return get().products.filter(
          (p) =>
            p.name?.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery) ||
            p.category?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'product-storage',
    }
  )
);

const generateId = () => Math.random().toString(36).substring(2, 9);
