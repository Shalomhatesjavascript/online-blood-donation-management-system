import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-500 text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    info: 'bg-medical-blue text-white',
    primary: 'bg-blood-red text-white'
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;