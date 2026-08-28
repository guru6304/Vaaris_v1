import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { VaultDocument } from '../../types';
import {
  Trash2,
  Download,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: VaultDocument | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document
}) => {
  const { archiveDocument, showToast } = useApp();
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);

  if (!document) return null;

  const data = document.extractedData;

  const handleArchive = () => {
    archiveDocument(document.id);
    setShowConfirmArchive(false);
    onClose();
  };

  const handleDownload = () => {
    showToast('Download Initiated', `Downloading encrypted copy of ${document.name}...`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.name}
      subtitle={`${document.category} • Secured in Vault`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Status and Encryption Header */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-slate-300 font-medium">Encrypted Vault Storage</span>
          </div>
          <StatusBadge status={document.status} size="sm" />
        </div>

        {/* AI Extracted Attributes Panel */}
        {data && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-teal-300 font-bold flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated AI Document Parser Metadata</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Confidence: {data.confidenceScore || 98}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11.5px] pt-1">
              {data.policyNumber && (
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Policy / Folio No</span>
                  <span className="font-mono text-white font-semibold">{data.policyNumber}</span>
                </div>
              )}
              {data.nomineeName && (
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Registered Nominee</span>
                  <span className="text-teal-300 font-semibold">{data.nomineeName}</span>
                </div>
              )}
              {data.coverageAmount && (
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Sum Assured</span>
                  <span className="text-sky-300 font-semibold">{data.coverageAmount}</span>
                </div>
              )}
              {data.institutionProvider && (
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Issuing Institution</span>
                  <span className="text-slate-200 font-medium">{data.institutionProvider}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simulated Document Viewer Canvas */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
          <div className="w-16 h-20 bg-slate-900 border border-slate-700 rounded-lg mx-auto flex flex-col items-center justify-center p-2 shadow-inner">
            <div className="w-8 h-1 bg-slate-700 rounded-full mb-1" />
            <div className="w-10 h-1 bg-slate-700 rounded-full mb-1" />
            <div className="w-6 h-1 bg-slate-700 rounded-full" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white text-xs">{document.name}</h4>
            <p className="text-[11px] text-slate-400">
              Linked Asset:{' '}
              <strong className="text-slate-300">{document.linkedAssetName || 'General Vault'}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Copy</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Opening Viewer', 'Simulated encrypted viewer launched.', 'info')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>

        {/* Archival Confirmation Banner */}
        {showConfirmArchive && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 space-y-2 text-rose-200">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Archive this document from the vault?</span>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-relaxed">
              This document will be removed and readiness scores will update accordingly.
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
              <span>Archive Document</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};
