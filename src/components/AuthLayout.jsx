import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/login" className="auth-logo">
            <FileText size={32} strokeWidth={2.5} />
            <span>QuotationPro</span>
          </Link>
          <p className="auth-tagline">Professional Quotation Management</p>
        </div>
        
        <div className="auth-content">
          {children}
        </div>
        
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} QuotationPro. All rights reserved.</p>
        </div>
      </div>
      
      <div className="auth-illustration">
        <div className="auth-illustration-content">
          <h1>Create Professional Quotations</h1>
          <p>Manage customers, products, and generate beautiful PDF quotations in minutes.</p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <FileText size={24} />
              </div>
              <span>Quick Creation</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <Plus size={24} />
              </div>
              <span>Custom Templates</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">
                <FileText size={24} />
              </div>
              <span>PDF Export</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
