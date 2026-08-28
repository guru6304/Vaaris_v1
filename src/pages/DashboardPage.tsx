import React from 'react';
import {
  HeartHandshake,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileHeart,
  Plus,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReadinessRing } from '../components/common/ReadinessRing';
import { StatCard } from '../components/common/StatCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const DashboardPage: React.FC = () => {
  const {
    user,
    navigate,
    totalAssetValue,
    totalLiabilities,
    netWorth,
    totalInsuranceCoverage,
    organizedAssetsCount,
    nomineeCoveragePercentage,
    protectedDocumentsCount,
    familyMembers,
    readinessScore,
    readinessActions,
    resolveActionItem,
    openModal,
    setSelectedAssetId
  } = useApp();

  const pendingActions = readinessActions.filter((a) => !a.isResolved);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Good morning, {user.name.split(' ')[0]}.
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60 hidden sm:inline-block">
              Family Administrator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your family's financial continuity and emergency readiness are actively monitored.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('addAsset')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>

          <button
            onClick={() => navigate('family-plan')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all cursor-pointer"
          >
            <FileHeart className="w-4 h-4 text-teal-400" />
            <span>Continuity Plan</span>
          </button>
        </div>
      </div>

      {/* Flagship Family Readiness Gauge */}
      <ReadinessRing
        score={readinessScore}
        pendingCount={pendingActions.length}
        onClick={() => navigate('readiness')}
      />

      {/* Summary KPI Metric Cards (With True Financial Calculations) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Net Liquid Worth"
          value={`₹${(netWorth / 100000).toFixed(1)}L`}
          subtext={`Gross ₹${(totalAssetValue / 100000).toFixed(1)}L - Debt ₹${(totalLiabilities / 100000).toFixed(1)}L`}
          iconName="WalletCards"
          accentColor="teal"
          onClick={() => navigate('assets')}
        />

        <StatCard
          title="Assets Organized"
          value={`${organizedAssetsCount}`}
          subtext="Catalogued with identifiers"
          iconName="ShieldCheck"
          accentColor="slate"
          onClick={() => navigate('assets')}
        />

        <StatCard
          title="Nominee Coverage"
          value={`${nomineeCoveragePercentage}%`}
          subtext="Verified beneficiary split"
          iconName="UserCheck"
          badge={nomineeCoveragePercentage < 80 ? 'Review Needed' : 'Good'}
          badgeType={nomineeCoveragePercentage < 80 ? 'warning' : 'success'}
          accentColor="amber"
          onClick={() => navigate('nominees')}
        />

        <StatCard
          title="Vault Documents"
          value={protectedDocumentsCount}
          subtext="Secured & indexed"
          iconName="FolderLock"
          accentColor="blue"
          onClick={() => navigate('documents')}
        />

        <StatCard
          title="Family Members"
          value={familyMembers.length + 1}
          subtext="Registered with roles"
          iconName="Users"
          accentColor="purple"
          onClick={() => navigate('family')}
        />
      </div>

      {/* Financial Breakdown Separation Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        {/* Insurance Sum Assured Separation Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Contingent Protection</span>
              <strong className="text-white text-xs">₹{(totalInsuranceCoverage / 10000000).toFixed(2)} Cr Term Life Cover</strong>
              <p className="text-[10.5px] text-slate-400">Kept strictly separate from net liquid assets</p>
            </div>
          </div>
          <button
            onClick={() => navigate('assets')}
            className="text-teal-400 hover:text-teal-300 font-semibold shrink-0 cursor-pointer"
          >
            Details &rarr;
          </button>
        </div>

        {/* Liabilities Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Outstanding Liabilities</span>
              <strong className="text-white text-xs">₹{(totalLiabilities / 100000).toFixed(1)} Lakhs (Home Loan)</strong>
              <p className="text-[10.5px] text-slate-400">Deducted from gross assets to determine net estate</p>
            </div>
          </div>
          <button
            onClick={() => navigate('assets')}
            className="text-slate-400 hover:text-white font-semibold shrink-0 cursor-pointer"
          >
            Review &rarr;
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Action Required vs. Family Continuity Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Action Required (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">ACTION REQUIRED</h2>
              <span className="text-[11px] font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800/60">
                {pendingActions.length} Priority Tasks
              </span>
            </div>
            <button
              onClick={() => navigate('readiness')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              All Actions &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingActions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">All Readiness Tasks Resolved!</p>
                <p className="text-xs text-slate-400">Your family continuity preparation is comprehensive.</p>
              </div>
            ) : (
              pendingActions.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/50 shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {act.title}
                        </h4>
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded">
                          +{act.points} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (act.targetId) setSelectedAssetId(act.targetId);
                        navigate(act.targetRoute);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Resolve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => resolveActionItem(act.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-300 hidden sm:inline-block cursor-pointer"
                      title="Quick mark done"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: IF SOMETHING HAPPENS TO ME & Family Snapshot (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flagship Continuity Card */}
          <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileHeart className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  IF SOMETHING HAPPENS TO ME
                </span>
              </div>
              <span className="text-xs font-bold text-teal-300 bg-teal-950/90 border border-teal-800/60 px-2 py-0.5 rounded-full">
                80% Complete
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Your family has a continuity plan in place.
              </h3>
              <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                Emergency contacts, CA coordination mandates, financial responsibilities, and instructions are securely mapped.
              </p>
            </div>

            <button
              onClick={() => navigate('family-plan')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <span>Review My Family Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* YOUR FAMILY Snapshot */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                YOUR FAMILY
              </h3>
              <button
                onClick={() => navigate('family')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
              >
                Manage Family &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {familyMembers.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  onClick={() => navigate('family')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-[11px]`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-400">{member.relationship}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safe Language Disclaimer */}
      <DisclaimerBanner type="legal" />
    </div>
  );
};
