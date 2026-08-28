import React from 'react';
import {
  ArrowLeft,
  Bot,
  Briefcase,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ClaimDetailPage: React.FC = () => {
  const {
    claims,
    selectedClaimId,
    completeClaimStep,
    navigate,
    professionals,
    openModal,
    setSelectedProfessionalId,
    emergencyCase
  } = useApp();

  const claim = claims.find((c) => c.id === selectedClaimId) || claims[0];
  const assignedPro = professionals.find((p) => p.id === claim?.assignedProfessionalId) || professionals[0];

  if (!claim) return null;

  const handleStepComplete = (stepId: string) => {
    completeClaimStep(claim.id, stepId);
  };

  const handleConnectPro = () => {
    setSelectedProfessionalId(assignedPro.id);
    openModal('contactPro');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back Button & Top Meta */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('emergency')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Emergency Case Dashboard</span>
        </button>

        <span className="text-xs text-slate-400">
          Case: <strong className="text-slate-200">{emergencyCase.deceasedName} Estate Claims</strong>
        </span>
      </div>

      {/* Claim Summary Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {claim.institution}
              </span>
              <StatusBadge status={claim.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              {claim.assetName}
            </h1>
            <p className="text-xs text-slate-400">
              Claimant: <strong className="text-slate-200">{claim.claimantName}</strong>
            </p>
          </div>

          <div className="sm:text-right bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              {claim.isInsurance ? 'Estimated Sum Assured' : 'Estimated Asset Sum'}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono">
              ₹{(claim.estimatedAmount / 100000).toFixed(2)} Lakhs
            </div>
            <span className="text-[10px] text-slate-500">
              {claim.isInsurance ? 'Term Death Benefit' : 'Institutional Settlement'}
            </span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Claim Resolution Progress</span>
            <span className="font-bold text-teal-400 font-mono">{claim.progressPercentage}% Complete</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${claim.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Step Checklist vs AI Guidance & Assigned CA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step-by-Step Workflow Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Institutional Claim Stages ({claim.steps.length} Steps)
            </h2>
            <span className="text-xs text-slate-400">Stage-by-Stage Verification</span>
          </div>

          <div className="space-y-3">
            {claim.steps.map((step) => {
              const isDone = step.status === 'Complete';
              const isAction = step.status === 'Action Required';

              return (
                <div
                  key={step.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isAction
                      ? 'bg-slate-900/95 border-amber-500/60 ring-1 ring-amber-500/30'
                      : isDone
                      ? 'bg-slate-900/70 border-slate-800/80'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isAction
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : step.stepNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{step.title}</h4>
                          <StatusBadge status={step.status} size="sm" />
                        </div>
                        {step.requiredDocument && (
                          <p className="text-xs text-slate-400 mt-1">
                            Document: <span className="text-slate-300 font-medium">{step.requiredDocument}</span>
                          </p>
                        )}
                        {step.notes && (
                          <p className="text-[11px] text-slate-400/90 mt-1 italic">{step.notes}</p>
                        )}
                      </div>
                    </div>

                    {!isDone && (
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Guidance Panel & Assigned Professional (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Missing Document Notice or General Next Step Panel */}
          {claim.missingDocumentNotice ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>VAARIS Guide • Next Step Guidance</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/60">
                  AI Action Alert
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Additional documentation required for institutional release.
                </h3>
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <p className="text-slate-400">
                    Missing Document:{' '}
                    <strong className="text-amber-300">
                      {claim.missingDocumentNotice.missingDocName}
                    </strong>
                  </p>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">
                    <strong className="text-slate-400">Why this matters:</strong>{' '}
                    {claim.missingDocumentNotice.whyItMatters}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConnectPro}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Consult {assignedPro.name}
                </button>
                <button
                  onClick={() => openModal('uploadDoc')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  title="Upload Document"
                >
                  <UploadCloud className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                VAARIS Guide provides informational workflow assistance and is not legal or financial advice.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-500/30 space-y-3">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                <Bot className="w-4 h-4 text-teal-400" />
                <span>Next Recommended Action</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Next Step:</strong> {claim.nextStep}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => openModal('uploadDoc')}
                  className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Upload Supporting Document
                </button>
              </div>
            </div>
          )}

          {/* Assigned Professional Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Case Professional
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                Case Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{assignedPro.name}</h4>
                <p className="text-xs text-slate-400">{assignedPro.role} • {assignedPro.firm}</p>
                <p className="text-[11px] text-teal-300 font-mono mt-0.5">{assignedPro.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleConnectPro}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Schedule Consultation
              </button>
              <button
                onClick={handleConnectPro}
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold cursor-pointer"
              >
                Send Note
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Claim Audit & Submission Timeline
            </h4>
            <div className="space-y-2.5">
              {claim.activityLog.map((log, i) => (
                <div key={i} className="text-xs space-y-0.5 border-l-2 border-slate-800 pl-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{log.author}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner type="workflow" />
    </div>
  );
};
