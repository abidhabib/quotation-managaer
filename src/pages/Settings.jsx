import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const [companyData, setCompanyData] = useState({
    companyName: settings?.companyName || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    currency: settings?.currency || 'USD',
    logo: settings?.logo || ''
  });

  const [quoteDefaults, setQuoteDefaults] = useState({
    validityDays: settings?.validityDays || 30,
    defaultTax: settings?.defaultTax || 0,
    terms: settings?.terms || ''
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || ''
  });

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      await updateSettings(companyData);
      alert('Company settings saved!');
    } catch (error) {
      console.error('Error saving company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDefaults = async () => {
    setLoading(true);
    try {
      await updateSettings({
        ...quoteDefaults,
        validityDays: parseInt(quoteDefaults.validityDays) || 30,
        defaultTax: parseFloat(quoteDefaults.defaultTax) || 0
      });
      alert('Quotation defaults saved!');
    } catch (error) {
      console.error('Error saving defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUser(profileData);
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData({ ...companyData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Customize your quotation system</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          Company
        </button>
        <button
          className={`tab-btn ${activeTab === 'quotations' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotations')}
        >
          Quotation Defaults
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      {activeTab === 'company' && (
        <Card className="settings-card">
          <h2>Company Information</h2>
          
          <div className="form-group">
            <label>Company Logo</label>
            <div className="logo-upload">
              {companyData.logo && (
                <img src={companyData.logo} alt="Company logo" className="logo-preview" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          <Input
            type="text"
            label="Company Name"
            value={companyData.companyName}
            onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
          />

          <div className="form-group">
            <label>Address</label>
            <textarea
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <Input
              type="tel"
              label="Phone"
              value={companyData.phone}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
            />

            <Input
              type="email"
              label="Email"
              value={companyData.email}
              onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              value={companyData.currency}
              onChange={(e) => setCompanyData({ ...companyData, currency: e.target.value })}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          <Button onClick={handleSaveCompany} loading={loading}>
            Save Company Settings
          </Button>
        </Card>
      )}

      {activeTab === 'quotations' && (
        <Card className="settings-card">
          <h2>Quotation Defaults</h2>

          <Input
            type="number"
            label="Default Validity (days)"
            value={quoteDefaults.validityDays}
            onChange={(e) => setQuoteDefaults({ ...quoteDefaults, validityDays: e.target.value })}
            min="1"
          />

          <Input
            type="number"
            label="Default Tax Rate (%)"
            value={quoteDefaults.defaultTax}
            onChange={(e) => setQuoteDefaults({ ...quoteDefaults, defaultTax: e.target.value })}
            step="0.1"
            min="0"
            max="100"
          />

          <div className="form-group">
            <label>Default Terms & Conditions</label>
            <textarea
              value={quoteDefaults.terms}
              onChange={(e) => setQuoteDefaults({ ...quoteDefaults, terms: e.target.value })}
              rows="4"
              placeholder="Payment terms, delivery conditions, etc."
            />
          </div>

          <Button onClick={handleSaveDefaults} loading={loading}>
            Save Quotation Defaults
          </Button>
        </Card>
      )}

      {activeTab === 'profile' && (
        <Card className="settings-card">
          <h2>User Profile</h2>

          <Input
            type="text"
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />

          <Input
            type="email"
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />

          <Input
            type="text"
            label="Company"
            value={profileData.company}
            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
          />

          <Button onClick={handleSaveProfile} loading={loading}>
            Update Profile
          </Button>
        </Card>
      )}
    </div>
  );
}
