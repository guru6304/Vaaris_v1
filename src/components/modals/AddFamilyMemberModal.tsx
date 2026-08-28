import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { FamilyRole } from '../../types';
import { UserPlus } from 'lucide-react';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({ isOpen, onClose }) => {
  const { addFamilyMember } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Sibling',
    age: 35,
    role: 'Financial Decision Support' as FamilyRole,
    phone: '+91 ',
    email: '',
    isEmergencyContact: false,
    isPrimaryContact: false,
    notes: ''
  });

  const roles: FamilyRole[] = [
    'Primary Family Contact',
    'Financial Decision Support',
    'Dependent',
    'Business Successor',
    'Emergency Contact'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addFamilyMember({
      name: formData.name,
      relationship: formData.relationship,
      age: Number(formData.age),
      role: formData.role,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@family.me`,
      isEmergencyContact: formData.isEmergencyContact,
      isPrimaryContact: formData.isPrimaryContact,
      notes: formData.notes || 'Registered in family continuity directory.'
    });

    setFormData({
      name: '',
      relationship: 'Sibling',
      age: 35,
      role: 'Financial Decision Support',
      phone: '+91 ',
      email: '',
      isEmergencyContact: false,
      isPrimaryContact: false,
      notes: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Family Member"
      subtitle="Define family relationship and emergency continuity role"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Vikram Sharma"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Relationship *</label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Guardian">Legal Guardian</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Age *</label>
            <input
              type="number"
              min="1"
              max="120"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Assigned Continuity Role *</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as FamilyRole })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isEmergencyContact}
              onChange={(e) => setFormData({ ...formData, isEmergencyContact: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500"
            />
            <span className="text-slate-300 font-medium">Designate as Emergency Contact</span>
          </label>
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
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Family Member
          </button>
        </div>
      </form>
    </Modal>
  );
};
