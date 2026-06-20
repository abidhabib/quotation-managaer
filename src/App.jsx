import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useQuotationStore } from './store/quotationStore';
import { useCustomerStore } from './store/customerStore';
import { useProductStore } from './store/productStore';
import { useSettingsStore } from './store/settingsStore';

// Layout
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quotations from './pages/Quotations';
import QuotationDetail from './pages/QuotationDetail';
import QuotationCreate from './pages/QuotationCreate';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Initialize stores when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      useQuotationStore.getState().initialize();
      useCustomerStore.getState().initialize();
      useProductStore.getState().initialize();
      useSettingsStore.getState().initialize();
    }
  }, [isAuthenticated]);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <AuthLayout>
            <Register />
          </AuthLayout>
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="quotations/new" element={<QuotationCreate />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
