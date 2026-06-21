import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      company: {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        logo: null,
        website: '',
        taxId: '',
      },
      defaults: {
        currency: 'USD',
        taxRate: 0,
        validityDays: 30,
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
          defaults: { ...state.defaults, ...updates },
        }));
      },
      
      resetSettings: () => {
        set({
          company: {
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            logo: null,
            website: '',
            taxId: '',
          },
          defaults: {
            currency: 'USD',
            taxRate: 0,
            validityDays: 30,
            terms: '',
            notes: '',
          },
        });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
