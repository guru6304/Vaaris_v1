import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { DocumentCategory } from '../../types';
import {
  UploadCloud,
  FileCheck,
  Bot,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose }) => {
  const { uploadDocument, assets } = useApp();

  const [documentName, setDocumentName] = useState('Form 15 Encumbrance Certificate — Koramangala.pdf');
  const [category, setCategory] = useState<DocumentCategory>('Property');
  const [linkedAssetId, setLinkedAssetId] = useState('ast-6');
  const [uploadStage, setUploadStage] = useState<'idle' | 'received' | 'analyzing' | 'complete'>('idle');

  const categories: DocumentCategory[] = [
    'Identity Documents',
    'Financial Documents',
    'Insurance',
    'Property',
    'Legal Documents',
    'Business Documents',
    'Other'
  ];

  const handleStartUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName) return;

    // Stage 1: Document received
    setUploadStage('received');

    // Stage 2: AI Analyzing
    setTimeout(() => {
      setUploadStage('analyzing');
    }, 900);

    // Stage 3: Categorized & Saved
    setTimeout(() => {
      setUploadStage('complete');

      const linkedAsset = assets.find((a) => a.id === linkedAssetId);
      uploadDocument({
        name: documentName,
        category,
        linkedAssetId: linkedAssetId || undefined,
        linkedAssetName: linkedAsset?.name,
        fileSizeBytes: 2400000
      });

      setTimeout(() => {
        setUploadStage('idle');
        onClose();
      }, 1200);
    }, 2200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (uploadStage === 'idle' || uploadStage === 'complete') onClose();
      }}
      title="Upload & AI-Categorize Document"
      subtitle="AI extracts policy numbers, nominees, and links records automatically"
      maxWidth="md"
    >
      {uploadStage === 'idle' ? (
        <form onSubmit={handleStartUpload} className="space-y-4 text-xs">
          {/* Drag & drop visual area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors">
            <UploadCloud className="w-10 h-10 text-teal-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">Choose a document or drop here</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports PDF, PNG, JPEG up to 25MB (Encrypted in Vault)
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Document File Name *</label>
            <input
              type="text"
              required
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Vault Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Link to Asset (Optional)</label>
              <select
                value={linkedAssetId}
                onChange={(e) => setLinkedAssetId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="">-- No Linked Asset --</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Upload & Extract AI Metadata
            </button>
          </div>
        </form>
      ) : (
        /* Multi-Stage AI Extraction Animation */
        <div className="py-8 px-4 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center animate-pulse">
              {uploadStage === 'received' && <FileCheck className="w-8 h-8 text-teal-400" />}
              {uploadStage === 'analyzing' && <Bot className="w-8 h-8 text-teal-300 animate-spin" />}
              {uploadStage === 'complete' && <CheckCircle2 className="w-9 h-9 text-emerald-400" />}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">
              {uploadStage === 'received' && 'Stage 1: Document Received in Secure Vault'}
              {uploadStage === 'analyzing' && 'Stage 2: AI is Organizing and Extracting Attributes...'}
              {uploadStage === 'complete' && 'Stage 3: Document Categorized & Linked Successfully!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {uploadStage === 'received' && 'Validating SHA-256 signature and encrypted storage partition.'}
              {uploadStage === 'analyzing' && 'Extracting policy numbers, nominee declarations, and verification timestamps.'}
              {uploadStage === 'complete' && 'Readiness score and asset metadata updated.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-teal-300 font-medium">
            <Loader2 className={`w-4 h-4 animate-spin ${uploadStage === 'complete' ? 'hidden' : 'inline'}`} />
            <span>Processing pipeline active...</span>
          </div>
        </div>
      )}
    </Modal>
  );
};
