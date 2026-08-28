import React from 'react';
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  Sparkles,
  Plus,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const EmergencyPage: React.FC = () => {
  const {
    emergencyCases,
    emergencyCase,
    activeCaseId,
    setActiveCaseId,
    claims,
    navigate,
    setSelectedClaimId,
    openModal
  } = useApp();

  const handleOpenClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    navigate('claim-detail');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Empathetic Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
                Emergency & Claims Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Guided post-crisis asset transmission, institution-wise claim tracking, and advisor coordination.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openModal('startEmergencyCase')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Guided Case</span>
            </button>
          </div>
        </div>

        {/* Case Switcher Tabs if Multiple Cases Exist */}
        {emergencyCases.length > 1 && (
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Cases:</span>
            </span>
            {emergencyCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseId(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  c.id === activeCaseId
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.deceasedName} ({c.relationship})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Case Overview KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Known Assets</span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            ₹{(emergencyCase.knownAssetsValue / 100000).toFixed(1)}L
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Identified holdings</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Claims</span>
          <div className="text-xl sm:text-2xl font-bold text-teal-400 mt-1">
            {emergencyCase.potentialClaimsCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Institutions mapped</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">In Progress</span>
          <div className="text-xl sm:text-2xl font-bold text-sky-400 mt-1">
            {emergencyCase.inProgressCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Actively filed</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Completed</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
            {emergencyCase.completedCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Disbursed (Post Office)</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs font-semibold uppercase text-amber-400">Action Needed</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
            {emergencyCase.actionRequiredCount}
          </div>
          <p className="text-[10px] text-amber-300/80 mt-0.5">LIC Legal Heir Doc</p>
        </div>
      </div>

      {/* 5-Stage Visual Case Milestone Timeline */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>5-Stage Estate Recovery Timeline</span>
          </h3>
          <span className="text-xs text-slate-400">Stage 4 in Progress</span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {emergencyCase.milestones.map((m) => {
            const isComplete = m.status === 'Complete';
            const isInProgress = m.status === 'In Progress';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition-all ${
                  isComplete
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : isInProgress
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">0{m.id}</span>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {m.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional Claim Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Active Institutional Claims ({claims.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click any claim card for step-by-step resolution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim) => {
            const isActionReq = claim.status === 'Missing Document';

            return (
              <div
                key={claim.id}
                onClick={() => handleOpenClaim(claim.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:-translate-y-0.5 shadow-lg ${
                  isActionReq
                    ? 'bg-slate-900/95 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-900/80 border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {claim.assetType}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {claim.assetName}
                      </h4>
                      <p className="text-xs text-slate-400">{claim.institution}</p>
                    </div>
                    <StatusBadge status={claim.status} size="sm" />
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-slate-400">Estimated Sum / Value:</span>
                    <strong
                      className={`text-base font-bold font-mono ${
                        claim.isInsurance ? 'text-sky-400' : 'text-emerald-400'
                      }`}
                    >
                      ₹{(claim.estimatedAmount / 100000).toFixed(2)} Lakhs
                    </strong>
                  </div>
                </div>

                {/* Progress Bar & Next Step */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Claim Progress</span>
                    <span className="font-bold text-white font-mono">{claim.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isActionReq ? 'bg-amber-400' : 'bg-teal-400'
                      }`}
                      style={{ width: `${claim.progressPercentage}%` }}
                    />
                  </div>

                  <div className="text-[11px] flex items-center justify-between text-slate-300 pt-1">
                    <span className="truncate max-w-[240px]">
                      <strong className="text-slate-400">Next:</strong> {claim.nextStep}
                    </span>
                    <span className="text-amber-400 group-hover:translate-x-1 transition-transform font-semibold shrink-0">
                      View Workflow &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DisclaimerBanner type="workflow" />
    </div>
  );
};
