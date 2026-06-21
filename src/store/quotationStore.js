import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuotationStore = create(
  persist(
    (set, get) => ({
      quotations: [],
      
      addQuotation: (quotation) => {
        const newQuotation = {
          id: generateId(),
          quoteNumber: generateQuoteNumber(),
          status: 'draft',
          ...quotation,
          createdAt: new Date().toISOString(),
          history: [{
            action: 'created',
            status: 'draft',
            timestamp: new Date().toISOString(),
          }],
        };
        set((state) => ({
          quotations: [...state.quotations, newQuotation],
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
      
      updateStatus: (id, newStatus) => {
        set((state) => ({
          quotations: state.quotations.map((q) => {
            if (q.id !== id) return q;
            const historyEntry = {
              action: 'status_changed',
              fromStatus: q.status,
              toStatus: newStatus,
              timestamp: new Date().toISOString(),
            };
            return {
              ...q,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              history: [...q.history, historyEntry],
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
        if (!query) return get().quotations;
        const lowerQuery = query.toLowerCase();
        return get().quotations.filter(
          (q) =>
            q.quoteNumber?.toLowerCase().includes(lowerQuery) ||
            q.customerName?.toLowerCase().includes(lowerQuery) ||
            q.customerCompany?.toLowerCase().includes(lowerQuery)
        );
      },
      
      filterByStatus: (status) => {
        if (!status) return get().quotations;
        return get().quotations.filter((q) => q.status === status);
      },
    }),
    {
      name: 'quotation-storage',
    }
  )
);

const generateId = () => Math.random().toString(36).substring(2, 9);

const generateQuoteNumber = () => {
  const prefix = 'QT';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${random}`;
};
