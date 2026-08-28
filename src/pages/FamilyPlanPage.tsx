import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  CheckCircle2,
  HelpCircle,
  Edit
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const FamilyPlanPage: React.FC = () => {
  const {
    familyPlan,
    familyMembers,
    addFamilyInstruction,
    updateFamilyResponsibility,
    updateEmergencyContact,
    navigate
  } = useApp();

  const [newInstTitle, setNewInstTitle] = useState('');
  const [newInstText, setNewInstText] = useState('');
  const [newInstPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [showAddForm, setShowAddForm] = useState(false);

  const [editingResponsibility, setEditingResponsibility] = useState<keyof typeof familyPlan.responsibilities | null>(null);
  const [editingContactTier, setEditingContactTier] = useState<'primary' | 'secondary' | null>(null);

  const handleCreateInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstTitle || !newInstText) return;
    addFamilyInstruction(newInstTitle, newInstText, newInstPriority, familyMembers[0]?.name || 'Priya Sharma');
    setNewInstTitle('');
    setNewInstText('');
    setShowAddForm(false);
  };

  const handleSelectResponsibility = (field: keyof typeof familyPlan.responsibilities, personName: string) => {
    updateFamilyResponsibility(field, personName);
    setEditingResponsibility(null);
  };

  const handleSelectContact = (tier: 'primary' | 'secondary', memberName: string) => {
    const member = familyMembers.find((m) => m.name === memberName);
    if (member) {
      updateEmergencyContact(tier, member.name, `${member.relationship} • ${member.role}`, member.phone);
    }
    setEditingContactTier(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Flagship Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              My Family Continuity Plan
            </h1>
            <span className="text-xs bg-teal-950/80 text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {familyPlan.completionPercentage}% Complete
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            If something happens to you, your family will know what to do next.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Instruction</span>
          </button>
        </div>
      </div>

      {/* Completion Meter Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>Family Continuity Protocol Status</span>
          </div>
          <span className="text-sm font-extrabold text-white">{familyPlan.completionPercentage}% Ready</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${familyPlan.completionPercentage}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          6 essential continuity dimensions established: Emergency Contacts, Immediate Financial Liquidity, Recorded Intent, Strategic Directives, Advisory Network, and Controlled Access Tiers.
        </p>
      </div>

      {/* SECTION 1: EMERGENCY CONTACTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
              1
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Emergency Contacts & Immediate Chain</h2>
          </div>
          <span className="text-[10px] text-slate-500">Click card to change designated contact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Contact */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Primary Family Contact
              </span>
              <button
                onClick={() => setEditingContactTier(editingContactTier === 'primary' ? null : 'primary')}
                className="text-xs text-slate-400 hover:text-teal-300 p-1 cursor-pointer"
                title="Change contact"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white mt-1">{familyPlan.emergencyContacts.primary.name}</h3>
            <p className="text-xs text-slate-400">{familyPlan.emergencyContacts.primary.role}</p>
            <p className="text-xs text-slate-300 font-mono pt-2">{familyPlan.emergencyContacts.primary.phone}</p>

            {/* Quick Picker Dropdown */}
            {editingContactTier === 'primary' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Select Member:</span>
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectContact('primary', m.name)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-teal-950/60 text-xs text-slate-200 flex justify-between cursor-pointer"
                  >
                    <span>{m.name}</span>
                    <span className="text-slate-400">{m.relationship}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Contact */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Secondary Family Contact
              </span>
              <button
                onClick={() => setEditingContactTier(editingContactTier === 'secondary' ? null : 'secondary')}
                className="text-xs text-slate-400 hover:text-teal-300 p-1 cursor-pointer"
                title="Change contact"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white mt-1">{familyPlan.emergencyContacts.secondary.name}</h3>
            <p className="text-xs text-slate-400">{familyPlan.emergencyContacts.secondary.role}</p>
            <p className="text-xs text-slate-300 font-mono pt-2">{familyPlan.emergencyContacts.secondary.phone}</p>

            {editingContactTier === 'secondary' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Select Member:</span>
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectContact('secondary', m.name)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-teal-950/60 text-xs text-slate-200 flex justify-between cursor-pointer"
                  >
                    <span>{m.name}</span>
                    <span className="text-slate-400">{m.relationship}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assigned CA */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
              Assigned CA
            </span>
            <h3 className="text-base font-bold text-white mt-1">{familyPlan.emergencyContacts.ca.name}</h3>
            <p className="text-xs text-slate-400">{familyPlan.emergencyContacts.ca.firm}</p>
            <p className="text-xs text-slate-300 font-mono pt-2">{familyPlan.emergencyContacts.ca.phone}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: FINANCIAL RESPONSIBILITIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
              2
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Designated Financial Responsibilities</h2>
          </div>
          <span className="text-[10px] text-slate-500">Click to reassign responsible family leader</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Immediate Finances */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Immediate Finances</span>
              <button
                onClick={() => setEditingResponsibility(editingResponsibility === 'immediateFinances' ? null : 'immediateFinances')}
                className="text-slate-400 hover:text-teal-300 cursor-pointer"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
            <p className="text-white font-medium">{familyPlan.responsibilities.immediateFinances}</p>

            {editingResponsibility === 'immediateFinances' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectResponsibility('immediateFinances', `${m.name} (${m.relationship})`)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-200 cursor-pointer"
                  >
                    {m.name} ({m.relationship})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coordinate CA */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">CA Coordination</span>
              <button
                onClick={() => setEditingResponsibility(editingResponsibility === 'coordinateCA' ? null : 'coordinateCA')}
                className="text-slate-400 hover:text-teal-300 cursor-pointer"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
            <p className="text-white font-medium">{familyPlan.responsibilities.coordinateCA}</p>

            {editingResponsibility === 'coordinateCA' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectResponsibility('coordinateCA', `${m.name} (${m.relationship})`)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-200 cursor-pointer"
                  >
                    {m.name} ({m.relationship})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Oversee Business */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Business Continuity</span>
              <button
                onClick={() => setEditingResponsibility(editingResponsibility === 'overseeBusiness' ? null : 'overseeBusiness')}
                className="text-slate-400 hover:text-teal-300 cursor-pointer"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
            <p className="text-white font-medium">{familyPlan.responsibilities.overseeBusiness}</p>

            {editingResponsibility === 'overseeBusiness' && (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectResponsibility('overseeBusiness', `${m.name} (${m.relationship})`)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-200 cursor-pointer"
                  >
                    {m.name} ({m.relationship})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: FAMILY FINANCIAL INTENT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
              3
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Your Family Intent & Preferred Allocations</h2>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
            Family Planning Reference
          </span>
        </div>

        {/* Notice of Non-Binding Nature */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            This is your recorded family intent and planning reference. Legal distribution depends on applicable nomination, succession, estate, and other legal requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {familyPlan.financialIntents.map((intent, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400">{intent.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{intent.assetName}</h4>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Preferred Allocation:
                </span>
                {intent.preferredAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-0.5">
                    <span className="text-slate-300">{alloc.name}</span>
                    <strong className="text-teal-300 font-mono">{alloc.percentage}%</strong>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
                "{intent.notes}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: IMPORTANT INSTRUCTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
              4
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Key Strategic Instructions ({familyPlan.instructions.length})</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
          >
            + Add Instruction
          </button>
        </div>

        {/* Dynamic Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateInstruction}
            className="p-5 rounded-2xl bg-slate-900 border border-teal-500/40 space-y-3 text-xs animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Add New Continuity Directive</h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instruction Title *</label>
              <input
                type="text"
                required
                value={newInstTitle}
                onChange={(e) => setNewInstTitle(e.target.value)}
                placeholder="e.g. Business Bank Mandate Guidance"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Directive *</label>
              <textarea
                required
                rows={2}
                value={newInstText}
                onChange={(e) => setNewInstText(e.target.value)}
                placeholder="Specific guidance for family members in your absence..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Save Directive
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyPlan.instructions.map((inst) => (
            <div key={inst.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{inst.title}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    inst.priority === 'High'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {inst.priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed">{inst.text}</p>
              <p className="text-[10px] text-slate-500 pt-1">
                Target: <strong className="text-slate-400">{inst.targetContact}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: PROFESSIONAL NETWORK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
              5
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Connected Professional Network</h2>
          </div>
          <button
            onClick={() => navigate('professionals')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
          >
            Manage Network &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-teal-400 uppercase">Chartered Accountant</span>
            <p className="text-white font-bold mt-1">Rahul Mehta, FCA</p>
            <p className="text-[11px] text-slate-400">Mehta & Associates</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Legal Counsel</span>
            <p className="text-white font-bold mt-1">Advocate Sunita Rao</p>
            <p className="text-[11px] text-slate-400">Rao Chambers</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-sky-400 uppercase">Wealth Advisor</span>
            <p className="text-white font-bold mt-1">Amit Verma, CFP</p>
            <p className="text-[11px] text-slate-400">Apex Wealth</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-purple-400 uppercase">Insurance Specialist</span>
            <p className="text-white font-bold mt-1">Preeti Nair</p>
            <p className="text-[11px] text-slate-400">ShieldCare</p>
          </div>
        </div>
      </div>

      {/* SECTION 6: EMERGENCY ACCESS PLAN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-bold">
            6
          </span>
          <h2 className="text-base font-bold text-white tracking-wide">Emergency Access Tiers & Privacy Controls</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {familyPlan.emergencyAccessTiers.map((tier, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{tier.contactName}</h4>
                  <span className="text-[10px] text-slate-400">{tier.relationship}</span>
                </div>
                <p className="text-[11px] text-teal-400 font-semibold mt-0.5">{tier.accessLevel}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Authorized Permissions:
                </span>
                {tier.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 italic">
                <Lock className="w-3 h-3 inline mr-1 text-slate-500" />
                {tier.restrictionNotice}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerBanner type="privacy" />
    </div>
  );
};
