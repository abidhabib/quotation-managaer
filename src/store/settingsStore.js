import { create } from 'zustand'

const useSettingsStore = create((set) => ({
  settings: {
    companyName: '',
    companyLogo: null,
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    currency: 'USD',
    defaultValidityDays: 30,
    defaultTaxRate: 0,
    defaultTerms: '',
    template: 'business'
  },
  
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  getSetting: (key) => {
    const state = useSettingsStore.getState()
    return state.settings[key]
  }
}))

export default useSettingsStore
