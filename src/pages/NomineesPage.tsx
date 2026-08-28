import React from 'react';
import {
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Info,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const NomineesPage: React.FC = () => {
  const {
    assets,
    openModal,
    setSelectedAssetId,
    nomineeCoveragePercentage,
    readinessScore
  } = useApp();

  const eligibleAssets = assets.filter((a) => a.category !== 'loans_liabilities');
  const actionRequiredCount = eligibleAssets.filter(
    (a) => a.nomineeStatus === 'Action Required' || a.nomineeStatus === 'Needs Review'
  ).length;

  const handleReviewNominee = (assetId: string) => {
    setSelectedAssetId(assetId);
    openModal('reviewNominee');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Nominee & Ownership Readiness
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {nomineeCoveragePercentage}% Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ensure institutional nominee designations match family intent for friction-free transmission.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Readiness Score: <strong className="text-teal-400">{readinessScore}%</strong>
          </div>
        </div>
      </div>

      {/* Prominent Legal Disclaimer Banner — Mandatory Section 10 */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <Info className="w-4 h-4" />
          <span>LEGAL CLARITY: NOMINEE VS. ESTATE BENEFICIARY</span>
        </div>
        <p className="text-xs text-slate-300/90 leading-relaxed">
          Nominee information helps with claim and settlement workflows. Legal ownership and inheritance may depend on applicable laws and estate documents.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Accounts</span>
            <div className="text-2xl font-bold text-white mt-1">{eligibleAssets.length}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Verified Nominees</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {eligibleAssets.filter((a) => a.nomineeStatus === 'Verified').length}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Action Required</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{actionRequiredCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Asset Nominee Registry Table / Cards */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Institutional Nominee Status Registry
          </h3>
          <span className="text-xs text-slate-400">
            Click "Review Nominee" to verify or update records
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {eligibleAssets.map((asset) => {
            const hasNominees = asset.nominees.length > 0;

            return (
              <div
                key={asset.id}
                className="p-5 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Asset Info */}
                <div className="space-y-1 min-w-0 md:max-w-xs">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{asset.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {asset.institution} • <span className="font-mono text-slate-400">{asset.accountNumberMasked}</span>
                  </p>
                </div>

                {/* Nominee Share Allocation */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                    Assigned Nominee(s)
                  </span>
                  {hasNominees ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {asset.nominees.map((nom, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                        >
                          <strong className="text-white">{nom.name}</strong>
                          <span className="text-teal-400 font-semibold font-mono">
                            {nom.sharePercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">({nom.relationship})</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400/90 font-medium">
                      No nominee confirmed on record
                    </span>
                  )}
                </div>

                {/* Status & Verification Date */}
                <div className="flex items-center gap-4 md:text-right">
                  <div className="space-y-0.5">
                    <StatusBadge status={asset.nomineeStatus} size="sm" />
                    <p className="text-[10px] text-slate-500 flex items-center md:justify-end gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {asset.lastReviewedDate}
                    </p>
                  </div>

                  <button
                    onClick={() => handleReviewNominee(asset.id)}
                    className="px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Review Nominee
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DisclaimerBanner type="legal" />
    </div>
  );
};
