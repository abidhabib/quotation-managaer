import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [registerError, setRegisterError] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    setRegisterError('');
    
    const result = await registerUser({
      name: data.name,
      email: data.email,
      company: data.company,
      password: data.password,
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

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form-group">
        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Company (Optional)"
          placeholder="Your Company Ltd."
          error={errors.company?.message}
          {...register('company')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => 
              value === watch('password') || 'Passwords do not match',
          })}
        />

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
