import { api } from './api';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  families?: {
    familyId: string;
    familyName: string;
    role: string;
    status: string;
    isCreator: boolean;
  }[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface AuthResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}

export const authService = {
  async register(data: { email: string; password: string; fullName: string; phoneNumber?: string }): Promise<AuthResponseData> {
    const result = await api.post<AuthResponseData>('/auth/register', data);
    if (result.tokens) {
      api.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    }
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponseData> {
    const result = await api.post<AuthResponseData>('/auth/login', data);
    if (result.tokens) {
      api.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    }
    return result;
  },

  async getMe(): Promise<AuthUser> {
    return api.get<AuthUser>('/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      api.clearTokens();
    }
  },
};
