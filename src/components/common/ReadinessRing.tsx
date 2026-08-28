import React from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ReadinessRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
  showSubtitle?: boolean;
  pendingCount?: number;
}

export const ReadinessRing: React.FC<ReadinessRingProps> = ({
  score,
  maxScore = 100,
  size = 140,
  strokeWidth = 10,
  onClick,
  showSubtitle = true,
  pendingCount = 3
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, score / maxScore));
  const strokeDashoffset = circumference - progress * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 85) return '#10B981'; // Emerald
    if (val >= 70) return '#0D9488'; // Teal
    if (val >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Rose
  };

  const ringColor = getScoreColor(score);

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-teal-950/30 shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-950/40 group' : ''
      }`}
    >
      {/* SVG Ring Gauge */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-extrabold tracking-tight text-white flex items-baseline">
            <span>{score}</span>
            <span className="text-base text-slate-400 font-semibold">%</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 mt-0.5">
            Readiness
          </span>
        </div>
      </div>

      {/* Info & Story Details */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Family Financial Continuity Score</span>
          </div>
          {onClick && (
            <span className="hidden sm:inline-flex items-center text-xs text-slate-400 group-hover:text-teal-300 font-medium transition-colors">
              Readiness Check <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mt-2">
          {score >= 85
            ? 'Your family is thoroughly prepared for unexpected events.'
            : score >= 75
            ? 'Your family is well prepared, but 3 important actions still need attention.'
            : 'Several critical continuity gaps require your attention.'}
        </h3>

        {showSubtitle && (
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 leading-relaxed">
            {pendingCount > 0
              ? `${pendingCount} actionable items remaining: EPF nomination verification, secondary insurance beneficiary, and property encumbrance records.`
              : 'All primary nominees, emergency instructions, and verified documents are currently synchronized.'}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Dynamic Score Monitoring
          </span>
          <span className="text-[11px] text-slate-400">
            Click gauge to view prioritized resolution checklist &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
