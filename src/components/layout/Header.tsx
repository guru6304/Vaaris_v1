import React from 'react';
import {
  Bot,
  PlayCircle,
  Menu,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentRoute,
    navigate,
    emergencyCase,
    isVaarisGuideOpen,
    setIsVaarisGuideOpen,
    openModal
  } = useApp();

  const isRespondJourney = currentRoute === 'emergency' || currentRoute === 'claim-detail' || currentRoute === 'professionals';

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Mobile Menu Toggle & Brand for Small Screens */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span className="font-extrabold text-lg text-white font-['Outfit']">VAARIS</span>
        </button>
      </div>

      {/* Desktop Mode / Journey State Badge */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center bg-slate-900/90 rounded-full p-1 border border-slate-800">
          <button
            onClick={() => navigate('dashboard')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              !isRespondJourney
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Family Prepare
          </button>
          <button
            onClick={() => navigate('emergency')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRespondJourney
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Crisis Respond ({emergencyCase.deceasedName})
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden md:inline-block">|</span>

        <span className="text-xs text-slate-400 hidden md:inline-flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          Demo Mode: <strong className="text-slate-300 font-medium">Interactive Investor Prototype</strong>
        </span>
      </div>

      {/* Right Action Controls: Investor Tour & VAARIS Guide */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 5-Min Guided Investor Tour Button */}
        <button
          onClick={() => openModal('investorTour')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="hidden sm:inline">5-Min Investor Tour</span>
          <span className="sm:hidden">Tour</span>
        </button>

        {/* VAARIS Guide Contextual Copilot */}
        <button
          onClick={() => setIsVaarisGuideOpen(!isVaarisGuideOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isVaarisGuideOpen
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/30'
              : 'bg-slate-900/90 text-teal-300 border-teal-500/30 hover:bg-teal-950/40 hover:border-teal-500/50'
          }`}
        >
          <Bot className={`w-4 h-4 ${isVaarisGuideOpen ? 'text-slate-950' : 'text-teal-400'}`} />
          <span className="hidden sm:inline">VAARIS Guide</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
        </button>
      </div>
    </header>
  );
};
