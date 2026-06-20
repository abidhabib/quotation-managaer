import React, { useEffect } from 'react';
import { Settings as SettingsIcon, Building, FileText, DollarSign, Palette } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useTheme } from '../../hooks/useTheme';
import './Settings.css';

const Settings = () => {
  const { settings, updateSettings, initialize } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = React.useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    currency: 'USD',
    defaultValidityDays: 30,
    defaultTax: 0,
    defaultTerms: '',
    logo: null,
  });
  const [saved, setSaved] = React.useState(false);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        companyAddress: settings.companyAddress || '',
        companyPhone: settings.companyPhone || '',
        companyEmail: settings.companyEmail || '',
        currency: settings.currency || 'USD',
        defaultValidityDays: settings.defaultValidityDays || 30,
        defaultTax: settings.defaultTax || 0,
        defaultTerms: settings.defaultTerms || '',
        logo: settings.logo || null,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const themes = [
    { id: 'light-business', name: 'Light Business', preview: '#ffffff' },
    { id: 'dark-mode', name: 'Dark Mode', preview: '#1a1a2e' },
    { id: 'premium-luxury', name: 'Premium Luxury', preview: '#1a1a1a' },
    { id: 'minimal', name: 'Minimal', preview: '#f5f5f5' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your company and quotation preferences</p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          onClick={handleSave}
          disabled={!saved}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="settings-grid">
        <Card>
          <div className="card-header">
            <Building size={20} />
            <h3 className="card-title">Company Information</h3>
          </div>

          <div className="form-group">
            <label>Company Logo</label>
            <div className="logo-upload">
              {formData.logo ? (
                <div className="logo-preview">
                  <img src={formData.logo} alt="Company logo" />
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                    className="remove-logo"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    hidden
                  />
                  <span>Click to upload logo</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Your Company Name"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <Input
              type="text"
              value={formData.companyAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, companyAddress: e.target.value }))}
              placeholder="123 Business Street, City, Country"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <Input
                type="tel"
                value={formData.companyPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, companyPhone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <Input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, companyEmail: e.target.value }))}
                placeholder="info@company.com"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <FileText size={20} />
            <h3 className="card-title">Quotation Defaults</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="form-select"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Validity (Days)</label>
              <Input
                type="number"
                value={formData.defaultValidityDays}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultValidityDays: parseInt(e.target.value) }))}
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Default Tax Rate (%)</label>
            <Input
              type="number"
              value={formData.defaultTax}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultTax: parseFloat(e.target.value) || 0 }))}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Default Terms & Conditions</label>
            <textarea
              value={formData.defaultTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultTerms: e.target.value }))}
              placeholder="Enter default terms and conditions..."
              className="form-textarea"
              rows="5"
            />
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <Palette size={20} />
            <h3 className="card-title">Appearance</h3>
          </div>

          <div className="theme-grid">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <div 
                  className="theme-preview" 
                  style={{ backgroundColor: t.preview }}
                />
                <span>{t.name}</span>
                {theme === t.id && (
                  <div className="theme-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
