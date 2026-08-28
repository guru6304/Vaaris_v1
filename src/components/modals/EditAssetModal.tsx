import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { Asset, AssetCategory } from '../../types';
import {
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  asset
}) => {
  const { updateAsset, archiveAsset } = useApp();

  const [prevAssetId, setPrevAssetId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);

  if (asset && asset.id !== prevAssetId) {
    setPrevAssetId(asset.id);
    setFormData({
      name: asset.name,
      category: asset.category,
      institution: asset.institution,
      accountNumberMasked: asset.accountNumberMasked,
      value: asset.value,
      insuranceCoverage: asset.insuranceCoverage || 0,
      notes: asset.notes || '',
      source: asset.source,
    });
    setShowConfirmArchive(false);
  }

  if (!asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAsset(asset.id, formData);
    onClose();
  };

  const handleArchive = () => {
    archiveAsset(asset.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Asset Details"
      subtitle={`Modifying ${asset.name} (${asset.institution})`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Asset Display Name *</label>
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Asset Category</label>
            <select
              value={formData.category || 'bank_accounts'}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as AssetCategory }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="bank_accounts">Bank Savings / Current</option>
              <option value="fixed_deposits">Fixed & Recurring Deposits</option>
              <option value="mutual_funds">Mutual Funds & SIPs</option>
              <option value="insurance">Life / Term Insurance</option>
              <option value="epf_retirement">EPF, PPF & NPS</option>
              <option value="stocks_investments">Demat & Equity Shares</option>
              <option value="property">Real Estate & Property</option>
              <option value="gold_other">Physical & Digital Gold</option>
              <option value="loans_liabilities">Loans & Liabilities</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Financial Institution</label>
            <input
              type="text"
              required
              value={formData.institution || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Masked Account / Folio #</label>
            <input
              type="text"
              required
              value={formData.accountNumberMasked || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountNumberMasked: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {asset.isInsurance ? 'Insurance Sum Assured (₹)' : 'Current Balance / Valuation (₹)'}
            </label>
            <input
              type="number"
              required
              value={asset.isInsurance ? formData.insuranceCoverage || 0 : formData.value || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (asset.isInsurance) {
                  setFormData((prev) => ({ ...prev, insuranceCoverage: val }));
                } else {
                  setFormData((prev) => ({ ...prev, value: val }));
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Notes & Locational Details</label>
          <textarea
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Branch location, locker details, or guidance for family..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
          />
        </div>

        {/* Confirmation Banner for Archival */}
        {showConfirmArchive && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 space-y-2 text-rose-200">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Archive this asset from active inventory?</span>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-relaxed">
              This asset will be removed and related readiness scores and net worth calculations will immediately recalculate.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleArchive}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Archival
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmArchive(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {!showConfirmArchive ? (
            <button
              type="button"
              onClick={() => setShowConfirmArchive(true)}
              className="text-rose-400 hover:text-rose-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Archive Asset</span>
            </button>
          ) : <div />}

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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
