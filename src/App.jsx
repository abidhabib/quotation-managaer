import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Placeholder pages - will be implemented next
const Customers = () => <div className="card"><h1 className="text-2xl font-bold">Customers</h1><p className="mt-4 text-gray-600">Customer management coming soon...</p></div>;
const Products = () => <div className="card"><h1 className="text-2xl font-bold">Products</h1><p className="mt-4 text-gray-600">Product management coming soon...</p></div>;
const Quotations = () => <div className="card"><h1 className="text-2xl font-bold">Quotations</h1><p className="mt-4 text-gray-600">Quotation builder coming soon...</p></div>;
const Settings = () => <div className="card"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4 text-gray-600">Settings page coming soon...</p></div>;

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
