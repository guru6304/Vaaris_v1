import React from 'react';
import {
  RotateCcw,
  Lock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SettingsPage: React.FC = () => {
  const { resetDemo, user } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
          Settings & Access Permissions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure multi-tier family access permissions, review privacy protocols, or reset prototype benchmark.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-400" />
          <span>Demo Account Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Account Holder</span>
            <p className="text-white font-bold mt-0.5">{user.name}</p>
            <p className="text-slate-400 text-[11px]">{user.occupation}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Contact Information</span>
            <p className="text-white font-medium mt-0.5">{user.email}</p>
            <p className="text-slate-400 text-[11px]">{user.phone}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Tax & Identity Record</span>
            <p className="text-white font-mono mt-0.5">PAN: {user.panNumber}</p>
            <p className="text-emerald-400 text-[11px]">e-KYC Verified</p>
          </div>
        </div>
      </div>

      {/* Access Permission Tiers */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-400" />
          <span>Controlled Family Emergency Access Matrix</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Tier 1: Priya Sharma (Spouse)</span>
                <span className="text-[10px] font-bold bg-teal-950 text-teal-300 px-2 py-0.2 rounded border border-teal-800">
                  Primary Access
                </span>
              </div>
              <p className="text-slate-400 mt-1">
                Full access to continuity plans, asset account numbers, insurance policies, and CA directory.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold shrink-0">Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Tier 2: Suresh Sharma (Father)</span>
                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 px-2 py-0.2 rounded border border-amber-800/60">
                  Contingency Access
                </span>
              </div>
              <p className="text-slate-400 mt-1">
                Business continuity protocol and advisor network access activated on emergency incident verification.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-semibold shrink-0">Contingent</span>
          </div>
        </div>
      </div>

      {/* Investor Demo Reset Control */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <RotateCcw className="w-5 h-5" />
            <span>Investor Demo Benchmark Reset</span>
          </div>
          <span className="text-xs font-mono text-slate-400">LocalStorage Demo State</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Resetting restores the initial benchmark demo environment with Arjun Sharma's 78% Family Readiness Score, 8 organized assets, 2 pending nominee tasks, and the Ramesh Sharma post-crisis claim workflow.
        </p>

        <button
          onClick={resetDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Benchmark Now</span>
        </button>
      </div>

      <DisclaimerBanner type="privacy" />
    </div>
  );
};
