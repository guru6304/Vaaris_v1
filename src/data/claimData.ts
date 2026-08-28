import type { Claim } from '../types';

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim-lic-01',
    caseId: 'case-ramesh-sharma-2026',
    institution: 'Life Insurance Corporation of India (LIC)',
    assetType: 'Term Life Insurance',
    assetName: 'LIC Jeevan Umang Policy #88192041',
    claimantName: 'Arjun Sharma (Legal Heir / Claimant)',
    estimatedAmount: 2500000,
    isInsurance: true,
    status: 'Missing Document',
    progressPercentage: 80,
    nextStep: 'Upload Legal Heir Certificate / Succession Declaration',
    assignedProfessionalId: 'pro-1',
    missingDocumentNotice: {
      missingDocName: 'Legal Heir Documentation / Succession Certificate',
      reason: 'Nominee designation on record was registered prior to 2015 and requires updated legal heir endorsement from the Tahsildar / competent court.',
      whyItMatters: 'Additional verification may be required when nominee or family information needs clarification to prevent inter-heir settlement disputes.',
      suggestedAction: 'Upload notarized Surviving Members Certificate or consult assigned CA Rahul Mehta / Advocate Sunita Rao for expedited processing.'
    },
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Original / Digital Death Certificate',
        status: 'Complete',
        requiredDocument: 'Municipal Death Certificate (BBMP)',
        notes: 'Digitally verified via Civil Registration System portal.'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Claimant & Heir Identity Verification',
        status: 'Complete',
        requiredDocument: 'Claimant Aadhaar & PAN Card',
        notes: 'Aadhaar e-KYC completed for Arjun Sharma.'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Policy Nominee Record Verification',
        status: 'Complete',
        requiredDocument: 'Original Policy Bond or Indemnity Bond',
        notes: 'Branch records confirm deceased policyholder details.'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Institutional Claim Form Submission',
        status: 'Complete',
        requiredDocument: 'LIC Form No. 3783 & Cancelled Cheque',
        notes: 'Form 3783 submitted with NEFT mandate details.'
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'Legal Heir Documentation & Discharge Voucher',
        status: 'Action Required',
        requiredDocument: 'Tahsildar Legal Heir Certificate / Form B',
        notes: 'Requested by LIC Divisional Office Claims Department on 24 Jan 2026.'
      }
    ],
    activityLog: [
      {
        timestamp: '25 Jan 2026, 11:30 AM',
        author: 'VAARIS Guide (AI Assistant)',
        message: 'Detected requirement for Tahsildar Legal Heir Certificate from LIC Divisional notice.'
      },
      {
        timestamp: '22 Jan 2026, 03:45 PM',
        author: 'Rahul Mehta (CA)',
        message: 'Submitted NEFT mandate and Form 3783 to LIC Branch #610.'
      },
      {
        timestamp: '18 Jan 2026, 10:15 AM',
        author: 'Arjun Sharma',
        message: 'Uploaded verified BBMP Death Certificate to document vault.'
      }
    ]
  },
  {
    id: 'claim-sbi-02',
    caseId: 'case-ramesh-sharma-2026',
    institution: 'State Bank of India',
    assetType: 'Fixed Deposit & Savings',
    assetName: 'SBI Special Term Deposit #3049102948',
    claimantName: 'Arjun Sharma (Nominee)',
    estimatedAmount: 820000,
    status: 'Documents Submitted',
    progressPercentage: 70,
    nextStep: 'Branch manager verification & settlement clearance',
    assignedProfessionalId: 'pro-1',
    steps: [
      {
        id: 'sbi-step-1',
        stepNumber: 1,
        title: 'Death Certificate & KYC',
        status: 'Complete',
        requiredDocument: 'Death Certificate + Claimant KYC'
      },
      {
        id: 'sbi-step-2',
        stepNumber: 2,
        title: 'Deceased Depositor Settlement Form (Annexure A)',
        status: 'Complete',
        requiredDocument: 'SBI Form Annexure A & Indemnity'
      },
      {
        id: 'sbi-step-3',
        stepNumber: 3,
        title: 'Branch Verification & Signature Verification',
        status: 'In Progress',
        requiredDocument: 'Internal Branch Audit'
      },
      {
        id: 'sbi-step-4',
        stepNumber: 4,
        title: 'Payout Disbursement via RTGS',
        status: 'Pending',
        requiredDocument: 'Claimant Bank Passbook'
      }
    ],
    activityLog: [
      {
        timestamp: '20 Jan 2026, 02:00 PM',
        author: 'Rahul Mehta (CA)',
        message: 'Annexure A filed with Koramangala Branch Manager.'
      }
    ]
  },
  {
    id: 'claim-epf-03',
    caseId: 'case-ramesh-sharma-2026',
    institution: 'Employees Provident Fund Organisation (EPFO)',
    assetType: 'Provident Fund & Pension (EPS)',
    assetName: 'EPFO Regional Office Bengaluru (UAN 10029381)',
    claimantName: 'Surviving Legal Heirs',
    estimatedAmount: 680000,
    status: 'Information Review',
    progressPercentage: 45,
    nextStep: 'Submit Joint Form 20 & Form 10D with employer attestation',
    steps: [
      {
        id: 'epf-step-1',
        stepNumber: 1,
        title: 'Online UAN Status Check',
        status: 'Complete'
      },
      {
        id: 'epf-step-2',
        stepNumber: 2,
        title: 'Composite Claim Form (Death Cases)',
        status: 'In Progress',
        requiredDocument: 'Form 20, 10D, 5IF'
      },
      {
        id: 'epf-step-3',
        stepNumber: 3,
        title: 'Employer Attestation / Field Office Verification',
        status: 'Pending'
      },
      {
        id: 'epf-step-4',
        stepNumber: 4,
        title: 'Direct Bank Settlement',
        status: 'Pending'
      }
    ],
    activityLog: [
      {
        timestamp: '16 Jan 2026, 04:20 PM',
        author: 'Arjun Sharma',
        message: 'Retrieved last employer service history from EPFO portal.'
      }
    ]
  },
  {
    id: 'claim-mf-04',
    caseId: 'case-ramesh-sharma-2026',
    institution: 'CAMS / Nippon India & HDFC Mutual Fund',
    assetType: 'Mutual Fund Transmission',
    assetName: 'Consolidated MF Folios (NAV Value)',
    claimantName: 'Arjun Sharma & Suresh Sharma',
    estimatedAmount: 1240000,
    status: 'Claim Preparation',
    progressPercentage: 30,
    nextStep: 'Obtain Form T3 Transmission Request and Banker Attestation',
    steps: [
      {
        id: 'mf-step-1',
        stepNumber: 1,
        title: 'Folio Consolidated Statement Assembly',
        status: 'Complete'
      },
      {
        id: 'mf-step-2',
        stepNumber: 2,
        title: 'Form T3 Transmission Application',
        status: 'In Progress'
      },
      {
        id: 'mf-step-3',
        stepNumber: 3,
        title: 'Bank Verification (Annexure I)',
        status: 'Pending'
      },
      {
        id: 'mf-step-4',
        stepNumber: 4,
        title: 'Folio Units Re-issuance to Heirs',
        status: 'Pending'
      }
    ],
    activityLog: [
      {
        timestamp: '17 Jan 2026, 11:00 AM',
        author: 'Arjun Sharma',
        message: 'Assembled CAMS CAS statement for transmission request.'
      }
    ]
  },
  {
    id: 'claim-po-05',
    caseId: 'case-ramesh-sharma-2026',
    institution: 'Department of Posts / Post Office Savings Bank',
    assetType: 'Savings Account',
    assetName: 'Post Office Savings Certificate',
    claimantName: 'Arjun Sharma (Nominee)',
    estimatedAmount: 40000,
    status: 'Payout Completed',
    progressPercentage: 100,
    nextStep: 'Claim resolved and funds credited to primary account',
    steps: [
      { id: 'po-1', stepNumber: 1, title: 'Form SB-84 Filing', status: 'Complete' },
      { id: 'po-2', stepNumber: 2, title: 'Passbook Surrender', status: 'Complete' },
      { id: 'po-3', stepNumber: 3, title: 'Disbursement of ₹40,000', status: 'Complete' }
    ],
    activityLog: [
      {
        timestamp: '19 Jan 2026, 01:15 PM',
        author: 'Post Master Koramangala SO',
        message: 'Nominee claim settled. Amount ₹40,000 paid via account payee cheque.'
      }
    ]
  }
];
