import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn'
  const variantClasses = `btn-${variant}`
  const sizeClasses = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
  const disabledClasses = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : ''
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      onClick={loading || disabled ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />}
      {children}
    </button>
  )
}

export default Button
