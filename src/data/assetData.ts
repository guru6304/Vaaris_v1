import type { Asset } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    name: 'SBI Savings Account',
    category: 'bank_accounts',
    institution: 'State Bank of India',
    accountNumberMasked: '•••• 3892',
    value: 480000,
    nomineeStatus: 'Verified',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse', sharePercentage: 100, verifiedAt: '12 Jan 2026' }
    ],
    documentsCount: 2,
    lastReviewedDate: '12 Jan 2026',
    source: 'Document verified',
    notes: 'Primary personal operational account at Koramangala Branch'
  },
  {
    id: 'ast-2',
    name: 'HDFC Fixed Deposit',
    category: 'fixed_deposits',
    institution: 'HDFC Bank',
    accountNumberMasked: '•••• 7104',
    value: 750000,
    nomineeStatus: 'Action Required',
    nominees: [],
    documentsCount: 1,
    lastReviewedDate: '04 Nov 2025',
    source: 'Needs confirmation',
    notes: '3-year cumulative FD maturing March 2027. Nominee not updated after marriage.',
    actionRequired: 'Add and verify nominee details'
  },
  {
    id: 'ast-3',
    name: 'Mutual Fund Portfolio',
    category: 'mutual_funds',
    institution: 'Zerodha / Coin & CAMS',
    accountNumberMasked: '•••• 9940',
    value: 920000,
    nomineeStatus: 'Needs Review',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse', sharePercentage: 60 },
      { name: 'Aarav Sharma', relationship: 'Son', sharePercentage: 20 },
      { name: 'Ananya Sharma', relationship: 'Daughter', sharePercentage: 20 }
    ],
    documentsCount: 3,
    lastReviewedDate: '18 Dec 2025',
    source: 'User provided',
    notes: 'Multi-cap and index fund SIP portfolio. Guardian endorsement required for minors.',
    actionRequired: 'Verify minor guardian declaration'
  },
  {
    id: 'ast-4',
    name: 'HDFC Life Click 2 Protect Term Plan',
    category: 'insurance',
    institution: 'HDFC Life Insurance',
    accountNumberMasked: 'POL-••••-8812',
    value: 0, // Asset value is 0; pure term protection
    isInsurance: true,
    insuranceCoverage: 25000000, // ₹2.5 Crore (or ₹25L demo coverage)
    nomineeStatus: 'Needs Review',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse', sharePercentage: 100 }
    ],
    documentsCount: 2,
    lastReviewedDate: '10 Oct 2025',
    source: 'Document verified',
    notes: 'Pure Term life coverage till age 65. Annual premium paid through auto-debit.',
    actionRequired: 'Update secondary nominee preference'
  },
  {
    id: 'ast-5',
    name: 'Employees Provident Fund (EPF)',
    category: 'epf_retirement',
    institution: 'EPFO (UAN Portal)',
    accountNumberMasked: 'UAN-••••-1049',
    value: 540000,
    nomineeStatus: 'Action Required',
    nominees: [],
    documentsCount: 1,
    lastReviewedDate: '15 Aug 2025',
    source: 'Needs confirmation',
    notes: 'Accumulated corporate provident fund balance.',
    actionRequired: 'E-nomination pending on EPFO Member Portal'
  },
  {
    id: 'ast-6',
    name: 'Residential Apartment (Koramangala)',
    category: 'property',
    institution: 'Self / Sub-Registrar Office',
    accountNumberMasked: 'DOC-••••-4421',
    value: 4500000,
    nomineeStatus: 'Needs Review',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse (Co-owner)', sharePercentage: 50 }
    ],
    documentsCount: 1,
    lastReviewedDate: '20 Sep 2025',
    source: 'User provided',
    notes: 'Primary residential property. Estimated market valuation ₹45L.',
    actionRequired: 'Upload original sale deed and encumbrance certificate'
  },
  {
    id: 'ast-7',
    name: 'Bluechip Equity Shares',
    category: 'stocks_investments',
    institution: 'CDSL / Groww',
    accountNumberMasked: 'DP-••••-6623',
    value: 360000,
    nomineeStatus: 'Verified',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse', sharePercentage: 100, verifiedAt: '05 Jan 2026' }
    ],
    documentsCount: 2,
    lastReviewedDate: '05 Jan 2026',
    source: 'Document verified',
    notes: 'Direct equity holdings in Nifty 50 companies'
  },
  {
    id: 'ast-8',
    name: 'Family Gold Sovereign & Bullion',
    category: 'gold_other',
    institution: 'SBI Safe Deposit Locker (Locker #142)',
    accountNumberMasked: 'LCK-••••-0142',
    value: 1300000,
    nomineeStatus: 'Verified',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Spouse', sharePercentage: 50 },
      { name: 'Suresh Sharma', relationship: 'Father', sharePercentage: 50, verifiedAt: '02 Feb 2026' }
    ],
    documentsCount: 1,
    lastReviewedDate: '02 Feb 2026',
    source: 'User provided',
    notes: 'Physical gold bullion & family jewelry stored in Koramangala locker'
  },
  {
    id: 'ast-9',
    name: 'SBI Home Loan (Liability)',
    category: 'loans_liabilities',
    institution: 'State Bank of India',
    accountNumberMasked: 'LN-••••-5510',
    value: -1800000, // Outstanding liability ₹18,00,000
    nomineeStatus: 'Verified',
    nominees: [
      { name: 'Priya Sharma', relationship: 'Co-borrower', sharePercentage: 100, verifiedAt: '12 Jan 2026' }
    ],
    documentsCount: 2,
    lastReviewedDate: '12 Jan 2026',
    source: 'Document verified',
    notes: 'Outstanding principal on apartment mortgage with loan insurance rider'
  }
];

export const ASSET_CATEGORIES_CONFIG = [
  { key: 'all', label: 'All Categories', count: 9 },
  { key: 'bank_accounts', label: 'Bank Accounts', icon: 'Landmark' },
  { key: 'fixed_deposits', label: 'Fixed Deposits', icon: 'ShieldCheck' },
  { key: 'mutual_funds', label: 'Mutual Funds', icon: 'TrendingUp' },
  { key: 'insurance', label: 'Life Insurance', icon: 'HeartHandshake' },
  { key: 'epf_retirement', label: 'EPF & Retirement', icon: 'Briefcase' },
  { key: 'stocks_investments', label: 'Stocks & Demat', icon: 'LineChart' },
  { key: 'property', label: 'Real Estate / Property', icon: 'Home' },
  { key: 'gold_other', label: 'Gold & Locker', icon: 'Coins' },
  { key: 'loans_liabilities', label: 'Loans & Liabilities', icon: 'CreditCard' },
];
