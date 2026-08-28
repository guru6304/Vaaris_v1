import type { Professional } from '../types';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'pro-1',
    name: 'Rahul Mehta, FCA',
    role: 'Chartered Accountant',
    firm: 'Mehta & Associates Chartered Accountants',
    specialization: 'Family Tax Estates, Corporate Compliance, Succession Audit',
    assignedCaseId: 'case-ramesh-sharma-2026',
    assignedCaseName: 'Ramesh Sharma Estate & Claims',
    status: 'Active',
    phone: '+91 98402 77102',
    email: 'rahul.mehta@mehtaca.in',
    rating: 4.9
  },
  {
    id: 'pro-2',
    name: 'Advocate Sunita Rao',
    role: 'Legal / Estate Lawyer',
    firm: 'Rao Chambers & Estate Counsel',
    specialization: 'Succession Certificates, Family Wills, Tahsildar Legal Heir Petitions',
    status: 'Available',
    phone: '+91 98230 11984',
    email: 'sunita.rao@raochambers.com',
    rating: 4.95
  },
  {
    id: 'pro-3',
    name: 'Amit Verma, CFP',
    role: 'Wealth Advisor',
    firm: 'Apex Wealth Continuity Partners',
    specialization: 'Asset Allocation, Mutual Fund Transmission, Guardian Trusts',
    status: 'Available',
    phone: '+91 99104 88721',
    email: 'amit.verma@apexwealth.in',
    rating: 4.85
  },
  {
    id: 'pro-4',
    name: 'Preeti Nair',
    role: 'Insurance Specialist',
    firm: 'ShieldCare Policy Advisors',
    specialization: 'Life & Health Death Claims, Ombudsman Escalation, Policy Bond Recovery',
    status: 'Available',
    phone: '+91 97410 44329',
    email: 'preeti.nair@shieldcare.in',
    rating: 4.9
  }
];
