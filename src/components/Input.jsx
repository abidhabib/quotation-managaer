import React from 'react'

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || props.name
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="form-input"
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

export default Input
