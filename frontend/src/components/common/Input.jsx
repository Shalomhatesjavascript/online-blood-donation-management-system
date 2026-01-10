import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-blood-red">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger-light' 
              : 'border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            placeholder:text-gray-400
            ${className}
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;