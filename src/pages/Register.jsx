import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [registerError, setRegisterError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
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
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setRegisterError('');
    
    if (!validate()) return;
    
    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      password: formData.password,
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setRegisterError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-form">
      <div>
        <h1 className="auth-form-title">Create account</h1>
        <p className="auth-form-subtitle">Start managing your quotations today</p>
      </div>

      {(error || registerError) && (
        <div className="auth-error">{error || registerError}</div>
      )}

      <form onSubmit={onSubmit} className="auth-form-group">
        <div className="form-group">
          <label>Full Name</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            error={formErrors.name}
          />
        </div>

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
          <label>Company (Optional)</label>
          <Input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Your Company Ltd."
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="At least 6 characters"
            error={formErrors.password}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm your password"
            error={formErrors.confirmPassword}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          loading={isLoading}
          className="auth-submit-btn"
        >
          Create Account
        </Button>
      </form>

      <div className="auth-form-footer auth-form-link">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
