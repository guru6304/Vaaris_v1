import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CONTEXTUAL_AI_GUIDE } from '../../data/aiGuideData';
import type { RouteType } from '../../types';

export const VaarisGuide: React.FC = () => {
  const {
    isVaarisGuideOpen,
    setIsVaarisGuideOpen,
    currentRoute,
    navigate,
    readinessScore
  } = useApp();

  const [customQuestion, setCustomQuestion] = useState('');
  const [activeTabAnswer, setActiveTabAnswer] = useState<{
    question: string;
    response: string;
    actionCta?: string;
    actionRoute?: RouteType;
  } | null>(null);

  if (!isVaarisGuideOpen) return null;

  const currentQuestions = CONTEXTUAL_AI_GUIDE[currentRoute] || CONTEXTUAL_AI_GUIDE.dashboard;

  const handleSelectPrompt = (promptItem: typeof currentQuestions[0]) => {
    setActiveTabAnswer(promptItem);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    // Smart contextual fallback matching
    const qLower = customQuestion.toLowerCase();
    let matchedResponse = `Based on your current ${currentRoute} workflow, VAARIS recommends verifying primary nominee allocations and ensuring all supporting certificates are registered.`;
    let targetRoute: RouteType | undefined = undefined;
    let targetCta: string | undefined = undefined;

    if (qLower.includes('nominee') || qLower.includes('epf') || qLower.includes('fd')) {
      matchedResponse = 'Nominee details for your EPFO and HDFC FD accounts require verification. Verifying them now will raise your Family Readiness Score by +8 points.';
      targetRoute = 'nominees';
      targetCta = 'Fix Nominee Records';
    } else if (qLower.includes('claim') || qLower.includes('lic') || qLower.includes('death')) {
      matchedResponse = 'For the Ramesh Sharma active case, the LIC Life Insurance claim is missing Tahsildar Legal Heir documentation. CA Rahul Mehta is assigned to assist.';
      targetRoute = 'claim-detail';
      targetCta = 'Open LIC Claim Case';
    } else if (qLower.includes('document') || qLower.includes('vault') || qLower.includes('upload')) {
      matchedResponse = 'Your vault currently has 7 protected documents. Uploading the latest Property Encumbrance Certificate will complete your real estate continuity record.';
      targetRoute = 'documents';
      targetCta = 'Upload Property Document';
    } else if (qLower.includes('score') || qLower.includes('readiness')) {
      matchedResponse = `Your Family Readiness Score is currently at ${readinessScore}%. Resolving the 3 pending action items will raise it to 94%.`;
      targetRoute = 'readiness';
      targetCta = 'View Readiness Checklist';
    }

    setActiveTabAnswer({
      question: customQuestion,
      response: matchedResponse,
      actionCta: targetCta,
      actionRoute: targetRoute
    });
    setCustomQuestion('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[92vw] sm:w-96 rounded-2xl border border-teal-500/30 bg-[#0F172A]/95 shadow-2xl backdrop-blur-xl flex flex-col max-h-[82vh] transition-all animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-teal-950/40 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">VAARIS Guide</h3>
              <span className="text-[9px] font-semibold bg-teal-950 text-teal-300 px-1.5 py-0.2 rounded border border-teal-800/60">
                Contextual AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 capitalize">
              Assisting on {currentRoute.replace('-', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVaarisGuideOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Area */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Active Response Display */}
        {activeTabAnswer ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-800/80 p-3 text-slate-200 border border-slate-700/60">
              <p className="font-semibold text-teal-300 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {activeTabAnswer.question}
              </p>
              <p className="text-slate-300 leading-relaxed text-[11.5px] mt-2">
                {activeTabAnswer.response}
              </p>
              {activeTabAnswer.actionCta && activeTabAnswer.actionRoute && (
                <button
                  onClick={() => {
                    navigate(activeTabAnswer.actionRoute!);
                    setIsVaarisGuideOpen(false);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <span>{activeTabAnswer.actionCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveTabAnswer(null)}
              className="text-[11px] text-slate-400 hover:text-teal-300 underline block text-center w-full"
            >
              &larr; Ask another question
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested for this screen:</span>
            </div>
            <div className="space-y-2">
              {currentQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectPrompt(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 hover:border-teal-500/40 border border-slate-700/50 text-slate-200 transition-all text-[11px] leading-snug flex items-center justify-between group"
                >
                  <span className="flex-1 pr-2">{q.question}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Legal Trust Notice */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>
            VAARIS Guide provides informational workflow assistance and is not legal or financial advice.
          </span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCustomSubmit} className="p-3 border-t border-slate-800 bg-slate-900/90 rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask about assets, claims, nominees..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            type="submit"
            aria-label="Send question"
            className="absolute right-1.5 p-1.5 rounded-lg text-teal-400 hover:text-white hover:bg-teal-600/30 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
