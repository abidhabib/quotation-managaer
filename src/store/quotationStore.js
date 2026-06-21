import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuotationStore = create(
  persist(
    (set, get) => ({
      quotations: [],

      addQuotation: (quotation) => {
        const newQuotation = {
          id: Date.now().toString(),
          quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [{
            status: 'draft',
            timestamp: new Date().toISOString(),
            note: 'Quotation created'
          }],
          ...quotation,
        };
        set((state) => ({
          quotations: [newQuotation, ...state.quotations],
        }));
        return newQuotation;
      },

      updateQuotation: (id, updates) => {
        set((state) => ({
          quotations: state.quotations.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      updateStatus: (id, newStatus, note = '') => {
        set((state) => ({
          quotations: state.quotations.map((q) => {
            if (q.id !== id) return q;
            
            const historyEntry = {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || `Status changed to ${newStatus}`
            };
            
            return {
              ...q,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              history: [...q.history, historyEntry]
            };
          }),
        }));
      },

      deleteQuotation: (id) => {
        set((state) => ({
          quotations: state.quotations.filter((q) => q.id !== id),
        }));
      },

      getQuotation: (id) => {
        return get().quotations.find((q) => q.id === id);
      },

      searchQuotations: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().quotations.filter(
          (q) =>
            q.quotationNumber?.toLowerCase().includes(lowerQuery) ||
            q.customerName?.toLowerCase().includes(lowerQuery) ||
            q.status?.toLowerCase().includes(lowerQuery)
        );
      },

      getQuotationsByStatus: (status) => {
        return get().quotations.filter((q) => q.status === status);
      },
    }),
    {
      name: 'quotation-storage',
    }
  )
);
