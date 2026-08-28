import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  HeartCrack,
  HelpCircle
} from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface StartEmergencyCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartEmergencyCaseModal: React.FC<StartEmergencyCaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { startNewEmergencyCase, familyMembers, assets } = useApp();

  const [deceasedName, setDeceasedName] = useState(familyMembers[3]?.name || 'Suresh Sharma');
  const [relationship, setRelationship] = useState(familyMembers[3]?.relationship || 'Father');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(['ast-1', 'ast-2', 'ast-4']);

  const handleToggleAsset = (id: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    startNewEmergencyCase(deceasedName, relationship, selectedAssetIds);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Guided Emergency Case"
      subtitle="Initialize post-crisis claim workflow and asset recovery timeline"
      maxWidth="xl"
    >
      <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
        {/* Empathy Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start gap-2.5">
          <HeartCrack className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11.5px]">
            VAARIS will create a dedicated 5-stage case timeline, identify missing legal heir documents, and organize claim checklists for the institutions involved.
          </p>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Deceased Family Member Name *
          </label>
          <input
            type="text"
            required
            value={deceasedName}
            onChange={(e) => setDeceasedName(e.target.value)}
            placeholder="e.g. Ramesh Sharma"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Relationship to Primary Account Holder
          </label>
          <input
            type="text"
            required
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g. Father / Spouse / Mother"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
          />
        </div>

        {/* Relevant Assets to Map */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold flex items-center gap-1">
              <span>Known Assets to Include in Recovery ({selectedAssetIds.length})</span>
            </label>
            <span className="text-[10px] text-slate-500">Auto-mapped from inventory</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {assets.map((ast) => {
              const isSelected = selectedAssetIds.includes(ast.id);
              return (
                <div
                  key={ast.id}
                  onClick={() => handleToggleAsset(ast.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-700'
                      }`}
                    >
                      {isSelected && '✓'}
                    </span>
                    <span className="text-xs font-medium text-white">{ast.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {ast.isInsurance
                      ? `₹${((ast.insuranceCoverage || 0) / 100000).toFixed(1)}L Cover`
                      : `₹${(Math.abs(ast.value) / 100000).toFixed(1)}L`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Simulated post-crisis recovery workflow
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Initialize Case</span>
            </button>
          </div>
        </div>

        <DisclaimerBanner type="workflow" />
      </form>
    </Modal>
  );
};
