import React from 'react';
import * as LucideIcons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  iconName: keyof typeof LucideIcons;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
  onClick?: () => void;
  accentColor?: 'teal' | 'amber' | 'blue' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  iconName,
  badge,
  badgeType = 'neutral',
  onClick,
  accentColor = 'teal'
}) => {
  // Safe dynamic icon resolution
  const IconComponent = (LucideIcons[iconName] as React.ComponentType<{ className?: string }>) || LucideIcons.Activity;

  const accentStyles = {
    teal: 'border-teal-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/20 text-teal-400',
    amber: 'border-amber-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/20 text-amber-400',
    blue: 'border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/20 text-blue-400',
    purple: 'border-purple-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/20 text-purple-400',
    slate: 'border-slate-800 bg-slate-900/80 text-slate-400'
  }[accentColor];

  const badgeStyles = {
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    info: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700'
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:border-slate-600/80 hover:shadow-lg' : ''
      } ${accentStyles}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="rounded-lg bg-slate-800/80 p-2 text-inherit border border-white/5">
          <IconComponent className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeStyles}`}>
            {badge}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1.5 text-xs text-slate-400 line-clamp-1">{subtext}</p>}
    </div>
  );
};
