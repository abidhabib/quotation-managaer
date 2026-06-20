import { create } from 'zustand';
import { STORAGE_KEYS, storage, generateId } from '../utils/helpers';

const getUserId = () => {
  const user = storage.get(STORAGE_KEYS.CURRENT_USER);
  return user?.id;
};

export const useCustomerStore = create((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  // Initialize data
  initialize: () => {
    const userId = getUserId();
    if (!userId) return;
    
    const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
    const userCustomers = allCustomers.filter(c => c.userId === userId);
    set({ customers: userCustomers });
  },

  // Get all customers
  getCustomers: () => {
    const userId = getUserId();
    if (!userId) return [];
    
    const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
    return allCustomers.filter(c => c.userId === userId);
  },

  // Create customer
  createCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      if (!customerData.name) {
        throw new Error('Customer name is required');
      }
      
      const newCustomer = {
        id: generateId(),
        userId,
        name: customerData.name,
        company: customerData.company || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        notes: customerData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalQuotations: 0,
        totalValue: 0,
      };
      
      const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
      allCustomers.push(newCustomer);
      storage.set(STORAGE_KEYS.CUSTOMERS, allCustomers);
      
      set({ 
        customers: [...get().customers, newCustomer],
        isLoading: false 
      });
      
      return { success: true, customer: newCustomer };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update customer
  updateCustomer: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
      const index = allCustomers.findIndex(c => c.id === id && c.userId === userId);
      
      if (index === -1) throw new Error('Customer not found');
      
      const updatedCustomer = {
        ...allCustomers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      allCustomers[index] = updatedCustomer;
      storage.set(STORAGE_KEYS.CUSTOMERS, allCustomers);
      
      set({
        customers: get().customers.map(c => c.id === id ? updatedCustomer : c),
        isLoading: false
      });
      
      return { success: true, customer: updatedCustomer };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
      const filteredCustomers = allCustomers.filter(c => !(c.id === id && c.userId === userId));
      
      if (filteredCustomers.length === allCustomers.length) {
        throw new Error('Customer not found');
      }
      
      storage.set(STORAGE_KEYS.CUSTOMERS, filteredCustomers);
      
      set({
        customers: get().customers.filter(c => c.id !== id),
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Search customers
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Get filtered customers
  getFilteredCustomers: () => {
    const { customers, searchQuery } = get();
    
    if (!searchQuery) return customers;
    
    const queryLower = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(queryLower) ||
      c.company?.toLowerCase().includes(queryLower) ||
      c.email?.toLowerCase().includes(queryLower) ||
      c.phone?.includes(queryLower)
    );
  },

  // Get customer by ID
  getCustomerById: (id) => {
    return get().customers.find(c => c.id === id);
  },

  // Update customer statistics
  updateCustomerStats: (customerId, quotationTotal) => {
    const allCustomers = storage.get(STORAGE_KEYS.CUSTOMERS) || [];
    const index = allCustomers.findIndex(c => c.id === customerId);
    
    if (index !== -1) {
      allCustomers[index].totalQuotations = (allCustomers[index].totalQuotations || 0) + 1;
      allCustomers[index].totalValue = (allCustomers[index].totalValue || 0) + quotationTotal;
      storage.set(STORAGE_KEYS.CUSTOMERS, allCustomers);
    }
  },
}));
