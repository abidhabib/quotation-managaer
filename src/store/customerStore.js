import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: [],
      
      addCustomer: (customer) => {
        const newCustomer = {
          id: generateId(),
          ...customer,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
        return newCustomer;
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },
      
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },
      
      getCustomer: (id) => {
        return get().customers.find((c) => c.id === id);
      },
      
      searchCustomers: (query) => {
        if (!query) return get().customers;
        const lowerQuery = query.toLowerCase();
        return get().customers.filter(
          (c) =>
            c.name?.toLowerCase().includes(lowerQuery) ||
            c.company?.toLowerCase().includes(lowerQuery) ||
            c.email?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'customer-storage',
    }
  )
);

const generateId = () => Math.random().toString(36).substring(2, 9);
