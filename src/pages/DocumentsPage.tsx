import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  Search,
  Bot,
  Sparkles,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const DocumentsPage: React.FC = () => {
  const { documents, openModal, setSelectedDocId } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: string; label: string; count?: number }[] = [
    { key: 'all', label: 'All Vault Documents', count: documents.length },
    { key: 'Identity Documents', label: 'Identity Documents' },
    { key: 'Financial Documents', label: 'Financial Statements' },
    { key: 'Insurance', label: 'Insurance Policies' },
    { key: 'Property', label: 'Property & Deeds' },
    { key: 'Legal Documents', label: 'Legal & Wills' }
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.linkedAssetName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  const handleOpenPreview = (docId: string) => {
    setSelectedDocId(docId);
    openModal('docPreview');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Document Vault & AI Extraction
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {documents.length} Files Encrypted
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized encrypted repository with automated AI attribute recognition and asset linking.
          </p>
        </div>

        <button
          onClick={() => openModal('uploadDoc')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* AI Extraction Highlight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI-Assisted Document Extraction Active</h3>
              <span className="text-[10px] font-bold bg-teal-950 text-teal-300 px-2 py-0.2 rounded-full border border-teal-800">
                Automated
              </span>
            </div>
            <p className="text-xs text-slate-300/80 mt-1 leading-relaxed max-w-xl">
              VAARIS automatically reads policy terms, sum assured limits, and registered nominee names to keep your readiness score updated without manual re-typing.
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('uploadDoc')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
        >
          Simulate Document Ingestion &rarr;
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by filename or linked asset..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <span className="text-xs text-slate-400 self-center">
            {filteredDocs.length} documents displayed
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const data = doc.extractedData;

          return (
            <div
              key={doc.id}
              onClick={() => handleOpenPreview(doc.id)}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 shadow-lg flex flex-col justify-between space-y-4 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400 border border-slate-700/60 group-hover:bg-teal-500/20 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">{doc.category}</p>
                </div>
              </div>

              {/* Extracted Metadata Card */}
              {data && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-teal-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      AI Attributes:
                    </span>
                    <span className="text-[10px] text-slate-400">{data.confidenceScore || 98}% match</span>
                  </div>

                  {data.policyNumber && (
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Number:</span>
                      <span className="font-mono text-slate-200">{data.policyNumber}</span>
                    </div>
                  )}

                  {data.nomineeName && (
                    <div className="flex justify-between text-slate-300 truncate">
                      <span className="text-slate-500">Nominee:</span>
                      <span className="text-teal-300 truncate max-w-[150px] font-medium">{data.nomineeName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {doc.uploadDate}
                </span>
                <span className="text-teal-400 group-hover:translate-x-1 transition-transform font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <DisclaimerBanner type="privacy" />
    </div>
  );
};
