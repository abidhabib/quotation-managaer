import { create } from 'zustand'

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now().toString() }]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  
  getProduct: (id) => {
    const state = useProductStore.getState()
    return state.products.find(p => p.id === id)
  }
}))

export default useProductStore
