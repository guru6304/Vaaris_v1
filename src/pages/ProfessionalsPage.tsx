import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ProfessionalsPage: React.FC = () => {
  const { professionals, openModal, setSelectedProfessionalId } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPros = professionals.filter((pro) => {
    const matchesRole = roleFilter === 'all' || pro.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesSearch =
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleConnect = (proId: string) => {
    setSelectedProfessionalId(proId);
    openModal('contactPro');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Professional Continuity Network
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {professionals.length} Verified Advisors
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect verified Chartered Accountants, Estate Lawyers, and Wealth Advisors directly to family cases.
          </p>
        </div>
      </div>

      {/* Network Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'Chartered Accountant', 'Legal', 'Wealth', 'Insurance'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role === 'all' ? 'All Professionals' : role}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by advisor name, firm, or specialization..."
          className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors w-full sm:w-64"
        />
      </div>

      {/* Professionals Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPros.map((pro) => (
          <div
            key={pro.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 shadow-xl flex flex-col justify-between space-y-5 transition-all group"
          >
            {/* Header with Avatar and Role */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-extrabold text-base shadow-inner">
                    {pro.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        {pro.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.2 rounded-full border border-emerald-800/60">
                        ⭐ {pro.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{pro.role}</p>
                    <p className="text-[11px] text-teal-400/90 font-medium">{pro.firm}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    pro.status === 'Active'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {pro.status === 'Active' ? 'Case Linked' : 'Available'}
                </span>
              </div>

              {/* Specialization */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Domain Specialization:
                </span>
                <p className="mt-0.5 leading-relaxed">{pro.specialization}</p>
              </div>

              {pro.assignedCaseName && (
                <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    Assigned: <strong>{pro.assignedCaseName}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleConnect(pro.id)}
                className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Consultation</span>
              </button>
              <button
                onClick={() => handleConnect(pro.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <DisclaimerBanner type="workflow" />
    </div>
  );
};
