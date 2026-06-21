import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: [],

      addCustomer: (customer) => {
        const newCustomer = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...customer,
        };
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
        return newCustomer;
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
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
