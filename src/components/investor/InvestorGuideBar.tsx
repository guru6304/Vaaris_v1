import React from 'react';
import {
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { RouteType } from '../../types';

interface TourStep {
  step: number;
  title: string;
  route: RouteType;
  narrative: string;
  focusHighlight: string;
}

const INVESTOR_TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: '1. Problem & Product Vision',
    route: 'welcome',
    narrative: 'When a key family member dies, financial information is fragmented across banks, insurers, and portals. VAARIS unites the journey before and after a crisis.',
    focusHighlight: 'The Two Journeys: PREPARE vs. RESPOND'
  },
  {
    step: 2,
    title: '2. The 78% Readiness Score',
    route: 'dashboard',
    narrative: 'Arjun sees his family readiness score at 78% with clear actionable priorities instead of abstract financial metrics.',
    focusHighlight: 'Interactive Readiness Gauge & Action Required list'
  },
  {
    step: 3,
    title: '3. Asset Inventory & Insurance Distinction',
    route: 'assets',
    narrative: 'Assets are organized into 9 categories. Crucially, ₹25L life insurance is kept strictly separate from ₹48.5L actual asset net worth.',
    focusHighlight: 'Categorized Asset Table & Multi-Step Add Asset flow'
  },
  {
    step: 4,
    title: '4. Nominee Readiness vs. Legal Ownership',
    route: 'nominees',
    narrative: 'Demonstrates the crucial distinction between institutional nominee designation and actual legal estate inheritance.',
    focusHighlight: 'Nominee verification and status updater'
  },
  {
    step: 5,
    title: '5. AI-Assisted Document Vault',
    route: 'documents',
    narrative: 'When certificates or policies are uploaded, AI automatically extracts policy numbers, nominees, and sums assured and links them to assets.',
    focusHighlight: 'Document extraction metadata and simulated upload'
  },
  {
    step: 6,
    title: '6. Family Continuity Plan & Access Tiers',
    route: 'family-plan',
    narrative: 'The flagship plan provides emergency contacts, designated financial responsibilities, family intent, and tiered emergency access.',
    focusHighlight: '6 Plan Sections with Controlled Access Tiers'
  },
  {
    step: 7,
    title: '7. Crisis Response (Ramesh Sharma Case)',
    route: 'emergency',
    narrative: 'The second journey: A family member passes away. VAARIS guides the family through ₹42.8L in assets, 6 potential claims, and a 5-milestone timeline.',
    focusHighlight: '5-Stage Milestone Timeline & Institutional Claim Cards'
  },
  {
    step: 8,
    title: '8. LIC Life Insurance Claim Deep Dive',
    route: 'claim-detail',
    narrative: 'Step-by-step 5-stage institutional claim workflow with AI Next-Step detection for missing Tahsildar legal heir certificates and assigned CA.',
    focusHighlight: 'Step 1–5 Checklist, AI Guidance & Assigned CA'
  }
];

export const InvestorGuideBar: React.FC = () => {
  const {
    activeModal,
    closeModal,
    navigate,
    activeInvestorStep,
    setActiveInvestorStep
  } = useApp();

  if (activeModal !== 'investorTour') return null;

  const currentTour = INVESTOR_TOUR_STEPS.find((s) => s.step === activeInvestorStep) || INVESTOR_TOUR_STEPS[0];
  const isLast = activeInvestorStep === INVESTOR_TOUR_STEPS.length;

  const goToStep = (stepNum: number) => {
    setActiveInvestorStep(stepNum);
    const target = INVESTOR_TOUR_STEPS.find((s) => s.step === stepNum);
    if (target) {
      navigate(target.route);
    }
  };

  const handleNext = () => {
    if (activeInvestorStep < INVESTOR_TOUR_STEPS.length) {
      goToStep(activeInvestorStep + 1);
    } else {
      closeModal();
    }
  };

  const handlePrev = () => {
    if (activeInvestorStep > 1) {
      goToStep(activeInvestorStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-amber-500/40 rounded-2xl shadow-2xl p-6 relative flex flex-col gap-5 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit'] tracking-wide">
                VAARIS — 5-Minute Investor Demo Journey
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                Step {activeInvestorStep} of {INVESTOR_TOUR_STEPS.length}: {currentTour.title}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
          >
            Exit Tour
          </button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-8 gap-1.5">
          {INVESTOR_TOUR_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => goToStep(s.step)}
              className={`h-2 rounded-full transition-all ${
                s.step === activeInvestorStep
                  ? 'bg-amber-400 ring-2 ring-amber-400/40'
                  : s.step < activeInvestorStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Pitch Talking Point:
            </span>
            <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-300 border border-slate-700">
              Route: /{currentTour.route}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {currentTour.narrative}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-teal-300 font-medium">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Demonstrate: {currentTour.focusHighlight}</span>
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrev}
            disabled={activeInvestorStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-400">
            {activeInvestorStep} / {INVESTOR_TOUR_STEPS.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>{isLast ? 'Complete Demo Pitch' : 'Next Step'}</span>
            {isLast ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
