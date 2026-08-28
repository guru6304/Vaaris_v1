import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { AssetCategory } from '../../types';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Briefcase,
  LineChart,
  Home,
  Coins,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const { addAsset, familyMembers } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'bank_accounts' as AssetCategory,
    institution: '',
    accountNumberMasked: '',
    value: 500000,
    isInsurance: false,
    insuranceCoverage: 0,
    nomineeName: 'Priya Sharma',
    nomineeRelationship: 'Spouse',
    nomineeShare: 100,
    notes: ''
  });

  const categories: { key: AssetCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'bank_accounts', label: 'Savings & Current Account', icon: Landmark },
    { key: 'fixed_deposits', label: 'Fixed & Recurring Deposit', icon: ShieldCheck },
    { key: 'mutual_funds', label: 'Mutual Funds & SIPs', icon: TrendingUp },
    { key: 'insurance', label: 'Life / Term Insurance', icon: HeartHandshake },
    { key: 'epf_retirement', label: 'EPF, PPF & NPS', icon: Briefcase },
    { key: 'stocks_investments', label: 'Stocks & Demat Holdings', icon: LineChart },
    { key: 'property', label: 'Real Estate & Land', icon: Home },
    { key: 'gold_other', label: 'Physical Gold & Locker', icon: Coins },
    { key: 'loans_liabilities', label: 'Loans & Mortgages', icon: CreditCard }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isIns = formData.category === 'insurance';

    addAsset({
      name: formData.name || `${formData.institution} ${categories.find((c) => c.key === formData.category)?.label}`,
      category: formData.category,
      institution: formData.institution || 'Financial Institution',
      accountNumberMasked: formData.accountNumberMasked || '•••• 5029',
      value: isIns ? 0 : Number(formData.value),
      isInsurance: isIns,
      insuranceCoverage: isIns ? Number(formData.insuranceCoverage || 5000000) : undefined,
      nomineeStatus: formData.nomineeName ? 'Verified' : 'Needs Review',
      nominees: formData.nomineeName
        ? [
            {
              name: formData.nomineeName,
              relationship: formData.nomineeRelationship,
              sharePercentage: Number(formData.nomineeShare),
              verifiedAt: 'Just now'
            }
          ]
        : [],
      source: 'User provided',
      notes: formData.notes
    });

    // Reset & close
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Financial Asset"
      subtitle={`Step ${step} of 5 — Multi-step asset cataloguing and nominee sync`}
      maxWidth="xl"
    >
      {/* Progress Dots */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
        {['Category', 'Institution', 'Valuation', 'Nominee', 'Review'].map((label, idx) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                step === idx + 1
                  ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-500/40'
                  : step > idx + 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > idx + 1 ? '✓' : idx + 1}
            </span>
            <span className={`hidden sm:inline font-medium ${step === idx + 1 ? 'text-teal-300' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
              Select Asset or Liability Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, category: cat.key, isInsurance: cat.key === 'insurance' });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-950/40 text-white shadow-xs'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Institution & Account Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Asset Name / Description *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ICICI Corporate Salary Account"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Financial Institution / Bank / Insurer *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. ICICI Bank, SBI, Max Life, Zerodha"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account / Folio / Policy Number (Masked)
              </label>
              <input
                type="text"
                value={formData.accountNumberMasked}
                onChange={(e) => setFormData({ ...formData, accountNumberMasked: e.target.value })}
                placeholder="e.g. •••• 9210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Valuation / Insurance Sum Assured */}
        {step === 3 && (
          <div className="space-y-4">
            {formData.category === 'insurance' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Life Insurance Sum Assured / Coverage (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={formData.insuranceCoverage}
                  onChange={(e) => setFormData({ ...formData, insuranceCoverage: Number(e.target.value) })}
                  placeholder="e.g. 5000000 (₹50 Lakhs)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <p className="text-[11px] text-amber-400/90 mt-1.5">
                  Notice: Insurance coverage is recorded separately from liquid asset net worth.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Approximate Asset Value / Balance (₹) *
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  placeholder="e.g. 500000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Estimated valuation for continuity planning reference.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Notes / Location Details
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Branch name, agent contact, or specific locker key instructions..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Nominee Assignment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
              <span className="font-bold text-teal-300">Nominee Synchronization:</span> Assigning a primary nominee helps automate claim checklists and updates your family readiness score.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Family Nominee
              </label>
              <select
                value={formData.nomineeName}
                onChange={(e) => {
                  const mem = familyMembers.find((m) => m.name === e.target.value);
                  setFormData({
                    ...formData,
                    nomineeName: e.target.value,
                    nomineeRelationship: mem?.relationship || 'Family'
                  });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.relationship} - {m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nominee Share Percentage (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.nomineeShare}
                onChange={(e) => setFormData({ ...formData, nomineeShare: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: Review & Confirmation */}
        {step === 5 && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Asset Summary Ready for Vault Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div>
                <span className="text-slate-400 block">Asset:</span>
                <strong className="text-white">{formData.name || 'Unnamed Asset'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Category:</span>
                <strong className="text-white capitalize">{formData.category.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Institution:</span>
                <strong className="text-white">{formData.institution || 'State Bank'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">
                  {formData.category === 'insurance' ? 'Coverage:' : 'Valuation:'}
                </span>
                <strong className="text-emerald-400">
                  {formData.category === 'insurance'
                    ? `₹${(formData.insuranceCoverage / 100000).toFixed(1)}L Sum Assured`
                    : `₹${(formData.value / 100000).toFixed(2)}L`}
                </strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Assigned Nominee:</span>
                <strong className="text-teal-300">
                  {formData.nomineeName} ({formData.nomineeShare}%) — {formData.nomineeRelationship}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-teal-500/30 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save & Synchronize Asset
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
