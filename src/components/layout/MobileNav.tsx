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
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { RouteType } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentRoute, navigate, resetDemo, readinessScore, emergencyCase } = useApp();

  if (!isOpen) return null;

  const handleNav = (route: RouteType) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0B132B] border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-50">
        <div className="space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <span className="font-extrabold text-xl text-white font-['Outfit']">VAARIS</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
              currentRoute === 'dashboard'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-teal-400" />
            <span>Overview Dashboard</span>
          </button>

          {/* PREPARE Section */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400 px-3">
              PREPARE (Before Crisis)
            </p>
            <button
              onClick={() => handleNav('family')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-teal-400" /> My Family
              </span>
            </button>
            <button
              onClick={() => handleNav('assets')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <WalletCards className="w-4 h-4 text-teal-400" /> Assets & Liabilities
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">9</span>
            </button>
            <button
              onClick={() => handleNav('nominees')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-teal-400" /> Nominee Readiness
              </span>
              <span className="text-[10px] bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded text-amber-300">2 Pending</span>
            </button>
            <button
              onClick={() => handleNav('documents')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <FolderLock className="w-4 h-4 text-teal-400" /> Document Vault
              </span>
            </button>
            <button
              onClick={() => handleNav('family-plan')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <FileHeart className="w-4 h-4 text-teal-400" /> Family Plan
              </span>
              <span className="text-[10px] bg-teal-950 border border-teal-800 px-1.5 py-0.5 rounded text-teal-300">80%</span>
            </button>
            <button
              onClick={() => handleNav('readiness')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-teal-400" /> Readiness Check
              </span>
              <span className="text-[10px] font-bold text-teal-300">{readinessScore}%</span>
            </button>
          </div>

          {/* RESPOND Section */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-3">
              RESPOND (Post-Crisis)
            </p>
            <button
              onClick={() => handleNav('emergency')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-amber-400" /> Emergency & Claims
              </span>
              <span className="text-[10px] bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded text-amber-300">
                {emergencyCase.inProgressCount} Active
              </span>
            </button>
            <button
              onClick={() => handleNav('professionals')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <BriefcaseBusiness className="w-4 h-4 text-amber-400" /> Professionals
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/60 space-y-1">
            <button
              onClick={() => handleNav('welcome')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Product Entry / Story
            </button>
            <button
              onClick={() => handleNav('settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" /> Settings & Permissions
            </button>
          </div>
        </div>

        {/* Bottom Reset */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              resetDemo();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};
