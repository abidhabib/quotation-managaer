import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name) {
      setErrors({ name: 'Name is required' });
      return;
    }
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
      register(formData);
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">QuoteFlow</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="John Doe"
          />

          <Input
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="you@example.com"
          />

          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Inc"
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
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
