import { api } from './api';
import type { ReadinessBreakdown, ReadinessActionItem } from '../types';

export interface DashboardSummary {
  familyId: string;
  familyName: string;
  metrics: {
    totalAssetValue: number;
    totalLiabilities: number;
    netWorth: number;
    totalInsuranceCoverage: number;
    organizedAssetsCount: number;
    nomineeCoveragePercentage: number;
    protectedDocumentsCount: number;
    readinessScore: number;
  };
  readinessBreakdown: ReadinessBreakdown[];
  attentionItems: ReadinessActionItem[];
}

export const dashboardService = {
  async getDashboardSummary(familyId: string): Promise<DashboardSummary> {
    return api.get<DashboardSummary>(`/families/${familyId}/dashboard`);
  },
};
