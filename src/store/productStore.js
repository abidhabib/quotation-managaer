import { create } from 'zustand';
import { STORAGE_KEYS, storage, generateId } from '../utils/helpers';

const getUserId = () => {
  const user = storage.get(STORAGE_KEYS.CURRENT_USER);
  return user?.id;
};

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  // Initialize data
  initialize: () => {
    const userId = getUserId();
    if (!userId) return;
    
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    const userProducts = allProducts.filter(p => p.userId === userId);
    set({ products: userProducts });
  },

  // Get all products
  getProducts: () => {
    const userId = getUserId();
    if (!userId) return [];
    
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    return allProducts.filter(p => p.userId === userId);
  },

  // Create product
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      if (!productData.name) {
        throw new Error('Product name is required');
      }
      
      const newProduct = {
        id: generateId(),
        userId,
        name: productData.name,
        description: productData.description || '',
        category: productData.category || '',
        price: parseFloat(productData.price) || 0,
        tax: parseFloat(productData.tax) || 0,
        unit: productData.unit || 'piece',
        sku: productData.sku || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
      allProducts.push(newProduct);
      storage.set(STORAGE_KEYS.PRODUCTS, allProducts);
      
      set({ 
        products: [...get().products, newProduct],
        isLoading: false 
      });
      
      return { success: true, product: newProduct };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update product
  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
      const index = allProducts.findIndex(p => p.id === id && p.userId === userId);
      
      if (index === -1) throw new Error('Product not found');
      
      const updatedProduct = {
        ...allProducts[index],
        ...updates,
        price: updates.price !== undefined ? parseFloat(updates.price) : allProducts[index].price,
        tax: updates.tax !== undefined ? parseFloat(updates.tax) : allProducts[index].tax,
        updatedAt: new Date().toISOString(),
      };
      
      allProducts[index] = updatedProduct;
      storage.set(STORAGE_KEYS.PRODUCTS, allProducts);
      
      set({
        products: get().products.map(p => p.id === id ? updatedProduct : p),
        isLoading: false
      });
      
      return { success: true, product: updatedProduct };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
      const filteredProducts = allProducts.filter(p => !(p.id === id && p.userId === userId));
      
      if (filteredProducts.length === allProducts.length) {
        throw new Error('Product not found');
      }
      
      storage.set(STORAGE_KEYS.PRODUCTS, filteredProducts);
      
      set({
        products: get().products.filter(p => p.id !== id),
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search products
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Get filtered products
  getFilteredProducts: () => {
    const { products, searchQuery } = get();
    
    if (!searchQuery) return products;
    
    const queryLower = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.description?.toLowerCase().includes(queryLower) ||
      p.category?.toLowerCase().includes(queryLower) ||
      p.sku?.toLowerCase().includes(queryLower)
    );
  },

  // Get product by ID
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },
}));
