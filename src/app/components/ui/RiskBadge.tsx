import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Severity } from '../../data/mockAlerts';

interface RiskBadgeProps {
  severity: Severity;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, score, className }) => {
  const getColors = (sev: Severity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={twMerge(clsx('flex items-center gap-2', className))}>
      <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium border', getColors(severity))}>
        {severity.toUpperCase()}
      </span>
      {score !== undefined && (
        <span className="text-sm font-semibold text-gray-700">
          Risk Score: <span className={clsx({
            'text-red-600': score >= 90,
            'text-orange-600': score >= 70 && score < 90,
            'text-yellow-600': score >= 40 && score < 70,
            'text-blue-600': score < 40,
          })}>{score}</span>
        </span>
      )}
    </div>
  );
};
