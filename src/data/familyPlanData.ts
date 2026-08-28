import type { FamilyPlan } from '../types';

export const INITIAL_FAMILY_PLAN: FamilyPlan = {
  completionPercentage: 80,
  emergencyContacts: {
    primary: {
      name: 'Priya Sharma',
      role: 'Spouse & Primary Family Contact',
      phone: '+91 98201 44521'
    },
    secondary: {
      name: 'Suresh Sharma',
      role: 'Father & Business Advisor',
      phone: '+91 98110 33219'
    },
    ca: {
      name: 'Rahul Mehta',
      firm: 'Mehta & Associates Chartered Accountants',
      phone: '+91 98402 77102'
    }
  },
  responsibilities: {
    immediateFinances: 'Priya Sharma (Spouse) — Authorized for day-to-day household and medical liquidity.',
    coordinateCA: 'Priya Sharma with Rahul Mehta (CA) — For tax filings, business audit, and asset claim submissions.',
    overseeBusiness: 'Suresh Sharma (Father) & Designated Partner — To oversee ongoing commercial operations.'
  },
  financialIntents: [
    {
      assetName: 'Mutual Fund Portfolio (₹9,20,000)',
      category: 'Mutual Funds',
      notes: 'Long-term equity wealth intended for children higher education and living continuity.',
      preferredAllocations: [
        { name: 'Priya Sharma', percentage: 60 },
        { name: 'Aarav Sharma', percentage: 20 },
        { name: 'Ananya Sharma', percentage: 20 }
      ]
    },
    {
      assetName: 'Term Life Insurance (₹25,00,000 Coverage)',
      category: 'Insurance Proceeds',
      notes: 'Priority 1: Fully settle SBI Home Loan principal (₹18L). Priority 2: Deposit balance in education trust FD for Aarav & Ananya.',
      preferredAllocations: [
        { name: 'Priya Sharma (for Debt & Trust)', percentage: 100 }
      ]
    },
    {
      assetName: 'Gold Bullion & Sovereign Locker (₹13,00,000)',
      category: 'Locker & Physical Assets',
      notes: 'Family heritage jewelry divided equally between children at marriage / maturity age.',
      preferredAllocations: [
        { name: 'Aarav Sharma', percentage: 50 },
        { name: 'Ananya Sharma', percentage: 50 }
      ]
    }
  ],
  instructions: [
    {
      id: 'inst-1',
      title: 'Contact CA Before Major Decisions',
      text: 'If I am unavailable or in a crisis, immediately contact Rahul Mehta (CA) before taking any decision regarding business bank accounts or asset liquidation.',
      priority: 'High',
      targetContact: 'Priya Sharma'
    },
    {
      id: 'inst-2',
      title: 'Debt Settlement Priority',
      text: 'Use life insurance claim proceeds first to clear the outstanding SBI Home Loan on the Koramangala apartment to secure debt-free housing for the family.',
      priority: 'High',
      targetContact: 'Priya Sharma'
    },
    {
      id: 'inst-3',
      title: 'Real Estate Retention Policy',
      text: 'Do not sell or mortgage the Koramangala residential apartment without formal consultation with Suresh Sharma and our legal counsel.',
      priority: 'Medium',
      targetContact: 'Priya Sharma & Suresh Sharma'
    },
    {
      id: 'inst-4',
      title: 'Children Education Trust Management',
      text: 'Mutual fund SIPs in Zerodha should continue under guardian mandate until Aarav turns 18.',
      priority: 'Medium',
      targetContact: 'Priya Sharma'
    }
  ],
  emergencyAccessTiers: [
    {
      contactName: 'Priya Sharma',
      relationship: 'Spouse (Primary)',
      accessLevel: 'Tier 1 — Immediate Full Continuity Access',
      permissions: [
        'Family Continuity Plan & Instructions',
        'Asset Inventory & Account Identifiers',
        'Document Vault & Policy Certificates',
        'Direct Professional Contact Directory'
      ],
      restrictionNotice: 'Protected under dual-factor family verification protocol.'
    },
    {
      contactName: 'Suresh Sharma',
      relationship: 'Father (Secondary)',
      accessLevel: 'Tier 2 — Emergency Contingency Access',
      permissions: [
        'Emergency Action Checklist',
        'Business Continuity Protocol',
        'Professional Advisory Network'
      ],
      restrictionNotice: 'Activated if Primary Contact is unavailable or upon emergency incident declaration.'
    },
    {
      contactName: 'Rahul Mehta',
      relationship: 'Chartered Accountant',
      accessLevel: 'Tier 3 — Professional Coordination Access',
      permissions: [
        'Tax & Financial Asset Statements',
        'Claim Submission Document Packages'
      ],
      restrictionNotice: 'Requires explicit family authorization for document access.'
    }
  ]
};
