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
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    primary: 'bg-blood-red text-white hover:bg-blood-red-dark focus:ring-blood-red shadow-md hover:shadow-lg',
    secondary: 'bg-medical-blue text-white hover:bg-medical-blue-dark focus:ring-medical-blue shadow-md hover:shadow-lg',
    success: 'bg-success text-white hover:bg-success-dark focus:ring-success shadow-md hover:shadow-lg',
    danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger shadow-md hover:shadow-lg',
    outline: 'border-2 border-blood-red text-blood-red hover:bg-blood-red hover:text-white focus:ring-blood-red',
    ghost: 'text-blood-red hover:bg-blood-red-light focus:ring-blood-red'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg min-h-[48px]'
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
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;