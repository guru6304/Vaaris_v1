import type { AiPromptResponse, RouteType } from '../types';

export const CONTEXTUAL_AI_GUIDE: Record<RouteType, AiPromptResponse[]> = {
  welcome: [
    {
      id: 'w-1',
      question: 'What is the core difference between PREPARE and RESPOND?',
      response: 'PREPARE is used while you are healthy to catalogue assets, organize nominees, and formulate emergency instructions. RESPOND is the post-crisis guided journey that helps your family discover assets, assemble required proof, and navigate institutional claim settlements smoothly.'
    },
    {
      id: 'w-2',
      question: 'How does VAARIS protect sensitive family data?',
      response: 'VAARIS is designed with tiered privacy and verified multi-factor access protocols. Sensitive assets and legal instructions remain encrypted and are accessible strictly by authorized family contacts upon verification.'
    }
  ],
  dashboard: [
    {
      id: 'd-1',
      question: 'Why is my Family Readiness Score at 78%?',
      response: 'Your score reflects 8 of 10 organized assets, but is currently held back by 2 unverified nominees (EPFO and HDFC FD) and a pending Encumbrance Certificate for your residential property.',
      actionCta: 'Review Pending Actions',
      actionRoute: 'readiness'
    },
    {
      id: 'd-2',
      question: 'What happens if I update my EPF nominee today?',
      response: 'Verifying your EPF nominee will resolve a High Priority action item, increasing your Family Readiness Score by +8 points to 86%.',
      actionCta: 'Go to Nominee Readiness',
      actionRoute: 'nominees'
    },
    {
      id: 'd-3',
      question: 'Is my ₹25L life insurance included in my Total Assets?',
      response: 'No. VAARIS strictly separates your actual financial asset value (₹48.5L net) from contingent insurance coverage (₹25L Sum Assured) to give an accurate picture of liquid net worth.'
    }
  ],
  family: [
    {
      id: 'f-1',
      question: 'Who should be assigned as Primary Family Contact?',
      response: 'The Primary Family Contact (currently Priya Sharma) should be someone trusted with immediate family decisions, healthcare liquidity, and initial coordination with professionals.',
      actionCta: 'Review Family Roles',
      actionRoute: 'family'
    },
    {
      id: 'f-2',
      question: 'How do minor children receive asset allocations?',
      response: 'Minors (Aarav and Ananya) cannot directly receive institutional disbursements until age 18. Nominee allocations require an appointed legal guardian (Priya Sharma) or a designated trust mechanism.'
    }
  ],
  assets: [
    {
      id: 'a-1',
      question: 'Which assets are missing nominee confirmations?',
      response: 'Two assets need immediate confirmation: 1) HDFC Fixed Deposit (₹7.5L) — nominee unconfirmed. 2) EPFO Provident Fund (₹5.4L) — e-nomination pending on portal.',
      actionCta: 'Fix Nominee Status',
      actionRoute: 'nominees'
    },
    {
      id: 'a-2',
      question: 'Why should I upload property sale deeds to VAARIS?',
      response: 'Real estate transmission is one of the most disputed post-death procedures. Having verified sale deeds and Encumbrance Certificates ready cuts legal processing time by up to 6 months.'
    }
  ],
  nominees: [
    {
      id: 'n-1',
      question: 'Does a nominee automatically become the legal owner?',
      response: 'Important distinction: A nominee is a legal trustee appointed to receive funds from the institution. Final legal ownership is governed by succession laws, valid wills, and legal heir consensus. VAARIS helps keep both aligned.',
      actionCta: 'View Family Plan Intent',
      actionRoute: 'family-plan'
    },
    {
      id: 'n-2',
      question: 'How do I resolve the EPF nomination action item?',
      response: 'Submit e-nomination on the EPFO member portal, then click "Mark Verified" in the nominee review drawer to update your readiness score.',
      actionCta: 'Verify Nominees',
      actionRoute: 'nominees'
    }
  ],
  documents: [
    {
      id: 'doc-1',
      question: 'How does AI document extraction work in VAARIS?',
      response: 'When you upload a policy or financial statement, VAARIS extracts key data fields (Policy Number, Nominee, Sum Assured, Maturity Dates) and links them to the corresponding asset record automatically.'
    },
    {
      id: 'doc-2',
      question: 'Which document should I upload next to boost readiness?',
      response: 'Uploading the latest Form 15 Encumbrance Certificate for your Koramangala apartment will clear the pending Property verification item (+5 points).',
      actionCta: 'Upload Document',
      actionRoute: 'documents'
    }
  ],
  'family-plan': [
    {
      id: 'p-1',
      question: 'Is my Family Financial Intent legally binding?',
      response: 'Your recorded Family Intent serves as a clear guide for your family and executor. For legal enforceability, it should be mirrored in a registered Will or testamentary trust reviewed by a legal counsel.',
      actionCta: 'Consult Estate Lawyer',
      actionRoute: 'professionals'
    },
    {
      id: 'p-2',
      question: 'How does Emergency Access work for my spouse?',
      response: 'Priya Sharma is assigned Tier 1 Emergency Access. In an unexpected crisis, verified access provides immediate step-by-step instructions, account numbers, and CA contact details.'
    }
  ],
  readiness: [
    {
      id: 'r-1',
      question: 'What is the fastest way to achieve a 90%+ Readiness Score?',
      response: '1) Verify EPF nomination (+8 pts), 2) Update HDFC FD nominee (+6 pts), and 3) Assign Advocate Sunita Rao as your family estate counsel (+5 pts).',
      actionCta: 'Resolve Top Priority',
      actionRoute: 'nominees'
    }
  ],
  emergency: [
    {
      id: 'e-1',
      question: 'What is the first step in the Ramesh Sharma claim case?',
      response: 'The Death Certificate and claimant identities have been successfully verified. The next critical item is resolving the missing Legal Heir documentation for the LIC Life Insurance claim.',
      actionCta: 'Open LIC Claim',
      actionRoute: 'claim-detail'
    },
    {
      id: 'e-2',
      question: 'Who is assisting with the institutional bank claims?',
      response: 'Chartered Accountant Rahul Mehta is actively coordinating Annexure A filings with State Bank of India and EPFO composite forms.',
      actionCta: 'Contact Rahul Mehta',
      actionRoute: 'professionals'
    }
  ],
  'claim-detail': [
    {
      id: 'cd-1',
      question: 'Why is LIC asking for Legal Heir documentation?',
      response: 'Because the policy nomination records were established prior to 2015 without updated digital KYC, LIC requires a Tahsildar Legal Heir Certificate or surviving member affidavit to release the ₹25L sum assured.',
      actionCta: 'View Options & Checklist',
      actionRoute: 'claim-detail'
    },
    {
      id: 'cd-2',
      question: 'Can Rahul Mehta (CA) help obtain this certificate?',
      response: 'Yes. CA Rahul Mehta and Advocate Sunita Rao can prepare the formal Tahsildar petition and indemnity bond to expedite institutional clearance.',
      actionCta: 'Message Advisor',
      actionRoute: 'professionals'
    }
  ],
  professionals: [
    {
      id: 'pro-1',
      question: 'Why should I connect my CA and Lawyer inside VAARIS?',
      response: 'Linking verified professionals ensures that when crisis hits, your family has immediate access to competent advisors with contextual access to necessary statements and filings.'
    }
  ],
  settings: [
    {
      id: 's-1',
      question: 'How do I reset the demo for a new investor pitch?',
      response: 'Click the "Reset Demo" button in the header or settings at any time to instantly restore the original benchmark state (78% readiness score, 8 assets, Ramesh Sharma active case).'
    }
  ]
};
