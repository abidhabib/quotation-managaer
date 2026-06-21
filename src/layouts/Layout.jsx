import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();

  const themes = [
    { id: 'light', name: 'Light Business' },
    { id: 'dark', name: 'Dark Mode' },
    { id: 'luxury', name: 'Premium Luxury' },
    { id: 'minimal', name: 'Minimal' }
  ];

  return (
    <div className={`app-layout theme-${theme}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <div className="header-right">
            {/* Theme Switcher */}
            <div className="theme-switcher">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="theme-select"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* User Menu */}
            <div className="user-menu">
              <Link to="/settings" className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </Link>
              <span className="user-name">{user?.name}</span>
              <button onClick={logout} className="logout-btn" title="Logout">
                ⟶
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
