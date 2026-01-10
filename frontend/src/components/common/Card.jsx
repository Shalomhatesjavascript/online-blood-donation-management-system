import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md border border-gray-100
        ${hover ? 'hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;