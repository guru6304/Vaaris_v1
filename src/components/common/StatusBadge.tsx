import React from 'react';
import { CheckCircle2, AlertCircle, Clock, HelpCircle, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status:
    | 'Verified'
    | 'Needs Review'
    | 'Action Required'
    | 'Not Added'
    | 'Unknown'
    | 'Document Processed'
    | 'AI Processing'
    | 'Needs Verification'
    | 'Documents Submitted'
    | 'Missing Document'
    | 'Information Review'
    | 'Claim Preparation'
    | 'Payout Completed'
    | 'Complete'
    | 'In Progress'
    | 'Pending'
    | 'Active'
    | 'Available';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', showIcon = true }) => {
  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/80';
  let Icon = HelpCircle;

  switch (status) {
    case 'Verified':
    case 'Document Processed':
    case 'Payout Completed':
    case 'Complete':
    case 'Active':
      colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
      Icon = CheckCircle2;
      break;

    case 'Action Required':
    case 'Missing Document':
    case 'Needs Verification':
      colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-800/60';
      Icon = AlertCircle;
      break;

    case 'Needs Review':
    case 'Information Review':
    case 'Claim Preparation':
    case 'In Progress':
    case 'AI Processing':
      colorClasses = 'bg-sky-950/70 text-sky-300 border-sky-800/60';
      Icon = Clock;
      break;

    case 'Not Added':
    case 'Unknown':
      colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-800/60';
      Icon = ShieldAlert;
      break;

    case 'Pending':
    case 'Available':
      colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/80';
      Icon = Clock;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs tracking-wide ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
};
