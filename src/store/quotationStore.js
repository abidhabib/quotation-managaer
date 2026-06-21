import { create } from 'zustand'

const useQuotationStore = create((set) => ({
  quotations: [],
  loading: false,
  
  setQuotations: (quotations) => set({ quotations }),
  
  addQuotation: (quotation) => set((state) => ({
    quotations: [...state.quotations, { 
      ...quotation, 
      id: Date.now().toString(),
      quotationNumber: `QT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }]
  })),
  
  updateQuotation: (id, updates) => set((state) => ({
    quotations: state.quotations.map(q => 
      q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
    )
  })),
  
  deleteQuotation: (id) => set((state) => ({
    quotations: state.quotations.filter(q => q.id !== id)
  })),
  
  getQuotation: (id) => {
    const state = useQuotationStore.getState()
    return state.quotations.find(q => q.id === id)
  },
  
  updateStatus: (id, newStatus) => set((state) => ({
    quotations: state.quotations.map(q => {
      if (q.id === id) {
        const historyEntry = {
          from: q.status,
          to: newStatus,
          timestamp: new Date().toISOString()
        }
        return { 
          ...q, 
          status: newStatus,
          statusHistory: [...(q.statusHistory || []), historyEntry],
          updatedAt: new Date().toISOString()
        }
      }
      return q
    })
  }))
}))

export default useQuotationStore
