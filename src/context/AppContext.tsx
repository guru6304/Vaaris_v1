import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  RouteType,
  FamilyMember,
  Asset,
  VaultDocument,
  FamilyPlan,
  ReadinessActionItem,
  ReadinessBreakdown,
  EmergencyCase,
  Claim,
  Professional
} from '../types';
import { INITIAL_FAMILY_MEMBERS, DEMO_USER } from '../data/familyData';
import { INITIAL_ASSETS } from '../data/assetData';
import { INITIAL_DOCUMENTS } from '../data/documentData';
import { INITIAL_FAMILY_PLAN } from '../data/familyPlanData';
import { INITIAL_READINESS_ACTIONS, INITIAL_READINESS_BREAKDOWN } from '../data/readinessData';
import { DEMO_EMERGENCY_CASE } from '../data/emergencyData';
import { INITIAL_CLAIMS } from '../data/claimData';
import { INITIAL_PROFESSIONALS } from '../data/professionalData';

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  currentRoute: RouteType;
  navigate: (route: RouteType) => void;

  // User Profile
  user: typeof DEMO_USER;

  // Core Data
  familyMembers: FamilyMember[];
  assets: Asset[];
  documents: VaultDocument[];
  familyPlan: FamilyPlan;
  readinessActions: ReadinessActionItem[];
  emergencyCases: EmergencyCase[];
  emergencyCase: EmergencyCase;
  activeCaseId: string;
  claims: Claim[];
  professionals: Professional[];

  // Selected for Drawers / Modals
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  editingAsset: Asset | null;
  setEditingAsset: (asset: Asset | null) => void;
  selectedClaimId: string | null;
  setSelectedClaimId: (id: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  selectedProfessionalId: string | null;
  setSelectedProfessionalId: (id: string | null) => void;

  // Active Modals & AI
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  isVaarisGuideOpen: boolean;
  setIsVaarisGuideOpen: (open: boolean) => void;
  activeInvestorStep: number;
  setActiveInvestorStep: (step: number) => void;

  // Computed Financial Metrics
  totalAssetValue: number; // Gross Assets
  totalLiabilities: number; // Outstanding Debts
  netWorth: number; // Gross - Liabilities
  totalInsuranceCoverage: number; // Separated sum assured
  organizedAssetsCount: number;
  nomineeCoveragePercentage: number;
  protectedDocumentsCount: number;
  readinessScore: number;
  readinessBreakdown: ReadinessBreakdown[];

  // Mutations
  addAsset: (asset: Omit<Asset, 'id' | 'documentsCount' | 'lastReviewedDate'>) => void;
  updateAsset: (assetId: string, updatedData: Partial<Asset>) => void;
  archiveAsset: (assetId: string) => void;
  updateNomineeStatus: (assetId: string, status: Asset['nomineeStatus'], nominees: Asset['nominees']) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'avatarColor'>) => void;
  uploadDocument: (doc: Omit<VaultDocument, 'id' | 'uploadDate' | 'status'>) => void;
  archiveDocument: (docId: string) => void;
  resolveActionItem: (actionId: string) => void;
  addFamilyInstruction: (title: string, text: string, priority: 'High' | 'Medium' | 'Low', targetContact: string) => void;
  updateFamilyResponsibility: (field: keyof FamilyPlan['responsibilities'], value: string) => void;
  updateEmergencyContact: (tier: 'primary' | 'secondary', name: string, role: string, phone: string) => void;
  completeClaimStep: (claimId: string, stepId: string) => void;
  assignProfessional: (proId: string, caseId: string) => void;
  startNewEmergencyCase: (deceasedName: string, relationship: string, knownAssetIds: string[]) => void;
  setActiveCaseId: (id: string) => void;

  // Feedback & Reset
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'vaaris_demo_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('welcome');
  const user = DEMO_USER;

  // Core Entities State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_family`);
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_docs`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [familyPlan, setFamilyPlan] = useState<FamilyPlan>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plan`);
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_PLAN;
  });

  const [readinessActions, setReadinessActions] = useState<ReadinessActionItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_actions`);
    return saved ? JSON.parse(saved) : INITIAL_READINESS_ACTIONS;
  });

  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_emergency_cases`);
    return saved ? JSON.parse(saved) : [DEMO_EMERGENCY_CASE];
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_active_case_id`);
    return saved ? JSON.parse(saved) : DEMO_EMERGENCY_CASE.id;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_claims`);
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pros`);
    return saved ? JSON.parse(saved) : INITIAL_PROFESSIONALS;
  });

  // Selected entities for drilldown
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>('claim-lic-01');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  // Modals & Assistant
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isVaarisGuideOpen, setIsVaarisGuideOpen] = useState<boolean>(false);
  const [activeInvestorStep, setActiveInvestorStep] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage for realistic persistent session
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_family`, JSON.stringify(familyMembers));
    localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${STORAGE_KEY}_docs`, JSON.stringify(documents));
    localStorage.setItem(`${STORAGE_KEY}_plan`, JSON.stringify(familyPlan));
    localStorage.setItem(`${STORAGE_KEY}_actions`, JSON.stringify(readinessActions));
    localStorage.setItem(`${STORAGE_KEY}_emergency_cases`, JSON.stringify(emergencyCases));
    localStorage.setItem(`${STORAGE_KEY}_active_case_id`, JSON.stringify(activeCaseId));
    localStorage.setItem(`${STORAGE_KEY}_claims`, JSON.stringify(claims));
    localStorage.setItem(`${STORAGE_KEY}_pros`, JSON.stringify(professionals));
  }, [familyMembers, assets, documents, familyPlan, readinessActions, emergencyCases, activeCaseId, claims, professionals]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') as RouteType;
      if (hash && ['welcome', 'dashboard', 'family', 'assets', 'nominees', 'documents', 'family-plan', 'readiness', 'emergency', 'claim-detail', 'professionals', 'settings'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (route: RouteType) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => {
    setActiveModal(null);
    setEditingAsset(null);
  };

  // Active Emergency Case resolution
  const emergencyCase = useMemo(() => {
    return emergencyCases.find((c) => c.id === activeCaseId) || emergencyCases[0] || DEMO_EMERGENCY_CASE;
  }, [emergencyCases, activeCaseId]);

  // Computed Financial Metrics
  const totalAssetValue = useMemo(() => {
    return assets
      .filter((a) => !a.isInsurance && a.category !== 'loans_liabilities' && a.value > 0)
      .reduce((sum, a) => sum + a.value, 0);
  }, [assets]);

  const totalLiabilities = useMemo(() => {
    return assets
      .filter((a) => a.category === 'loans_liabilities' || a.value < 0)
      .reduce((sum, a) => sum + Math.abs(a.value), 0);
  }, [assets]);

  const netWorth = useMemo(() => {
    return Math.max(0, totalAssetValue - totalLiabilities);
  }, [totalAssetValue, totalLiabilities]);

  const totalInsuranceCoverage = useMemo(() => {
    return assets
      .filter((a) => a.isInsurance && (a.insuranceCoverage || 0) > 0)
      .reduce((sum, a) => sum + (a.insuranceCoverage || 0), 0);
  }, [assets]);

  const organizedAssetsCount = useMemo(() => {
    return assets.filter((a) => a.source !== 'Needs confirmation').length;
  }, [assets]);

  const nomineeCoveragePercentage = useMemo(() => {
    const eligibleAssets = assets.filter((a) => a.category !== 'loans_liabilities');
    if (eligibleAssets.length === 0) return 0;
    const verifiedCount = eligibleAssets.filter((a) => a.nomineeStatus === 'Verified').length;
    return Math.round((verifiedCount / eligibleAssets.length) * 100);
  }, [assets]);

  const protectedDocumentsCount = useMemo(() => {
    return documents.filter((d) => d.status === 'Document Processed').length;
  }, [documents]);

  // Dynamic Family Readiness Score
  const readinessScore = useMemo(() => {
    let score = 78; // Base benchmark
    const resolvedPoints = readinessActions
      .filter((a) => a.isResolved)
      .reduce((sum, a) => sum + a.points, 0);

    const addedAssetsBonus = Math.max(0, assets.length - INITIAL_ASSETS.length) * 2;
    const verifiedNomineesBonus = assets.filter((a) => a.nomineeStatus === 'Verified').length * 2;

    const calculated = Math.min(99, score + resolvedPoints + addedAssetsBonus + (verifiedNomineesBonus - 8));
    return Math.max(50, calculated);
  }, [readinessActions, assets]);

  // Dynamic Readiness Category Breakdown
  const readinessBreakdown = useMemo(() => {
    const verifiedRatio = nomineeCoveragePercentage;
    const assetsRatio = Math.min(100, Math.round((organizedAssetsCount / Math.max(1, assets.length)) * 100));
    const docRatio = Math.min(100, Math.round((protectedDocumentsCount / Math.max(1, documents.length)) * 100));
    const instCount = familyPlan.instructions.length;
    const instructionsRatio = Math.min(100, Math.round((instCount / 4) * 100));
    const proActive = professionals.filter((p) => p.status === 'Active').length > 0;
    const proResolved = readinessActions.find((a) => a.id === 'act-4')?.isResolved;
    const proRatio = proActive || proResolved ? 85 : 50;
    const emergencyRatio = Math.min(100, 65 + (familyPlan.emergencyAccessTiers.length >= 3 ? 15 : 0));

    return INITIAL_READINESS_BREAKDOWN.map((cat) => {
      if (cat.category === 'Nominee Readiness') {
        const val = Math.min(100, Math.max(60, verifiedRatio));
        return { ...cat, percentage: val, score: val };
      }
      if (cat.category === 'Assets Organized') {
        return { ...cat, percentage: assetsRatio, score: assetsRatio };
      }
      if (cat.category === 'Document Readiness') {
        return { ...cat, percentage: docRatio, score: docRatio };
      }
      if (cat.category === 'Family Instructions') {
        return { ...cat, percentage: instructionsRatio, score: instructionsRatio };
      }
      if (cat.category === 'Professional Readiness') {
        return { ...cat, percentage: proRatio, score: proRatio };
      }
      if (cat.category === 'Emergency Preparedness') {
        return { ...cat, percentage: emergencyRatio, score: emergencyRatio };
      }
      return cat;
    });
  }, [nomineeCoveragePercentage, organizedAssetsCount, assets.length, protectedDocumentsCount, documents.length, familyPlan, professionals, readinessActions]);

  // Mutations
  const addAsset = (assetData: Omit<Asset, 'id' | 'documentsCount' | 'lastReviewedDate'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      documentsCount: 1,
      lastReviewedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setAssets((prev) => [newAsset, ...prev]);
    showToast('Asset Added Successfully', `${newAsset.name} catalogued with readiness sync.`, 'success');
  };

  const updateAsset = (assetId: string, updatedData: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((ast) => (ast.id === assetId ? { ...ast, ...updatedData, lastReviewedDate: 'Today' } : ast))
    );
    showToast('Asset Updated', 'Asset details and valuations recalculated.', 'info');
  };

  const archiveAsset = (assetId: string) => {
    const assetToRemove = assets.find((a) => a.id === assetId);
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    showToast('Asset Archived', `${assetToRemove?.name || 'Asset'} removed from active inventory.`, 'info');
  };

  const updateNomineeStatus = (assetId: string, status: Asset['nomineeStatus'], nominees: Asset['nominees']) => {
    setAssets((prev) =>
      prev.map((ast) => (ast.id === assetId ? { ...ast, nomineeStatus: status, nominees, source: 'Document verified' } : ast))
    );

    if (status === 'Verified') {
      setReadinessActions((prev) =>
        prev.map((act) => (act.targetId === assetId ? { ...act, isResolved: true } : act))
      );
      showToast('Nominee Status Verified', 'Nominee information recorded and readiness score updated (+8 pts).', 'success');
    } else {
      showToast('Nominee Allocation Saved', 'Beneficiary split updated.', 'info');
    }
  };

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id' | 'avatarColor'>) => {
    const colors = [
      'from-teal-500 to-emerald-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-amber-500 to-orange-600'
    ];
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam-${Date.now()}`,
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    showToast('Family Member Added', `${newMember.name} added as ${newMember.role}.`, 'success');
  };

  const uploadDocument = (docData: Omit<VaultDocument, 'id' | 'uploadDate' | 'status'>) => {
    const newDoc: VaultDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Document Processed',
      extractedData: {
        institutionProvider: 'Extracted via simulated AI parser',
        documentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        confidenceScore: 98,
        notes: 'Document organized, categorized, and linked to asset inventory.'
      }
    };
    setDocuments((prev) => [newDoc, ...prev]);

    if (docData.category === 'Property' || docData.linkedAssetId === 'ast-6') {
      resolveActionItem('act-3');
    }

    showToast('Document Categorized', `${newDoc.name} processed and secured in vault.`, 'success');
  };

  const archiveDocument = (docId: string) => {
    const docToRemove = documents.find((d) => d.id === docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast('Document Archived', `${docToRemove?.name || 'Document'} removed from vault.`, 'info');
  };

  const resolveActionItem = (actionId: string) => {
    setReadinessActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, isResolved: true } : act))
    );
    showToast('Action Completed', 'Readiness score updated with verified record.', 'success');
  };

  const addFamilyInstruction = (
    title: string,
    text: string,
    priority: 'High' | 'Medium' | 'Low',
    targetContact: string
  ) => {
    const newInst = {
      id: `inst-${Date.now()}`,
      title,
      text,
      priority,
      targetContact
    };
    setFamilyPlan((prev) => ({
      ...prev,
      instructions: [newInst, ...prev.instructions],
      completionPercentage: Math.min(100, prev.completionPercentage + 5)
    }));
    showToast('Instruction Recorded', 'New continuity directive saved.', 'success');
  };

  const updateFamilyResponsibility = (field: keyof FamilyPlan['responsibilities'], value: string) => {
    setFamilyPlan((prev) => ({
      ...prev,
      responsibilities: {
        ...prev.responsibilities,
        [field]: value
      }
    }));
    showToast('Responsibility Updated', 'Designated family leader saved.', 'info');
  };

  const updateEmergencyContact = (tier: 'primary' | 'secondary', name: string, role: string, phone: string) => {
    setFamilyPlan((prev) => ({
      ...prev,
      emergencyContacts: {
        ...prev.emergencyContacts,
        [tier]: { name, role, phone }
      }
    }));
    showToast('Emergency Contact Updated', `${name} designated as ${tier} contact.`, 'success');
  };

  const completeClaimStep = (claimId: string, stepId: string) => {
    setClaims((prev) =>
      prev.map((cl) => {
        if (cl.id !== claimId) return cl;
        const updatedSteps = cl.steps.map((st) =>
          st.id === stepId ? { ...st, status: 'Complete' as const } : st
        );
        const completeCount = updatedSteps.filter((s) => s.status === 'Complete').length;
        const newProgress = Math.round((completeCount / updatedSteps.length) * 100);
        const hasActionReq = updatedSteps.some((s) => s.status === 'Action Required');
        const newStatus = newProgress === 100 ? 'Payout Completed' : hasActionReq ? 'Missing Document' : 'Documents Submitted';

        return {
          ...cl,
          steps: updatedSteps,
          progressPercentage: newProgress,
          status: newStatus,
          activityLog: [
            {
              timestamp: 'Just now',
              author: 'Arjun Sharma',
              message: `Step "${updatedSteps.find((s) => s.id === stepId)?.title}" marked complete.`
            },
            ...cl.activityLog
          ]
        };
      })
    );

    setEmergencyCases((prev) =>
      prev.map((c) => (c.id === activeCaseId ? { ...c, actionRequiredCount: Math.max(0, c.actionRequiredCount - 1) } : c))
    );

    showToast('Claim Step Updated', 'Institutional claim progress updated.', 'success');
  };

  const assignProfessional = (proId: string, caseId: string) => {
    setProfessionals((prev) =>
      prev.map((pro) => (pro.id === proId ? { ...pro, status: 'Active', assignedCaseId: caseId } : pro))
    );
    resolveActionItem('act-4');
    showToast('Professional Assigned', 'Professional linked to family continuity network.', 'success');
  };

  const startNewEmergencyCase = (deceasedName: string, relationship: string, knownAssetIds: string[]) => {
    const newCaseId = `case-${deceasedName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const selectedAssets = assets.filter((a) => knownAssetIds.includes(a.id));
    const totalVal = selectedAssets.reduce((sum, a) => sum + (a.value > 0 ? a.value : 0), 0);

    const newCase: EmergencyCase = {
      id: newCaseId,
      deceasedName,
      relationship,
      status: 'Active',
      dateReported: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      knownAssetsValue: totalVal || 2450000,
      potentialClaimsCount: selectedAssets.length || 3,
      inProgressCount: 1,
      completedCount: 0,
      actionRequiredCount: 1,
      milestones: [
        { id: 1, title: 'Case Registration & Member Verification', status: 'Complete', detail: 'Deceased details & legal heir hierarchy recorded.' },
        { id: 2, title: 'Death Certificate & Identification Vault', status: 'In Progress', detail: 'Municipal death certificate indexing in progress.' },
        { id: 3, title: 'Asset Inventory & Institution Mapping', status: 'Pending', detail: 'Mapping institutional holdings for settlement.' },
        { id: 4, title: 'Claim Filing & Nominee Directives', status: 'Pending', detail: 'Institutional settlement packets generation.' },
        { id: 5, title: 'Estate Transmission & Settlement Finalization', status: 'Pending', detail: 'Final disbursement into designated beneficiary accounts.' }
      ]
    };

    setEmergencyCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCaseId);
    showToast('Emergency Case Initialized', `Guided recovery case opened for ${deceasedName}.`, 'success');
    navigate('emergency');
  };

  const resetDemo = () => {
    localStorage.removeItem(`${STORAGE_KEY}_family`);
    localStorage.removeItem(`${STORAGE_KEY}_assets`);
    localStorage.removeItem(`${STORAGE_KEY}_docs`);
    localStorage.removeItem(`${STORAGE_KEY}_plan`);
    localStorage.removeItem(`${STORAGE_KEY}_actions`);
    localStorage.removeItem(`${STORAGE_KEY}_emergency_cases`);
    localStorage.removeItem(`${STORAGE_KEY}_active_case_id`);
    localStorage.removeItem(`${STORAGE_KEY}_claims`);
    localStorage.removeItem(`${STORAGE_KEY}_pros`);

    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setAssets(INITIAL_ASSETS);
    setDocuments(INITIAL_DOCUMENTS);
    setFamilyPlan(INITIAL_FAMILY_PLAN);
    setReadinessActions(INITIAL_READINESS_ACTIONS);
    setEmergencyCases([DEMO_EMERGENCY_CASE]);
    setActiveCaseId(DEMO_EMERGENCY_CASE.id);
    setClaims(INITIAL_CLAIMS);
    setProfessionals(INITIAL_PROFESSIONALS);
    setSelectedAssetId(null);
    setEditingAsset(null);
    setSelectedClaimId('claim-lic-01');
    setSelectedDocId(null);
    setSelectedMemberId(null);
    setSelectedProfessionalId(null);
    setActiveModal(null);
    setIsVaarisGuideOpen(false);
    setActiveInvestorStep(1);

    showToast('Demo Benchmark Reset', 'All data restored to 78% Readiness initial state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        user,
        familyMembers,
        assets,
        documents,
        familyPlan,
        readinessActions,
        emergencyCases,
        emergencyCase,
        activeCaseId,
        claims,
        professionals,
        selectedAssetId,
        setSelectedAssetId,
        editingAsset,
        setEditingAsset,
        selectedClaimId,
        setSelectedClaimId,
        selectedDocId,
        setSelectedDocId,
        selectedMemberId,
        setSelectedMemberId,
        selectedProfessionalId,
        setSelectedProfessionalId,
        activeModal,
        openModal,
        closeModal,
        isVaarisGuideOpen,
        setIsVaarisGuideOpen,
        activeInvestorStep,
        setActiveInvestorStep,
        totalAssetValue,
        totalLiabilities,
        netWorth,
        totalInsuranceCoverage,
        organizedAssetsCount,
        nomineeCoveragePercentage,
        protectedDocumentsCount,
        readinessScore,
        readinessBreakdown,
        addAsset,
        updateAsset,
        archiveAsset,
        updateNomineeStatus,
        addFamilyMember,
        uploadDocument,
        archiveDocument,
        resolveActionItem,
        addFamilyInstruction,
        updateFamilyResponsibility,
        updateEmergencyContact,
        completeClaimStep,
        assignProfessional,
        startNewEmergencyCase,
        setActiveCaseId,
        toasts,
        showToast,
        removeToast,
        resetDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
