import { create } from 'zustand'

const useCustomerStore = create((set) => ({
  customers: [],
  loading: false,
  
  setCustomers: (customers) => set({ customers }),
  
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, { ...customer, id: Date.now().toString() }]
  })),
  
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
  
  getCustomer: (id) => {
    const state = useCustomerStore.getState()
    return state.customers.find(c => c.id === id)
  }
}))

export default useCustomerStore
