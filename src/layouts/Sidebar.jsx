import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/quotations', label: 'Quotations', icon: '📄' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
          QuotationManager
        </h2>
      </div>

      <nav>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--border-color)' 
      }}>
        <div style={{ 
          padding: '0.75rem 1rem', 
          marginBottom: '0.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-tertiary)'
        }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            {user?.name || 'User'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user?.email || 'user@example.com'}
          </p>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
