import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'Active'
    },
    pending: {
      icon: Clock,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      label: 'Pending'
    },
    completed: {
      icon: CheckCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      label: 'Completed'
    },
    overdue: {
      icon: AlertCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Overdue'
    },
    verified: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'Verified'
    },
    closed: {
      icon: XCircle,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      label: 'Closed'
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full font-medium`}>
      <Icon className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} mr-1.5`} />
      {config.label}
    </div>
  );
}