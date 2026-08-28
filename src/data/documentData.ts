import type { VaultDocument } from '../types';

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    name: 'PAN Card — Arjun Sharma.pdf',
    category: 'Identity Documents',
    uploadDate: '15 Jan 2026',
    fileSizeBytes: 1240000,
    status: 'Document Processed',
    extractedData: {
      institutionProvider: 'Income Tax Department, Govt of India',
      documentDate: '14 May 2012',
      confidenceScore: 99,
      notes: 'Identity & Tax identifier verified against national record standards.'
    }
  },
  {
    id: 'doc-2',
    name: 'HDFC Life Policy Certificate.pdf',
    category: 'Insurance',
    linkedAssetId: 'ast-4',
    linkedAssetName: 'HDFC Life Click 2 Protect Term Plan',
    uploadDate: '10 Oct 2025',
    fileSizeBytes: 3450000,
    status: 'Document Processed',
    extractedData: {
      policyNumber: 'HD-8829-4100-TL',
      nomineeName: 'Priya Sharma (Spouse - 100%)',
      coverageAmount: '₹25,00,000 Sum Assured',
      institutionProvider: 'HDFC Standard Life Insurance Co.',
      documentDate: '10 Oct 2021',
      confidenceScore: 97,
      notes: 'Term insurance policy valid through October 2049. Premium payment verified active.'
    }
  },
  {
    id: 'doc-3',
    name: 'Apartment Sale Deed & Khata.pdf',
    category: 'Property',
    linkedAssetId: 'ast-6',
    linkedAssetName: 'Residential Apartment (Koramangala)',
    uploadDate: '20 Sep 2025',
    fileSizeBytes: 8900000,
    status: 'Needs Verification',
    extractedData: {
      policyNumber: 'REG-KA-BLR-8921-2018',
      nomineeName: 'Joint Title (Arjun & Priya Sharma)',
      institutionProvider: 'Sub-Registrar Office, Koramangala',
      documentDate: '15 Jun 2018',
      confidenceScore: 91,
      notes: 'Encumbrance Certificate pending updated financial year upload.'
    }
  },
  {
    id: 'doc-4',
    name: 'CAMS Consolidated Account Statement.pdf',
    category: 'Financial Documents',
    linkedAssetId: 'ast-3',
    linkedAssetName: 'Mutual Fund Portfolio',
    uploadDate: '18 Dec 2025',
    fileSizeBytes: 2150000,
    status: 'Document Processed',
    extractedData: {
      policyNumber: 'FOLIO-9940-221',
      nomineeName: 'Priya Sharma (60%), Aarav (20%), Ananya (20%)',
      coverageAmount: 'Portfolio NAV ₹9,20,410',
      institutionProvider: 'CAMS / KFintech Services',
      documentDate: '30 Nov 2025',
      confidenceScore: 98,
      notes: '3 AMC folios mapped. Minor guardianship endorsement noted.'
    }
  },
  {
    id: 'doc-5',
    name: 'Family Will & Testament (Draft Reference).pdf',
    category: 'Legal Documents',
    uploadDate: '05 Jan 2026',
    fileSizeBytes: 4200000,
    status: 'Document Processed',
    extractedData: {
      institutionProvider: 'Advocate Sunita Rao Associates',
      documentDate: '02 Jan 2026',
      confidenceScore: 96,
      notes: 'Registered reference draft. Outlines guardianship provisions and asset succession guidance.'
    }
  },
  {
    id: 'doc-6',
    name: 'EPFO Member Passbook Summary.pdf',
    category: 'Financial Documents',
    linkedAssetId: 'ast-5',
    linkedAssetName: 'Employees Provident Fund (EPF)',
    uploadDate: '15 Aug 2025',
    fileSizeBytes: 1800000,
    status: 'Needs Verification',
    extractedData: {
      policyNumber: 'UAN-1009-2819-4402',
      nomineeName: 'Not registered in passbook',
      coverageAmount: 'Total Balance ₹5,40,200',
      institutionProvider: 'Employees Provident Fund Organisation',
      documentDate: '31 Mar 2025',
      confidenceScore: 94,
      notes: 'E-Nomination needs verification on unified EPFO portal.'
    }
  },
  {
    id: 'doc-7',
    name: 'SBI Fixed Deposit Advice.pdf',
    category: 'Financial Documents',
    linkedAssetId: 'ast-1',
    linkedAssetName: 'SBI Savings Account',
    uploadDate: '12 Jan 2026',
    fileSizeBytes: 1100000,
    status: 'Document Processed',
    extractedData: {
      policyNumber: 'FD-SBI-4402-991',
      nomineeName: 'Priya Sharma (Spouse - 100%)',
      coverageAmount: 'Principal ₹4,80,000',
      institutionProvider: 'State Bank of India',
      documentDate: '12 Jan 2026',
      confidenceScore: 99,
      notes: 'Auto-renewal instructions recorded.'
    }
  }
];
