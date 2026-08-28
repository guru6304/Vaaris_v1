import { api } from './api';

export interface FamilyWorkspace {
  id: string;
  name: string;
  createdById: string;
  myRole?: string;
  myStatus?: string;
  createdAt: string;
  members?: any[];
  accessList?: any[];
}

export interface UserFamilySummary {
  familyId: string;
  familyName: string;
  role: string;
  status: string;
  grantedAt: string;
  isCreator: boolean;
  memberCount: number;
  totalAccessUsers: number;
}

export const familyService = {
  async getUserFamilies(): Promise<UserFamilySummary[]> {
    return api.get<UserFamilySummary[]>('/families');
  },

  async getFamilyById(familyId: string): Promise<FamilyWorkspace> {
    return api.get<FamilyWorkspace>(`/families/${familyId}`);
  },

  async createFamily(name: string): Promise<FamilyWorkspace> {
    return api.post<FamilyWorkspace>('/families', { name });
  },

  async updateFamily(familyId: string, name: string): Promise<FamilyWorkspace> {
    return api.patch<FamilyWorkspace>(`/families/${familyId}`, { name });
  },

  async getMembers(familyId: string): Promise<any[]> {
    return api.get<any[]>(`/families/${familyId}/members`);
  },

  async addMember(familyId: string, memberData: {
    name: string;
    relationship: string;
    role?: string;
    age?: number;
    phone?: string;
    email?: string;
    isEmergencyContact?: boolean;
    isPrimaryContact?: boolean;
    notes?: string;
  }): Promise<any> {
    return api.post<any>(`/families/${familyId}/members`, memberData);
  },

  async grantAccess(familyId: string, targetUserId: string, role: string): Promise<any> {
    return api.post<any>(`/families/${familyId}/access`, { targetUserId, role });
  },
};
