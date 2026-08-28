import { api } from './api';
import type { FamilyPlan, EmergencyCase, Claim } from '../types';

export const continuityService = {
  async getContinuityPlan(familyId: string): Promise<FamilyPlan> {
    return api.get<FamilyPlan>(`/families/${familyId}/continuity`);
  },

  async updateContinuityPlan(familyId: string, plan: Partial<FamilyPlan>): Promise<FamilyPlan> {
    return api.put<FamilyPlan>(`/families/${familyId}/continuity`, plan);
  },

  async getEmergencyCases(familyId: string): Promise<EmergencyCase[]> {
    return api.get<EmergencyCase[]>(`/families/${familyId}/continuity/emergency-cases`);
  },

  async createEmergencyCase(
    familyId: string,
    data: { deceasedName: string; relationship: string; knownAssetsValue?: number },
  ): Promise<EmergencyCase> {
    return api.post<EmergencyCase>(`/families/${familyId}/continuity/emergency-cases`, data);
  },

  async getClaims(familyId: string): Promise<Claim[]> {
    return api.get<Claim[]>(`/families/${familyId}/continuity/claims`);
  },

  async completeClaimStep(familyId: string, claimId: string, stepId: string): Promise<Claim> {
    return api.patch<Claim>(`/families/${familyId}/continuity/claims/${claimId}/step`, { stepId });
  },
};
