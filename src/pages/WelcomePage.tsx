import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  AlertOctagon,
  Sparkles,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const WelcomePage: React.FC = () => {
  const { navigate, openModal } = useApp();

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-300">
      {/* Hero Presentation Section */}
      <div className="relative rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-[#0B132B] to-teal-950/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow backdrop decorative effect */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-bold tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>INVESTOR PROTOTYPE • FINANCIAL CONTINUITY PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-['Outfit'] leading-[1.15]">
            Protect what you've built.{' '}
            <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent block mt-1">
              Prepare the people you love.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
            VAARIS helps your family stay financially prepared —{' '}
            <span className="text-white font-medium">before</span> and{' '}
            <span className="text-white font-medium">after</span> life's unexpected events.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore My Family Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('emergency')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-amber-300 border border-amber-500/40 font-bold text-sm shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>View Emergency Demo Case</span>
            </button>

            <button
              onClick={() => openModal('investorTour')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>5-Min Investor Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Two Connected Journeys — Core Product Architecture */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">
            Two Connected Journeys. One Unified Operating System.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A continuous platform that seamlessly transitions from family readiness to post-crisis execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Journey 1: PREPARE (Before Crisis) */}
          <div
            onClick={() => navigate('dashboard')}
            className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/30 p-7 space-y-5 shadow-xl hover:border-teal-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>JOURNEY 1 • BEFORE CRISIS</span>
              </div>
              <span className="text-xs text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                Open Journey &rarr;
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                "I am alive and want to prepare my family."
              </h3>
              <p className="text-xs text-slate-300/90 mt-2 leading-relaxed">
                Empower your family with organized financial clarity, verified nominees, secure vault documents, and controlled emergency directives.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>78% Family Readiness Score</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Asset & Nominee Mapping</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>AI-Assisted Document Vault</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Controlled Emergency Tiers</span>
              </div>
            </div>
          </div>

          {/* Journey 2: RESPOND (Post-Crisis) */}
          <div
            onClick={() => navigate('emergency')}
            className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/30 p-7 space-y-5 shadow-xl hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>JOURNEY 2 • AFTER A DEATH / CRISIS</span>
              </div>
              <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                Open Case &rarr;
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                "A family member has passed away and I need help."
              </h3>
              <p className="text-xs text-slate-300/90 mt-2 leading-relaxed">
                Step-by-step guided recovery through discovery of assets, institution-wise claim checklists, missing document resolution, and CA/Lawyer coordination.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>₹42.8L Active Demo Case</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>6 Institutional Claim Trackers</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>AI Next-Step Guidance</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Assigned CA & Legal Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Core Problem & Market Opportunity */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            THE FRAGMENTATION PROBLEM
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            When a key family member dies, families face a bureaucratic maze.
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Survivors struggle to know what assets exist, who the nominees are, where certificates are filed, and which institution to contact. VAARIS bridges this multi-billion dollar continuity void.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-white">₹1.5 Lakh Cr+</div>
            <div className="text-[11px] text-slate-400 mt-1">Unclaimed financial assets in India</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-teal-400">6–18 Mos</div>
            <div className="text-[11px] text-slate-400 mt-1">Average claim settlement latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-amber-400">8+ Portals</div>
            <div className="text-[11px] text-slate-400 mt-1">Fragmented institutional touchpoints</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold text-emerald-400">1 Platform</div>
            <div className="text-[11px] text-slate-400 mt-1">Unified VAARIS Operating System</div>
          </div>
        </div>
      </div>

      {/* Trust & Safety Disclaimer */}
      <DisclaimerBanner type="workflow" />
    </div>
  );
};
