import type { FamilyMember } from '../types';

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Priya Sharma',
    relationship: 'Spouse',
    age: 39,
    role: 'Primary Family Contact',
    phone: '+91 98201 44521',
    email: 'priya.sharma@example.com',
    isEmergencyContact: true,
    isPrimaryContact: true,
    avatarColor: 'from-teal-500 to-emerald-600',
    notes: 'Primary executor for family immediate decisions and nominee for principal savings and investments.'
  },
  {
    id: 'fam-2',
    name: 'Aarav Sharma',
    relationship: 'Son',
    age: 12,
    role: 'Dependent',
    phone: 'Managed via Parent',
    email: 'aarav.care@sharmafamily.me',
    isEmergencyContact: false,
    isPrimaryContact: false,
    avatarColor: 'from-blue-500 to-indigo-600',
    notes: 'Minor child. Education trust & allocation nominee with guardian assignment.'
  },
  {
    id: 'fam-3',
    name: 'Ananya Sharma',
    relationship: 'Daughter',
    age: 8,
    role: 'Dependent',
    phone: 'Managed via Parent',
    email: 'ananya.care@sharmafamily.me',
    isEmergencyContact: false,
    isPrimaryContact: false,
    avatarColor: 'from-pink-500 to-rose-600',
    notes: 'Minor child. Beneficiary on portfolio and family continuity plan.'
  },
  {
    id: 'fam-4',
    name: 'Suresh Sharma',
    relationship: 'Father',
    age: 68,
    role: 'Business Successor',
    phone: '+91 98110 33219',
    email: 'suresh.sharma@example.com',
    isEmergencyContact: true,
    isPrimaryContact: false,
    avatarColor: 'from-amber-500 to-orange-600',
    notes: 'Secondary emergency contact and advisor for family business continuity matters.'
  },
  {
    id: 'fam-5',
    name: 'Lakshmi Sharma',
    relationship: 'Mother',
    age: 65,
    role: 'Dependent',
    phone: '+91 98110 33220',
    email: 'lakshmi.sharma@example.com',
    isEmergencyContact: false,
    isPrimaryContact: false,
    avatarColor: 'from-purple-500 to-violet-600',
    notes: 'Co-resident family elder. Healthcare and family support recipient.'
  }
];

export const DEMO_USER = {
  name: 'Arjun Sharma',
  age: 42,
  occupation: 'Business Owner & Founder',
  email: 'arjun.sharma@sharmaventures.in',
  phone: '+91 98450 12890',
  city: 'Bengaluru, India',
  panNumber: 'ABCPS****K'
};
