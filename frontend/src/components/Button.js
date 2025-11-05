import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }) => {
  const baseClass = 'btn';
  const classes = `${baseClass} ${baseClass}--${variant} ${baseClass}--${size} ${className}`;

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export { Button };