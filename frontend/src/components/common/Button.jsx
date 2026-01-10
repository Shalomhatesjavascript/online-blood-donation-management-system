import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blood-red text-white hover:bg-blood-red-dark focus:ring-blood-red shadow-md hover:shadow-lg',
    secondary: 'bg-medical-blue text-white hover:bg-medical-blue-dark focus:ring-medical-blue shadow-md hover:shadow-lg',
    success: 'bg-success text-white hover:bg-success-dark focus:ring-success shadow-md hover:shadow-lg',
    danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger shadow-md hover:shadow-lg',
    outline: 'border-2 border-blood-red text-blood-red hover:bg-blood-red hover:text-white focus:ring-blood-red',
    ghost: 'text-blood-red hover:bg-blood-red-light focus:ring-blood-red'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;