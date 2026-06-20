import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoginError('');
    
    if (!validate()) return;
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLoginError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
      <div>
        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-subtitle">Sign in to your account to continue</p>
      </div>

      {(error || loginError) && (
        <div className="auth-error">{error || loginError}</div>
      )}

      <form onSubmit={onSubmit} className="auth-form-group">
        <div className="form-group">
          <label>Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="you@example.com"
            error={formErrors.email}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            error={formErrors.password}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          loading={isLoading}
          className="auth-submit-btn"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-form-footer auth-form-link">
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
