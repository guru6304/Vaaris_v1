import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { Asset, NomineeStatus, AssetNominee } from '../../types';
import {
  Calendar,
  UserCheck,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface ReviewNomineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const ReviewNomineeModal: React.FC<ReviewNomineeModalProps> = ({
  isOpen,
  onClose,
  asset
}) => {
  const { updateNomineeStatus, familyMembers } = useApp();

  const [status, setStatus] = useState<NomineeStatus>('Verified');
  const [nomineesList, setNomineesList] = useState<AssetNominee[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (asset) {
      setStatus(asset.nomineeStatus === 'Action Required' || asset.nomineeStatus === 'Needs Review' ? 'Verified' : asset.nomineeStatus);
      if (asset.nominees && asset.nominees.length > 0) {
        setNomineesList([...asset.nominees]);
      } else {
        setNomineesList([
          {
            name: familyMembers[0]?.name || 'Priya Sharma',
            relationship: familyMembers[0]?.relationship || 'Spouse',
            sharePercentage: 100
          }
        ]);
      }
      setErrorMsg(null);
    }
  }, [asset, familyMembers]);

  if (!asset) return null;

  const totalShare = nomineesList.reduce((sum, n) => sum + (Number(n.sharePercentage) || 0), 0);
  const isValidSplit = totalShare === 100;

  const handleAddNominee = () => {
    const remaining = Math.max(0, 100 - totalShare);
    const unselectedFamily = familyMembers.find((f) => !nomineesList.some((n) => n.name === f.name));
    setNomineesList((prev) => [
      ...prev,
      {
        name: unselectedFamily?.name || 'Aarav Sharma',
        relationship: unselectedFamily?.relationship || 'Child',
        sharePercentage: remaining > 0 ? remaining : 0
      }
    ]);
  };

  const handleRemoveNominee = (index: number) => {
    if (nomineesList.length === 1) return;
    setNomineesList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleNomineeChange = (index: number, field: keyof AssetNominee, value: string | number) => {
    setNomineesList((prev) =>
      prev.map((nom, idx) => {
        if (idx !== index) return nom;
        if (field === 'name') {
          const matchedFam = familyMembers.find((f) => f.name === value);
          return {
            ...nom,
            name: value as string,
            relationship: matchedFam ? matchedFam.relationship : nom.relationship
          };
        }
        return { ...nom, [field]: value };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSplit && status === 'Verified') {
      setErrorMsg(`Total nominee share must equal exactly 100% (currently ${totalShare}%).`);
      return;
    }

    updateNomineeStatus(asset.id, status, nomineesList);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Nominee Allocation & Status"
      subtitle={`${asset.name} • ${asset.institution}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Prominent Legal Clarity Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-start gap-2.5 text-slate-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11.5px]">
            <strong className="text-amber-300">Legal Clarity:</strong> Nominee information identifies the registered beneficiary for institutional settlement. Legal estate inheritance is governed by applicable succession law and wills.
          </p>
        </div>

        {/* Verification Status Selector */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Institutional Verification Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Verified', 'Needs Review', 'Action Required'] as NomineeStatus[]).map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setStatus(st)}
                className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                  status === st
                    ? st === 'Verified'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 ring-1 ring-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Nominee Allocation Rows */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Beneficiary Nominee Split ({nomineesList.length})</span>
            </label>

            <button
              type="button"
              onClick={handleAddNominee}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Nominee</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {nomineesList.map((nom, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Nominee #{idx + 1}
                  </span>
                  {nomineesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNominee(idx)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                      title="Remove nominee"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      required
                      value={nom.name}
                      onChange={(e) => handleNomineeChange(idx, 'name', e.target.value)}
                      placeholder="Nominee Full Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      value={nom.relationship}
                      onChange={(e) => handleNomineeChange(idx, 'relationship', e.target.value)}
                      placeholder="Relationship (e.g. Spouse)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={nom.sharePercentage}
                      onChange={(e) => handleNomineeChange(idx, 'sharePercentage', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-teal-300 font-mono font-bold text-right"
                    />
                    <span className="text-slate-400 font-semibold text-xs">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Share Validation Indicator */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Share Allocation:</span>
            <div className="flex items-center gap-1.5">
              {isValidSplit ? (
                <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% (Valid)
                </span>
              ) : (
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {totalShare}% (Must equal 100%)
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <p className="text-rose-400 text-xs font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Last Verified: {asset.lastReviewedDate}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              Save & Verify Nominee
            </button>
          </div>
        </div>

        <DisclaimerBanner type="legal" />
      </form>
    </Modal>
  );
};
