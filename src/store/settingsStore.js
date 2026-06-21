import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      company: {
        name: 'Your Company',
        address: '',
        phone: '',
        email: '',
        logo: null,
        currency: 'PKR',
      },
      quotationDefaults: {
        validityDays: 30,
        taxRate: 0,
        discountRate: 0,
        terms: '',
        notes: '',
      },

      updateCompany: (updates) => {
        set((state) => ({
          company: { ...state.company, ...updates },
        }));
      },

      updateDefaults: (updates) => {
        set((state) => ({
          quotationDefaults: { ...state.quotationDefaults, ...updates },
        }));
      },

      uploadLogo: (logoUrl) => {
        set((state) => ({
          company: { ...state.company, logo: logoUrl },
        }));
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
