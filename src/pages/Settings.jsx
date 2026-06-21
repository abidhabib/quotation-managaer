import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Settings() {
  const { company, quotationDefaults, updateCompany, updateDefaults } = useSettingsStore();
  const [companyForm, setCompanyForm] = useState(company);
  const [defaultsForm, setDefaultsForm] = useState(quotationDefaults);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateCompany(companyForm);
    updateDefaults(defaultsForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-espresso">Settings</h1>
        <p className="text-taupe mt-1">Configure your company and quotation defaults</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      {/* Company Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-espresso mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Company Name" value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} />
          <Input label="Email" type="email" value={companyForm.email} onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})} />
          <Input label="Phone" value={companyForm.phone} onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})} />
          <Input label="Currency" value={companyForm.currency} onChange={(e) => setCompanyForm({...companyForm, currency: e.target.value})} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-espresso mb-1.5">Address</label>
            <textarea value={companyForm.address} onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" rows={2} />
          </div>
        </div>
      </div>

      {/* Quotation Defaults */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-espresso mb-4">Quotation Defaults</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Validity (Days)" type="number" value={defaultsForm.validityDays} onChange={(e) => setDefaultsForm({...defaultsForm, validityDays: parseInt(e.target.value) || 0})} />
          <Input label="Tax Rate (%)" type="number" step="0.1" value={defaultsForm.taxRate} onChange={(e) => setDefaultsForm({...defaultsForm, taxRate: parseFloat(e.target.value) || 0})} />
          <Input label="Default Discount (%)" type="number" step="0.1" value={defaultsForm.discountRate} onChange={(e) => setDefaultsForm({...defaultsForm, discountRate: parseFloat(e.target.value) || 0})} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-espresso mb-1.5">Terms & Conditions</label>
            <textarea value={defaultsForm.terms} onChange={(e) => setDefaultsForm({...defaultsForm, terms: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" rows={4} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-espresso mb-1.5">Default Notes</label>
            <textarea value={defaultsForm.notes} onChange={(e) => setDefaultsForm({...defaultsForm, notes: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" rows={2} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
