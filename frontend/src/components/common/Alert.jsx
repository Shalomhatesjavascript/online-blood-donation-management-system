import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  className = '' 
}) => {
  const types = {
    success: {
      bg: 'bg-success-light',
      border: 'border-success',
      text: 'text-success-dark',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-danger-light',
      border: 'border-danger',
      text: 'text-danger-dark',
      icon: XCircle
    },
    warning: {
      bg: 'bg-warning-light',
      border: 'border-warning',
      text: 'text-warning-dark',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-medical-blue-light',
      border: 'border-medical-blue',
      text: 'text-medical-blue-dark',
      icon: Info
    }
  };

  const { bg, border, text, icon: Icon } = types[type];

  return (
    <div className={`
      ${bg} ${border} ${text} 
      border-l-4 p-4 rounded-lg flex items-start gap-3 animate-fadeIn
      ${className}
    `}>
      <Icon size={24} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1 font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;