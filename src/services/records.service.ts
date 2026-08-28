import { api } from './api';
import type { Asset } from '../types';

export const recordsService = {
  async getRecords(familyId: string): Promise<Asset[]> {
    return api.get<Asset[]>(`/families/${familyId}/records`);
  },

  async getRecordById(familyId: string, id: string): Promise<Asset> {
    return api.get<Asset>(`/families/${familyId}/records/${id}`);
  },

  async createRecord(familyId: string, record: Omit<Asset, 'id' | 'documentsCount' | 'lastReviewedDate'>): Promise<Asset> {
    return api.post<Asset>(`/families/${familyId}/records`, record);
  },

  async updateRecord(familyId: string, id: string, record: Partial<Asset>): Promise<Asset> {
    return api.patch<Asset>(`/families/${familyId}/records/${id}`, record);
  },

  async deleteRecord(familyId: string, id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/families/${familyId}/records/${id}`);
  },

  async updateNominees(
    familyId: string,
    id: string,
    status: Asset['nomineeStatus'],
    nominees: Asset['nominees'],
  ): Promise<Asset> {
    return api.put<Asset>(`/families/${familyId}/records/${id}/nominees`, {
      status,
      nominees,
    });
  },
};
