import React from 'react';
import './Input.css';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`input-wrapper ${wrapperClassName}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
