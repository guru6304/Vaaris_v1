import React from 'react';
import {
  LayoutDashboard,
  Users,
  WalletCards,
  UserCheck,
  FolderLock,
  FileHeart,
  Gauge,
  AlertOctagon,
  BriefcaseBusiness,
  Settings,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { RouteType } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    resetDemo,
    readinessScore,
    emergencyCase,
    currentUser,
    openAuthModal,
  } = useApp();

  const prepareNavItems: { route: RouteType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { route: 'family', label: 'My Family', icon: Users },
    { route: 'assets', label: 'Assets & Liabilities', icon: WalletCards, badge: '9' },
    { route: 'nominees', label: 'Nominee Readiness', icon: UserCheck, badge: '2 Pending' },
    { route: 'documents', label: 'Document Vault', icon: FolderLock, badge: 'AI' },
    { route: 'family-plan', label: 'Family Plan', icon: FileHeart, badge: '80%' },
    { route: 'readiness', label: 'Readiness Check', icon: Gauge, badge: `${readinessScore}%` }
  ];

  const respondNavItems: { route: RouteType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    {
      route: 'emergency',
      label: 'Emergency & Claims',
      icon: AlertOctagon,
      badge: `${emergencyCase.inProgressCount} Active`
    },
    { route: 'professionals', label: 'Professionals Network', icon: BriefcaseBusiness }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen fixed left-0 top-0 bg-[#0B132B] border-r border-slate-800/80 z-30 select-none">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700 p-0.5 shadow-lg shadow-teal-950/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-300 group-hover:scale-105 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white font-['Outfit']">
                VAARIS
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-950/90 text-teal-300 px-1.5 py-0.2 rounded border border-teal-800/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Financial Continuity OS
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={() => navigate('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentRoute === 'dashboard'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 ${currentRoute === 'dashboard' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>Overview Dashboard</span>
            </div>
            {currentRoute === 'dashboard' && <ChevronRight className="w-4 h-4 text-teal-400" />}
          </button>
        </div>

        {/* SECTION 1: PREPARE JOURNEY */}
        <div>
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              PREPARE (Before Crisis)
            </span>
          </div>
          <div className="space-y-1">
            {prepareNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-teal-500/25 text-teal-200'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: RESPOND JOURNEY */}
        <div>
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              RESPOND (Post-Crisis / Claims)
            </span>
          </div>
          <div className="space-y-1">
            {respondNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route || (item.route === 'emergency' && currentRoute === 'claim-detail');
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-amber-500/25 text-amber-200'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: UTILITIES & STORY */}
        <div className="pt-2 border-t border-slate-800/60 space-y-1">
          <button
            onClick={() => navigate('welcome')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentRoute === 'welcome'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Product Entry / Story</span>
          </button>
          
          <button
            onClick={() => navigate('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              currentRoute === 'settings'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Access Tiers</span>
          </button>
        </div>
      </div>

      {/* Footer Profile & Reset Demo */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        {/* User Card */}
        {currentUser ? (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-teal-500/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.fullName}</p>
              <p className="text-[10px] text-teal-400 truncate">Cloud Verified • Active</p>
            </div>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <span>Sign In to Cloud DB</span>
          </button>
        )}

        {/* Reset Demo Button */}
        <button
          onClick={resetDemo}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Demo Benchmark</span>
        </button>
      </div>
    </aside>
  );
};
