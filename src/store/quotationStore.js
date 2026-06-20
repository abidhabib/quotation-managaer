import { create } from 'zustand';
import { STORAGE_KEYS, storage, generateId, calculateQuotationTotals, generateQuotationNumber, QUOTATION_STATUSES } from '../utils/helpers';

const getUserId = () => {
  const user = storage.get(STORAGE_KEYS.CURRENT_USER);
  return user?.id;
};

export const useQuotationStore = create((set, get) => ({
  quotations: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    dateFrom: null,
    dateTo: null,
  },

  // Initialize data
  initialize: () => {
    const userId = getUserId();
    if (!userId) return;
    
    const allQuotations = storage.get(STORAGE_KEYS.QUOTATIONS) || [];
    const userQuotations = allQuotations.filter(q => q.userId === userId);
    set({ quotations: userQuotations });
  },

  // Get quotation by ID
  getQuotationById: (id) => {
    return get().quotations.find(q => q.id === id);
  },

  // Update quotation status
  updateQuotationStatus: async (id, newStatus) => {
    return get().updateQuotation(id, { status: newStatus });
  },

  // Generate PDF (placeholder - will be implemented with pdf generation library)
  generatePDF: async (id) => {
    const quotation = get().getQuotationById(id);
    if (!quotation) return { success: false, error: 'Quotation not found' };
    
    // In production, this would generate a real PDF
    // For now, we'll just show a success message
    alert(`PDF generation for ${quotation.quotationNumber} would be triggered here.`);
    return { success: true };
  },

  // Get all quotations for current user
  getQuotations: () => {
    const userId = getUserId();
    if (!userId) return [];
    
    const allQuotations = storage.get(STORAGE_KEYS.QUOTATIONS) || [];
    return allQuotations.filter(q => q.userId === userId);
  },

  // Create quotation
  createQuotation: async (quotationData) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allQuotations = storage.get(STORAGE_KEYS.QUOTATIONS) || [];
      const userQuotations = allQuotations.filter(q => q.userId === userId);
      
      const newQuotation = {
        id: generateId(),
        userId,
        quotationNumber: generateQuotationNumber(userQuotations.length),
        customerId: quotationData.customerId,
        customerName: quotationData.customerName,
        customerEmail: quotationData.customerEmail,
        customerAddress: quotationData.customerAddress,
        customerPhone: quotationData.customerPhone,
        items: quotationData.items || [],
        status: 'draft',
        taxRate: quotationData.taxRate || 0,
        discountRate: quotationData.discountRate || 0,
        notes: quotationData.notes || '',
        terms: quotationData.terms || '',
        validityDays: quotationData.validityDays || 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (quotationData.validityDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
        history: [{
          status: 'draft',
          timestamp: new Date().toISOString(),
          note: 'Quotation created',
        }],
        template: quotationData.template || 'business',
      };
      
      // Calculate totals
      const totals = calculateQuotationTotals(newQuotation.items, newQuotation.taxRate, newQuotation.discountRate);
      newQuotation.subtotal = totals.subtotal;
      newQuotation.discountAmount = totals.discountAmount;
      newQuotation.taxAmount = totals.taxAmount;
      newQuotation.total = totals.total;
      
      allQuotations.push(newQuotation);
      storage.set(STORAGE_KEYS.QUOTATIONS, allQuotations);
      
      // Log activity
      get().logActivity('create', 'quotation', newQuotation.id, `Created quotation ${newQuotation.quotationNumber}`);
      
      set({ 
        quotations: [...get().quotations, newQuotation],
        isLoading: false 
      });
      
      return { success: true, quotation: newQuotation };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Update quotation
  updateQuotation: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allQuotations = storage.get(STORAGE_KEYS.QUOTATIONS) || [];
      const index = allQuotations.findIndex(q => q.id === id && q.userId === userId);
      
      if (index === -1) throw new Error('Quotation not found');
      
      const existingQuotation = allQuotations[index];
      
      // Check if status is changing
      let history = [...existingQuotation.history];
      if (updates.status && updates.status !== existingQuotation.status) {
        history.push({
          status: updates.status,
          timestamp: new Date().toISOString(),
          note: `Status changed from ${existingQuotation.status} to ${updates.status}`,
        });
        
        // Log activity for status change
        get().logActivity('update', 'quotation', id, `Changed status of ${existingQuotation.quotationNumber} from ${existingQuotation.status} to ${updates.status}`);
      }
      
      const updatedQuotation = {
        ...existingQuotation,
        ...updates,
        updatedAt: new Date().toISOString(),
        history,
      };
      
      // Recalculate totals if items, tax, or discount changed
      if (updates.items || updates.taxRate !== undefined || updates.discountRate !== undefined) {
        const totals = calculateQuotationTotals(
          updatedQuotation.items, 
          updatedQuotation.taxRate, 
          updatedQuotation.discountRate
        );
        updatedQuotation.subtotal = totals.subtotal;
        updatedQuotation.discountAmount = totals.discountAmount;
        updatedQuotation.taxAmount = totals.taxAmount;
        updatedQuotation.total = totals.total;
      }
      
      allQuotations[index] = updatedQuotation;
      storage.set(STORAGE_KEYS.QUOTATIONS, allQuotations);
      
      set({
        quotations: get().quotations.map(q => q.id === id ? updatedQuotation : q),
        isLoading: false
      });
      
      return { success: true, quotation: updatedQuotation };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Delete quotation
  deleteQuotation: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = getUserId();
      if (!userId) throw new Error('Not authenticated');
      
      const allQuotations = storage.get(STORAGE_KEYS.QUOTATIONS) || [];
      const quotation = allQuotations.find(q => q.id === id && q.userId === userId);
      
      if (!quotation) throw new Error('Quotation not found');
      
      const filteredQuotations = allQuotations.filter(q => q.id !== id);
      storage.set(STORAGE_KEYS.QUOTATIONS, filteredQuotations);
      
      // Log activity
      get().logActivity('delete', 'quotation', id, `Deleted quotation ${quotation.quotationNumber}`);
      
      set({
        quotations: get().quotations.filter(q => q.id !== id),
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Duplicate quotation
  duplicateQuotation: async (id) => {
    try {
      const quotation = get().quotations.find(q => q.id === id);
      if (!quotation) throw new Error('Quotation not found');
      
      const { id: _, quotationNumber, ...rest } = quotation;
      
      const result = await get().createQuotation({
        ...rest,
        items: quotation.items.map(item => ({ ...item, id: generateId() })),
      });
      
      return result;
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Set filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: { status: 'all', search: '', dateFrom: null, dateTo: null } });
  },

  // Get filtered quotations
  getFilteredQuotations: () => {
    const { quotations, filters } = get();
    
    return quotations.filter(q => {
      // Status filter
      if (filters.status !== 'all' && q.status !== filters.status) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          q.quotationNumber.toLowerCase().includes(searchLower) ||
          q.customerName.toLowerCase().includes(searchLower) ||
          q.customerEmail?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Date filters
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (new Date(q.createdAt) < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (new Date(q.createdAt) > toDate) return false;
      }
      
      return true;
    });
  },

  // Activity logging (simplified - stored in memory for now)
  logActivity: (action, type, id, description) => {
    const logs = storage.get(STORAGE_KEYS.ACTIVITY_LOGS) || [];
    const userId = getUserId();
    
    const newLog = {
      id: generateId(),
      userId,
      action,
      type,
      targetId: id,
      description,
      timestamp: new Date().toISOString(),
    };
    
    logs.unshift(newLog);
    // Keep only last 100 logs
    const trimmedLogs = logs.slice(0, 100);
    storage.set(STORAGE_KEYS.ACTIVITY_LOGS, trimmedLogs);
  },

  // Get activity logs
  getActivityLogs: (limit = 10) => {
    const userId = getUserId();
    if (!userId) return [];
    
    const allLogs = storage.get(STORAGE_KEYS.ACTIVITY_LOGS) || [];
    return allLogs.filter(log => log.userId === userId).slice(0, limit);
  },

  // Get dashboard stats
  getDashboardStats: () => {
    const quotations = get().quotations;
    
    const totalQuotations = quotations.length;
    const totalValue = quotations.reduce((sum, q) => sum + q.total, 0);
    const approvedQuotations = quotations.filter(q => q.status === 'approved').length;
    const pendingQuotations = quotations.filter(q => ['draft', 'sent'].includes(q.status)).length;
    const rejectedQuotations = quotations.filter(q => q.status === 'rejected').length;
    const expiredQuotations = quotations.filter(q => q.status === 'expired').length;
    
    // Monthly data for charts
    const monthlyData = {};
    quotations.forEach(q => {
      const month = new Date(q.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, value: 0 };
      }
      monthlyData[month].count++;
      monthlyData[month].value += q.total;
    });
    
    // Status distribution
    const statusDistribution = {};
    QUOTATION_STATUSES.forEach(status => {
      statusDistribution[status] = quotations.filter(q => q.status === status).length;
    });
    
    return {
      totalQuotations,
      totalValue,
      approvedQuotations,
      pendingQuotations,
      rejectedQuotations,
      expiredQuotations,
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })),
      statusDistribution,
    };
  },
}));
