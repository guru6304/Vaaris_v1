import type { EmergencyCase } from '../types';

export const DEMO_EMERGENCY_CASE: EmergencyCase = {
  id: 'case-ramesh-sharma-2026',
  deceasedName: 'Ramesh Sharma',
  relationship: 'Father',
  status: 'Active',
  dateReported: '14 Jan 2026',
  knownAssetsValue: 4280000, // ₹42.8 Lakhs
  potentialClaimsCount: 6,
  inProgressCount: 4,
  completedCount: 1,
  actionRequiredCount: 2,
  milestones: [
    {
      id: 1,
      title: 'Family & Heir Verification',
      status: 'Complete',
      detail: 'Immediate surviving legal heirs and family contacts registered.'
    },
    {
      id: 2,
      title: 'Essential Document Assembly',
      status: 'In Progress',
      detail: '3 of 5 primary certificates verified (Death Cert, Aadhaar, PAN active; Legal Heir pending).'
    },
    {
      id: 3,
      title: 'Potential Asset Inventory & Discovery',
      status: 'In Progress',
      detail: '₹42.8L across 6 accounts mapped with respective institutions.'
    },
    {
      id: 4,
      title: 'Institutional Claim Filings',
      status: 'In Progress',
      detail: '4 claim cases actively submitted and monitored across bank, insurer, and EPFO.'
    },
    {
      id: 5,
      title: 'Settlement & Asset Transmission',
      status: 'Pending',
      detail: '1 payout completed (₹40K Post Office); remaining under verification.'
    }
  ]
};
