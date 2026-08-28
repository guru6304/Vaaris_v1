export type RouteType =
  | 'welcome'
  | 'dashboard'
  | 'family'
  | 'assets'
  | 'nominees'
  | 'documents'
  | 'family-plan'
  | 'readiness'
  | 'emergency'
  | 'claim-detail'
  | 'professionals'
  | 'settings';

export type FamilyRole =
  | 'Primary Family Contact'
  | 'Financial Decision Support'
  | 'Dependent'
  | 'Business Successor'
  | 'Emergency Contact';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  role: FamilyRole;
  phone: string;
  email: string;
  isEmergencyContact: boolean;
  isPrimaryContact: boolean;
  avatarColor: string;
  notes?: string;
}

export type AssetCategory =
  | 'bank_accounts'
  | 'fixed_deposits'
  | 'mutual_funds'
  | 'insurance'
  | 'epf_retirement'
  | 'stocks_investments'
  | 'property'
  | 'gold_other'
  | 'loans_liabilities';

export type NomineeStatus =
  | 'Verified'
  | 'Needs Review'
  | 'Action Required'
  | 'Not Added'
  | 'Unknown';

export interface AssetNominee {
  name: string;
  relationship: string;
  sharePercentage: number;
  verifiedAt?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  institution: string;
  accountNumberMasked: string;
  value: number; // For balance or estimated valuation
  isInsurance?: boolean;
  insuranceCoverage?: number; // Kept strictly separate from asset value
  nomineeStatus: NomineeStatus;
  nominees: AssetNominee[];
  documentsCount: number;
  lastReviewedDate: string;
  source: 'User provided' | 'Document verified' | 'Needs confirmation';
  notes?: string;
  actionRequired?: string;
}

export type DocumentCategory =
  | 'Identity Documents'
  | 'Financial Documents'
  | 'Insurance'
  | 'Property'
  | 'Legal Documents'
  | 'Business Documents'
  | 'Other';

export interface ExtractedDocumentData {
  policyNumber?: string;
  nomineeName?: string;
  coverageAmount?: string;
  institutionProvider?: string;
  documentDate?: string;
  confidenceScore?: number;
  notes?: string;
}

export interface VaultDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  linkedAssetId?: string;
  linkedAssetName?: string;
  uploadDate: string;
  fileSizeBytes: number;
  status: 'Document Processed' | 'AI Processing' | 'Needs Verification';
  extractedData?: ExtractedDocumentData;
}

export interface FamilyInstruction {
  id: string;
  title: string;
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  targetContact: string;
}

export interface FinancialIntentAllocation {
  assetName: string;
  category: string;
  notes: string;
  preferredAllocations: {
    name: string;
    percentage: number;
  }[];
}

export interface EmergencyAccessTier {
  contactName: string;
  relationship: string;
  accessLevel: string;
  permissions: string[];
  restrictionNotice: string;
}

export interface FamilyPlan {
  completionPercentage: number;
  emergencyContacts: {
    primary: { name: string; role: string; phone: string; memberId?: string };
    secondary: { name: string; role: string; phone: string; memberId?: string };
    ca: { name: string; firm: string; phone: string };
  };
  responsibilities: {
    immediateFinances: string;
    coordinateCA: string;
    overseeBusiness: string;
  };
  financialIntents: FinancialIntentAllocation[];
  instructions: FamilyInstruction[];
  emergencyAccessTiers: EmergencyAccessTier[];
}

export interface ReadinessActionItem {
  id: string;
  title: string;
  category: string;
  priority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  description: string;
  targetRoute: RouteType;
  targetId?: string;
  points: number;
  isResolved: boolean;
}

export interface ReadinessBreakdown {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

export interface EmergencyCase {
  id: string;
  deceasedName: string;
  relationship: string;
  status: 'Active' | 'Under Review' | 'Resolved';
  dateReported: string;
  knownAssetsValue: number;
  potentialClaimsCount: number;
  inProgressCount: number;
  completedCount: number;
  actionRequiredCount: number;
  milestones: {
    id: number;
    title: string;
    status: 'Complete' | 'In Progress' | 'Pending';
    detail: string;
  }[];
}

export interface ClaimStep {
  id: string;
  stepNumber: number;
  title: string;
  status: 'Complete' | 'In Progress' | 'Action Required' | 'Pending';
  requiredDocument?: string;
  notes?: string;
}

export interface Claim {
  id: string;
  caseId: string;
  institution: string;
  assetType: string;
  assetName: string;
  claimantName: string;
  estimatedAmount: number;
  isInsurance?: boolean;
  status:
    | 'Documents Submitted'
    | 'Missing Document'
    | 'Information Review'
    | 'Claim Preparation'
    | 'Payout Completed';
  progressPercentage: number;
  nextStep: string;
  steps: ClaimStep[];
  missingDocumentNotice?: {
    missingDocName: string;
    reason: string;
    whyItMatters: string;
    suggestedAction: string;
  };
  assignedProfessionalId?: string;
  activityLog: {
    timestamp: string;
    author: string;
    message: string;
  }[];
}

export interface Professional {
  id: string;
  name: string;
  role: 'Chartered Accountant' | 'Legal / Estate Lawyer' | 'Wealth Advisor' | 'Insurance Specialist';
  firm: string;
  specialization: string;
  assignedCaseId?: string;
  assignedCaseName?: string;
  status: 'Active' | 'Available';
  phone: string;
  email: string;
  rating: number;
}

export interface AiPromptResponse {
  id: string;
  question: string;
  response: string;
  actionCta?: string;
  actionRoute?: RouteType;
}
