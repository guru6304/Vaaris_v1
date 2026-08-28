import React, { useState } from 'react';
import {
  UserPlus,
  Phone,
  Mail,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { FamilyMember } from '../types';
import { Drawer } from '../components/common/Drawer';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const FamilyPage: React.FC = () => {
  const { familyMembers, openModal, user } = useApp();
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              My Family & Continuity Roles
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {familyMembers.length + 1} Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Map immediate family relationships, emergency contact hierarchy, and continuity roles.
          </p>
        </div>

        <button
          onClick={() => openModal('addFamily')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Simple Visual Hierarchy / Family Tree Structure */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
            CONTINUITY DECISION HIERARCHY
          </span>
          <h3 className="text-sm font-semibold text-white">
            Primary Account & Immediate Family Tree
          </h3>
        </div>

        {/* Level 1: Primary Account Holder (Arjun Sharma) */}
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/90 via-slate-900 to-slate-900 border border-teal-500/40 shadow-xl max-w-sm w-full text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 mx-auto flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              AS
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{user.name} (You)</h4>
              <p className="text-xs text-slate-400">{user.occupation} • Age {user.age}</p>
            </div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800/60">
              Primary Account Holder & Founder
            </span>
          </div>
        </div>

        {/* Connecting Connector Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-teal-500/40" />
        </div>

        {/* Level 2: Primary Family Contact (Priya Sharma) */}
        <div className="flex justify-center">
          {familyMembers
            .filter((m) => m.isPrimaryContact)
            .map((priya) => (
              <div
                key={priya.id}
                onClick={() => setSelectedMember(priya)}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-teal-500/30 hover:border-teal-500/60 shadow-lg max-w-sm w-full text-center space-y-2 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-tr ${priya.avatarColor} mx-auto flex items-center justify-center text-white font-bold text-sm`}
                >
                  {priya.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {priya.name}
                  </h4>
                  <p className="text-xs text-slate-400">{priya.relationship} • Age {priya.age}</p>
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {priya.role}
                  </span>
                  <span className="text-[10px] text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                    Tier 1 Access
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Branching Connector Line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-slate-700" />
        </div>

        {/* Level 3: Dependents & Elders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {familyMembers
            .filter((m) => !m.isPrimaryContact)
            .map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-md flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{member.relationship} • Age {member.age}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {member.role}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Detail Slide-Over Drawer for Clicked Member */}
      <Drawer
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Family Member'}
        subtitle={`${selectedMember?.relationship} • Continuity Record`}
      >
        {selectedMember && (
          <div className="space-y-6 text-xs">
            {/* Header Profile Pill */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-tr ${selectedMember.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}
              >
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedMember.relationship} • Age {selectedMember.age}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                    {selectedMember.role}
                  </span>
                  {selectedMember.isEmergencyContact && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      Emergency Contact
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Identification
              </h4>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone:
                  </span>
                  <span className="text-white font-medium">{selectedMember.phone}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email:
                  </span>
                  <span className="text-white font-medium">{selectedMember.email}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Primary Status:
                  </span>
                  <span className="text-teal-300 font-semibold">
                    {selectedMember.isPrimaryContact ? 'Designated Primary Family Contact' : 'Registered Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Role Directives */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Continuity & Guardian Notes
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedMember.notes || 'No custom notes specified.'}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <DisclaimerBanner type="privacy" />
    </div>
  );
};
