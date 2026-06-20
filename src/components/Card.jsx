import React from 'react';
import './Card.css';

const Card = ({
  children,
  className = '',
  padding = true,
  ...props
}) => {
  return (
    <div 
      className={`card ${padding ? 'card-padded' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
