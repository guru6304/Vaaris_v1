import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import type { Professional } from '../../types';
import {
  Briefcase,
  Calendar,
  Send
} from 'lucide-react';

interface ContactProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
}

export const ContactProfessionalModal: React.FC<ContactProfessionalModalProps> = ({
  isOpen,
  onClose,
  professional
}) => {
  const { assignProfessional, emergencyCase, showToast } = useApp();

  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow at 11:00 AM');
  const [activeTab, setActiveTab] = useState<'consult' | 'message'>('consult');

  if (!professional) return null;

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    assignProfessional(professional.id, emergencyCase.id);
    showToast(
      'Consultation Scheduled',
      `Session confirmed with ${professional.name} for ${selectedDate}.`,
      'success'
    );
    onClose();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    showToast(
      'Message Transmitted',
      `Direct inquiry sent to ${professional.name} (${professional.firm}).`,
      'success'
    );
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Connect with ${professional.name}`}
      subtitle={`${professional.role} • ${professional.firm}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Pro Profile Header */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white truncate">{professional.name}</h4>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                ⭐ {professional.rating}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] truncate">{professional.specialization}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('consult')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'consult'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Schedule Continuity Consultation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'message'
                ? 'bg-teal-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Send Secure Direct Note
          </button>
        </div>

        {activeTab === 'consult' ? (
          <form onSubmit={handleSchedule} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Select Preferred Consultation Slot
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Tomorrow at 11:00 AM">Tomorrow, 11:00 AM (Video / In-person)</option>
                <option value="Tomorrow at 03:30 PM">Tomorrow, 03:30 PM (Phone Consultation)</option>
                <option value="Friday at 10:00 AM">Friday, 10:00 AM (Case Review Session)</option>
                <option value="Saturday at 02:00 PM">Saturday, 02:00 PM (Estate Planning)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Case Association
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>{emergencyCase.deceasedName} Estate & Claims Case</span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Active Case</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                <Calendar className="w-4 h-4" />
                Confirm Consultation
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Message / Case Instructions *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about legal heir documentation, LIC claim discharge voucher, or succession filings..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                <Send className="w-4 h-4" />
                Send Secure Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
