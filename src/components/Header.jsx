import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import Sidebar from './Sidebar';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="header">
        <div className="header-left">
          <button 
            className="header-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Search..."
              className="header-search-input"
            />
          </div>
        </div>
        
        <div className="header-right">
          <button className="header-icon-btn">
            <Bell size={20} />
          </button>
          
          <div className="header-user">
            <button 
              className="header-user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="header-user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="header-user-name">{user?.name}</span>
              <ChevronDown size={16} />
            </button>
            
            {userMenuOpen && (
              <div className="header-user-menu">
                <div className="header-user-info">
                  <p className="header-user-email">{user?.email}</p>
                  <p className="header-user-company">{settings?.companyName}</p>
                </div>
                <div className="header-menu-divider" />
                <button 
                  className="header-menu-item"
                  onClick={() => {
                    navigate('/settings');
                    setUserMenuOpen(false);
                  }}
                >
                  <User size={16} />
                  Settings
                </button>
                <button 
                  className="header-menu-item"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
