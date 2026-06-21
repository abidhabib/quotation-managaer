import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(formData.email, formData.password);
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">QuoteFlow</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 text-center">Demo credentials:</p>
          <p className="text-xs text-gray-600 text-center mt-1">Any email / Any password</p>
        </div>
      </div>
    </div>
  );
}
