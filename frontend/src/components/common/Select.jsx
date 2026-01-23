import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = ''
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-blood-red">*</span>}
        </label>
      )}
      
      <select
        name={name}
        value={value || ''} // ENSURE empty string if value is null/undefined
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          ${error 
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger-light' 
            : 'border-gray-300 focus:border-blood-red focus:ring-2 focus:ring-blood-red-light'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
      >
        <option value="">{placeholder}</option> {/* Empty value for "All" */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-danger flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Select;