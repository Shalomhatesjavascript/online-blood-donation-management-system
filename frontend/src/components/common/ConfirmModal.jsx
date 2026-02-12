import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2, XCircle, CheckCircle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info', 'success'
  loading = false
}) => {
  const variants = {
    danger: {
      icon: Trash2,
      bgColor: 'bg-danger-light',
      borderColor: 'border-danger',
      iconColor: 'text-danger',
      buttonVariant: 'danger'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-light',
      borderColor: 'border-warning',
      iconColor: 'text-warning',
      buttonVariant: 'warning'
    },
    info: {
      icon: XCircle,
      bgColor: 'bg-medical-blue-light',
      borderColor: 'border-medical-blue',
      iconColor: 'text-medical-blue',
      buttonVariant: 'secondary'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-light',
      borderColor: 'border-success',
      iconColor: 'text-success',
      buttonVariant: 'success'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-lg flex items-start gap-3`}>
          <Icon className={`${config.iconColor} flex-shrink-0 mt-1`} size={24} />
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant={config.buttonVariant}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;