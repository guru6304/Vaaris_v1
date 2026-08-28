import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReadinessRing } from '../components/common/ReadinessRing';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ReadinessPage: React.FC = () => {
  const {
    readinessScore,
    readinessBreakdown,
    readinessActions,
    resolveActionItem,
    navigate,
    setSelectedAssetId
  } = useApp();

  const pendingActions = readinessActions.filter((a) => !a.isResolved);
  const resolvedActions = readinessActions.filter((a) => a.isResolved);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Family Readiness Assessment
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              Interactive Diagnostic
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete assessment of your family's financial continuity across 6 core institutional pillars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Score:</span>
          <span className="text-lg font-extrabold text-teal-400 font-mono">
            {readinessScore}/100
          </span>
        </div>
      </div>

      {/* Main Readiness Gauge */}
      <ReadinessRing score={readinessScore} pendingCount={pendingActions.length} />

      {/* 6 Category Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <span>Category-Wise Continuity Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readinessBreakdown.map((cat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{cat.category}</h3>
                <span
                  className={`text-xs font-bold font-mono ${
                    cat.percentage >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {cat.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    cat.percentage >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prioritized Action Required Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Prioritized Readiness Tasks ({pendingActions.length} Remaining)</span>
          </h2>
          <span className="text-xs text-slate-400">
            Resolving actions automatically raises your family score
          </span>
        </div>

        <div className="space-y-3">
          {pendingActions.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                    act.priority === 'HIGH PRIORITY'
                      ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.priority === 'HIGH PRIORITY'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{act.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-teal-300 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:self-center">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800/60">
                  +{act.points} pts
                </span>
                <button
                  onClick={() => {
                    if (act.targetId) setSelectedAssetId(act.targetId);
                    navigate(act.targetRoute);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => resolveActionItem(act.id)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}

          {/* Completed Actions History */}
          {resolvedActions.length > 0 && (
            <div className="pt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Completed Actions ({resolvedActions.length})
              </h3>
              {resolvedActions.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300 line-through">{act.title}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                    +{act.points} pts added
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DisclaimerBanner type="workflow" />
    </div>
  );
};
