import type { ReadinessActionItem, ReadinessBreakdown } from '../types';

export const INITIAL_READINESS_BREAKDOWN: ReadinessBreakdown[] = [
  {
    category: 'Assets Organized',
    score: 90,
    maxScore: 100,
    percentage: 90,
    description: '8 of 10 financial assets catalogued with account identifiers.'
  },
  {
    category: 'Nominee Readiness',
    score: 70,
    maxScore: 100,
    percentage: 70,
    description: '2 assets require updated or verified nominee declarations.'
  },
  {
    category: 'Document Readiness',
    score: 85,
    maxScore: 100,
    percentage: 85,
    description: 'Key policy certificates, PAN, and statements secured in vault.'
  },
  {
    category: 'Family Instructions',
    score: 80,
    maxScore: 100,
    percentage: 80,
    description: 'Immediate responsibilities and intent recorded for primary contacts.'
  },
  {
    category: 'Professional Readiness',
    score: 50,
    maxScore: 100,
    percentage: 50,
    description: 'CA assigned. Estate lawyer and wealth advisor not yet linked.'
  },
  {
    category: 'Emergency Preparedness',
    score: 65,
    maxScore: 100,
    percentage: 65,
    description: 'Tiered access permissions configured for spouse and secondary contact.'
  }
];

export const INITIAL_READINESS_ACTIONS: ReadinessActionItem[] = [
  {
    id: 'act-1',
    title: 'EPF Nominee Not Verified',
    category: 'Nominee Readiness',
    priority: 'HIGH PRIORITY',
    description: 'Your EPFO account balance (₹5.40L) has unconfirmed e-nomination on the portal.',
    targetRoute: 'nominees',
    targetId: 'ast-5',
    points: 8,
    isResolved: false
  },
  {
    id: 'act-2',
    title: 'Insurance Policy Nominee Needs Review',
    category: 'Nominee Readiness',
    priority: 'MEDIUM PRIORITY',
    description: 'HDFC Life Term Plan (₹25L coverage) secondary nominee preference is unrecorded.',
    targetRoute: 'nominees',
    targetId: 'ast-4',
    points: 6,
    isResolved: false
  },
  {
    id: 'act-3',
    title: 'Property Documents Missing Encumbrance',
    category: 'Document Readiness',
    priority: 'MEDIUM PRIORITY',
    description: 'Koramangala apartment requires latest Form 15 Encumbrance Certificate for dispute-free succession.',
    targetRoute: 'documents',
    targetId: 'ast-6',
    points: 5,
    isResolved: false
  },
  {
    id: 'act-4',
    title: 'Link Estate Lawyer to Advisory Network',
    category: 'Professional Readiness',
    priority: 'MEDIUM PRIORITY',
    description: 'Assign a verified legal professional for will review and succession coordination.',
    targetRoute: 'professionals',
    points: 5,
    isResolved: false
  },
  {
    id: 'act-5',
    title: 'Review Family Continuity Plan Quarterly',
    category: 'Family Instructions',
    priority: 'LOW PRIORITY',
    description: 'Confirm emergency access permissions and liquidity contact designations.',
    targetRoute: 'family-plan',
    points: 4,
    isResolved: false
  }
];
