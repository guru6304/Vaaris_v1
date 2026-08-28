import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  Professional,
} from '../types';
import { INITIAL_FAMILY_MEMBERS, DEMO_USER } from '../data/familyData';
import { INITIAL_ASSETS } from '../data/assetData';
import { INITIAL_DOCUMENTS } from '../data/documentData';
import { INITIAL_FAMILY_PLAN } from '../data/familyPlanData';
import { INITIAL_READINESS_ACTIONS, INITIAL_READINESS_BREAKDOWN } from '../data/readinessData';
import { DEMO_EMERGENCY_CASE } from '../data/emergencyData';
import { INITIAL_CLAIMS } from '../data/claimData';
import { INITIAL_PROFESSIONALS } from '../data/professionalData';

import { authService } from '../services/auth.service';
import type { AuthUser } from '../services/auth.service';
import { familyService } from '../services/family.service';
import type { UserFamilySummary } from '../services/family.service';
import { recordsService } from '../services/records.service';
import { documentsService } from '../services/documents.service';
import { continuityService } from '../services/continuity.service';
import { dashboardService } from '../services/dashboard.service';

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

  // Authentication & Family Workspace State
  currentUser: AuthUser | null;
  userFamilies: UserFamilySummary[];
  activeFamilyId: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phoneNumber?: string }) => Promise<void>;
  logout: () => Promise<void>;
  switchFamily: (familyId: string) => Promise<void>;

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
  addAsset: (asset: Omit<Asset, 'id' | 'documentsCount' | 'lastReviewedDate'>) => Promise<void>;
  updateAsset: (assetId: string, updatedData: Partial<Asset>) => Promise<void>;
  archiveAsset: (assetId: string) => Promise<void>;
  updateNomineeStatus: (assetId: string, status: Asset['nomineeStatus'], nominees: Asset['nominees']) => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'avatarColor'>) => Promise<void>;
  uploadDocument: (doc: Omit<VaultDocument, 'id' | 'uploadDate' | 'status'>) => Promise<void>;
  archiveDocument: (docId: string) => Promise<void>;
  resolveActionItem: (actionId: string) => void;
  addFamilyInstruction: (title: string, text: string, priority: 'High' | 'Medium' | 'Low', targetContact: string) => Promise<void>;
  updateFamilyResponsibility: (field: keyof FamilyPlan['responsibilities'], value: string) => Promise<void>;
  updateEmergencyContact: (tier: 'primary' | 'secondary', name: string, role: string, phone: string) => Promise<void>;
  completeClaimStep: (claimId: string, stepId: string) => Promise<void>;
  assignProfessional: (proId: string, caseId: string) => void;
  startNewEmergencyCase: (deceasedName: string, relationship: string, knownAssetIds: string[]) => Promise<void>;
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

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userFamilies, setUserFamilies] = useState<UserFamilySummary[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(() => {
    return localStorage.getItem('vaaris_active_family_id');
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

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

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    [],
  );

  // Load Family Data from Backend
  const loadFamilyData = useCallback(async (familyId: string) => {
    try {
      const [records, docs, plan, cases, familyClaims, membersList, dashboardSummary] =
        await Promise.all([
          recordsService.getRecords(familyId).catch(() => null),
          documentsService.getDocuments(familyId).catch(() => null),
          continuityService.getContinuityPlan(familyId).catch(() => null),
          continuityService.getEmergencyCases(familyId).catch(() => null),
          continuityService.getClaims(familyId).catch(() => null),
          familyService.getMembers(familyId).catch(() => null),
          dashboardService.getDashboardSummary(familyId).catch(() => null),
        ]);

      if (records && records.length > 0) {
        setAssets(records);
      }
      if (docs && docs.length > 0) {
        setDocuments(docs);
      }
      if (plan) {
        setFamilyPlan(plan as any);
      }
      if (cases && cases.length > 0) {
        setEmergencyCases(cases as any);
        setActiveCaseId(cases[0].id);
      }
      if (familyClaims && familyClaims.length > 0) {
        setClaims(familyClaims as any);
      }
      if (membersList && membersList.length > 0) {
        const colors = [
          'from-teal-500 to-emerald-600',
          'from-blue-500 to-indigo-600',
          'from-purple-500 to-violet-600',
          'from-amber-500 to-orange-600',
        ];
        setFamilyMembers(
          membersList.map((m: any, idx: number) => ({
            ...m,
            avatarColor: colors[idx % colors.length],
          })),
        );
      }
      if (dashboardSummary && dashboardSummary.attentionItems) {
        setReadinessActions(dashboardSummary.attentionItems as any);
      }
    } catch {
      // Fallback to existing memory cache
    }
  }, []);

  // Initialize Authenticated Session on Mount
  useEffect(() => {
    const token = localStorage.getItem('vaaris_access_token');
    if (token) {
      authService
        .getMe()
        .then(async (userProfile) => {
          setCurrentUser(userProfile);
          const families = await familyService.getUserFamilies();
          setUserFamilies(families);
          if (families.length > 0) {
            const targetFamilyId = activeFamilyId || families[0].familyId;
            setActiveFamilyId(targetFamilyId);
            localStorage.setItem('vaaris_active_family_id', targetFamilyId);
            await loadFamilyData(targetFamilyId);
          }
        })
        .catch(() => {
          // Token invalid or expired
          setCurrentUser(null);
        });
    }
  }, [loadFamilyData, activeFamilyId]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') as RouteType;
      if (
        hash &&
        [
          'welcome',
          'dashboard',
          'family',
          'assets',
          'nominees',
          'documents',
          'family-plan',
          'readiness',
          'emergency',
          'claim-detail',
          'professionals',
          'settings',
        ].includes(hash)
      ) {
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

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string) => {
    const authData = await authService.login({ email, password });
    setCurrentUser(authData.user);
    const families = await familyService.getUserFamilies();
    setUserFamilies(families);
    if (families.length > 0) {
      const firstFamilyId = families[0].familyId;
      setActiveFamilyId(firstFamilyId);
      localStorage.setItem('vaaris_active_family_id', firstFamilyId);
      await loadFamilyData(firstFamilyId);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
  }) => {
    const authData = await authService.register(data);
    setCurrentUser(authData.user);
    // Create initial family workspace for the new user
    const newFamily = await familyService.createFamily(`${data.fullName}'s Family Estate`);
    setActiveFamilyId(newFamily.id);
    localStorage.setItem('vaaris_active_family_id', newFamily.id);
    const families = await familyService.getUserFamilies();
    setUserFamilies(families);
    await loadFamilyData(newFamily.id);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserFamilies([]);
    setActiveFamilyId(null);
    localStorage.removeItem('vaaris_active_family_id');
    showToast('Logged Out', 'Your session has ended.', 'info');
  };

  const switchFamily = async (familyId: string) => {
    setActiveFamilyId(familyId);
    localStorage.setItem('vaaris_active_family_id', familyId);
    await loadFamilyData(familyId);
    showToast('Workspace Switched', 'Family workspace synchronized.', 'info');
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
    let score = 78;
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
    const instCount = familyPlan.instructions ? familyPlan.instructions.length : 0;
    const instructionsRatio = Math.min(100, Math.round((instCount / 4) * 100));
    const proActive = professionals.filter((p) => p.status === 'Active').length > 0;
    const proResolved = readinessActions.find((a) => a.id === 'act-4')?.isResolved;
    const proRatio = proActive || proResolved ? 85 : 50;
    const emergencyRatio = Math.min(
      100,
      65 + (familyPlan.emergencyAccessTiers && familyPlan.emergencyAccessTiers.length >= 3 ? 15 : 0),
    );

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
  }, [
    nomineeCoveragePercentage,
    organizedAssetsCount,
    assets.length,
    protectedDocumentsCount,
    documents.length,
    familyPlan,
    professionals,
    readinessActions,
  ]);

  // Mutations
  const addAsset = async (assetData: Omit<Asset, 'id' | 'documentsCount' | 'lastReviewedDate'>) => {
    try {
      if (activeFamilyId) {
        const created = await recordsService.createRecord(activeFamilyId, assetData);
        setAssets((prev) => [created, ...prev]);
      } else {
        const newAsset: Asset = {
          ...assetData,
          id: `ast-${Date.now()}`,
          documentsCount: 1,
          lastReviewedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
        setAssets((prev) => [newAsset, ...prev]);
      }
      showToast('Asset Added Successfully', `${assetData.name} catalogued with readiness sync.`, 'success');
    } catch (err: any) {
      showToast('Save Failed', err.message || 'Could not save asset to database.', 'warning');
    }
  };

  const updateAsset = async (assetId: string, updatedData: Partial<Asset>) => {
    try {
      if (activeFamilyId) {
        const updated = await recordsService.updateRecord(activeFamilyId, assetId, updatedData);
        setAssets((prev) => prev.map((ast) => (ast.id === assetId ? updated : ast)));
      } else {
        setAssets((prev) =>
          prev.map((ast) => (ast.id === assetId ? { ...ast, ...updatedData, lastReviewedDate: 'Today' } : ast)),
        );
      }
      showToast('Asset Updated', 'Asset details and valuations recalculated.', 'info');
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Could not update record.', 'warning');
    }
  };

  const archiveAsset = async (assetId: string) => {
    try {
      if (activeFamilyId) {
        await recordsService.deleteRecord(activeFamilyId, assetId);
      }
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      showToast('Asset Archived', 'Removed from active inventory.', 'info');
    } catch (err: any) {
      showToast('Archive Failed', err.message || 'Could not delete record.', 'warning');
    }
  };

  const updateNomineeStatus = async (
    assetId: string,
    status: Asset['nomineeStatus'],
    nominees: Asset['nominees'],
  ) => {
    try {
      if (activeFamilyId) {
        const updated = await recordsService.updateNominees(activeFamilyId, assetId, status, nominees);
        setAssets((prev) =>
          prev.map((ast) => (ast.id === assetId ? { ...ast, nomineeStatus: updated.nomineeStatus, nominees: updated.nominees, source: updated.source } : ast)),
        );
      } else {
        setAssets((prev) =>
          prev.map((ast) => (ast.id === assetId ? { ...ast, nomineeStatus: status, nominees, source: 'Document verified' } : ast)),
        );
      }

      if (status === 'Verified') {
        setReadinessActions((prev) =>
          prev.map((act) => (act.targetId === assetId ? { ...act, isResolved: true } : act)),
        );
        showToast('Nominee Status Verified', 'Nominee information recorded and readiness score updated (+8 pts).', 'success');
      } else {
        showToast('Nominee Allocation Saved', 'Beneficiary split updated.', 'info');
      }
    } catch (err: any) {
      showToast('Nominee Update Failed', err.message || 'Could not update nominees.', 'warning');
    }
  };

  const addFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'avatarColor'>) => {
    const colors = [
      'from-teal-500 to-emerald-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-amber-500 to-orange-600',
    ];
    try {
      if (activeFamilyId) {
        const created = await familyService.addMember(activeFamilyId, memberData);
        setFamilyMembers((prev) => [
          ...prev,
          {
            ...created,
            avatarColor: colors[prev.length % colors.length],
          },
        ]);
      } else {
        const newMember: FamilyMember = {
          ...memberData,
          id: `fam-${Date.now()}`,
          avatarColor: colors[Math.floor(Math.random() * colors.length)],
        };
        setFamilyMembers((prev) => [...prev, newMember]);
      }
      showToast('Family Member Added', `${memberData.name} registered.`, 'success');
    } catch (err: any) {
      showToast('Add Member Failed', err.message || 'Could not add family member.', 'warning');
    }
  };

  const uploadDocument = async (docData: Omit<VaultDocument, 'id' | 'uploadDate' | 'status'>) => {
    try {
      if (activeFamilyId) {
        const created = await documentsService.createDocument(activeFamilyId, docData);
        setDocuments((prev) => [created, ...prev]);
      } else {
        const newDoc: VaultDocument = {
          ...docData,
          id: `doc-${Date.now()}`,
          uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Document Processed',
        };
        setDocuments((prev) => [newDoc, ...prev]);
      }
      showToast('Document Uploaded', `${docData.name} saved to secure vault.`, 'success');
    } catch (err: any) {
      showToast('Upload Failed', err.message || 'Could not save document metadata.', 'warning');
    }
  };

  const archiveDocument = async (docId: string) => {
    try {
      if (activeFamilyId) {
        await documentsService.deleteDocument(activeFamilyId, docId);
      }
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      showToast('Document Archived', 'Removed from family vault.', 'info');
    } catch (err: any) {
      showToast('Delete Failed', err.message || 'Could not delete document.', 'warning');
    }
  };

  const resolveActionItem = (actionId: string) => {
    setReadinessActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, isResolved: true } : act)),
    );
    showToast('Action Completed', 'Readiness metric updated.', 'success');
  };

  const addFamilyInstruction = async (
    title: string,
    text: string,
    priority: 'High' | 'Medium' | 'Low',
    targetContact: string,
  ) => {
    const newInstruction = {
      id: `ins-${Date.now()}`,
      title,
      text,
      priority,
      targetContact,
    };
    const updatedInstructions = [...familyPlan.instructions, newInstruction];
    const updatedPlan = { ...familyPlan, instructions: updatedInstructions };
    setFamilyPlan(updatedPlan);

    if (activeFamilyId) {
      await continuityService.updateContinuityPlan(activeFamilyId, { instructions: updatedInstructions }).catch(() => {});
    }
    showToast('Instruction Added', 'Continuity directive recorded.', 'success');
  };

  const updateFamilyResponsibility = async (
    field: keyof FamilyPlan['responsibilities'],
    value: string,
  ) => {
    const updatedResponsibilities = {
      ...familyPlan.responsibilities,
      [field]: value,
    };
    setFamilyPlan((prev) => ({
      ...prev,
      responsibilities: updatedResponsibilities,
    }));

    if (activeFamilyId) {
      await continuityService
        .updateContinuityPlan(activeFamilyId, { responsibilities: updatedResponsibilities })
        .catch(() => {});
    }
    showToast('Responsibility Updated', 'Assigned role saved to continuity plan.', 'info');
  };

  const updateEmergencyContact = async (
    tier: 'primary' | 'secondary',
    name: string,
    role: string,
    phone: string,
  ) => {
    const updatedContacts = {
      ...familyPlan.emergencyContacts,
      [tier]: {
        ...familyPlan.emergencyContacts[tier],
        name,
        role,
        phone,
      },
    };
    setFamilyPlan((prev) => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));

    if (activeFamilyId) {
      await continuityService
        .updateContinuityPlan(activeFamilyId, { emergencyContacts: updatedContacts })
        .catch(() => {});
    }
    showToast('Emergency Contact Saved', `${name} designated as ${tier} contact.`, 'success');
  };

  const completeClaimStep = async (claimId: string, stepId: string) => {
    try {
      if (activeFamilyId) {
        const updated = await continuityService.completeClaimStep(activeFamilyId, claimId, stepId);
        setClaims((prev) => prev.map((c) => (c.id === claimId ? (updated as any) : c)));
      } else {
        setClaims((prev) =>
          prev.map((c) => {
            if (c.id !== claimId) return c;
            const updatedSteps = c.steps.map((s) => (s.id === stepId ? { ...s, status: 'Complete' as const } : s));
            const completed = updatedSteps.filter((s) => s.status === 'Complete').length;
            const progressPercentage = Math.round((completed / updatedSteps.length) * 100);
            return {
              ...c,
              steps: updatedSteps,
              progressPercentage,
              status: progressPercentage === 100 ? 'Payout Completed' : 'Information Review',
            };
          }),
        );
      }
      showToast('Milestone Completed', 'Claim progress updated.', 'success');
    } catch (err: any) {
      showToast('Step Update Failed', err.message || 'Could not update claim step.', 'warning');
    }
  };

  const assignProfessional = (proId: string, caseId: string) => {
    const pro = professionals.find((p) => p.id === proId);
    setProfessionals((prev) =>
      prev.map((p) => (p.id === proId ? { ...p, assignedCaseId: caseId, status: 'Active' } : p)),
    );
    showToast('Advisor Assigned', `${pro?.name} linked to emergency case coordination.`, 'success');
  };

  const startNewEmergencyCase = async (
    deceasedName: string,
    relationship: string,
    _knownAssetIds: string[],
  ) => {
    try {
      if (activeFamilyId) {
        const newCase = await continuityService.createEmergencyCase(activeFamilyId, {
          deceasedName,
          relationship,
        });
        setEmergencyCases((prev) => [newCase as any, ...prev]);
        setActiveCaseId(newCase.id);
        const updatedClaims = await continuityService.getClaims(activeFamilyId);
        if (updatedClaims.length > 0) {
          setClaims(updatedClaims as any);
        }
      } else {
        const newCaseId = `case-${Date.now()}`;
        const newCase: EmergencyCase = {
          id: newCaseId,
          deceasedName,
          relationship,
          status: 'Active',
          dateReported: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          knownAssetsValue: 3500000,
          potentialClaimsCount: 1,
          inProgressCount: 1,
          completedCount: 0,
          actionRequiredCount: 1,
          milestones: [
            { id: 1, title: 'Case Registration & Scope', status: 'Complete', detail: 'Emergency record initiated.' },
            { id: 2, title: 'Document & Certificate Verification', status: 'In Progress', detail: 'Death certificate and legal heir documents.' },
            { id: 3, title: 'Claims Submission to Institutions', status: 'Pending', detail: 'Submissions to banking and insurance providers.' },
            { id: 4, title: 'Asset Settlement & Transfer', status: 'Pending', detail: 'Direct payout and asset re-registration.' },
          ],
        };
        setEmergencyCases((prev) => [newCase, ...prev]);
        setActiveCaseId(newCaseId);
      }
      showToast('Emergency Case Initialized', `Crisis respond workspace active for ${deceasedName}.`, 'warning');
    } catch (err: any) {
      showToast('Case Initialization Failed', err.message || 'Could not start emergency case.', 'warning');
    }
  };

  const resetDemo = () => {
    localStorage.removeItem('vaaris_access_token');
    localStorage.removeItem('vaaris_refresh_token');
    localStorage.removeItem('vaaris_active_family_id');
    setCurrentUser(null);
    setUserFamilies([]);
    setActiveFamilyId(null);
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setAssets(INITIAL_ASSETS);
    setDocuments(INITIAL_DOCUMENTS);
    setFamilyPlan(INITIAL_FAMILY_PLAN);
    setReadinessActions(INITIAL_READINESS_ACTIONS);
    setEmergencyCases([DEMO_EMERGENCY_CASE]);
    setActiveCaseId(DEMO_EMERGENCY_CASE.id);
    setClaims(INITIAL_CLAIMS);
    setProfessionals(INITIAL_PROFESSIONALS);
    showToast('Demo Reset Completed', 'All benchmarks restored.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        currentUser,
        userFamilies,
        activeFamilyId,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        switchFamily,
        user: DEMO_USER,
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
        resetDemo,
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
