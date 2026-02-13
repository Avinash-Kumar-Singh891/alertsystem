import React from 'react';
import { clsx } from 'clsx';
import { AlertStatus } from '../../data/mockAlerts';

interface StatusBadgeProps {
  status: AlertStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColors = (st: AlertStatus) => {
    switch (st) {
      case 'Open':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Investigating':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'False Positive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium border', getColors(status))}>
      {status}
    </span>
  );
};
