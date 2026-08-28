import { api } from './api';
import type { VaultDocument } from '../types';

export const documentsService = {
  async getDocuments(familyId: string): Promise<VaultDocument[]> {
    return api.get<VaultDocument[]>(`/families/${familyId}/documents`);
  },

  async getDocumentById(familyId: string, id: string): Promise<VaultDocument> {
    return api.get<VaultDocument>(`/families/${familyId}/documents/${id}`);
  },

  async createDocument(
    familyId: string,
    doc: Omit<VaultDocument, 'id' | 'uploadDate' | 'status'>,
  ): Promise<VaultDocument> {
    return api.post<VaultDocument>(`/families/${familyId}/documents`, doc);
  },

  async deleteDocument(familyId: string, id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/families/${familyId}/documents/${id}`);
  },
};
