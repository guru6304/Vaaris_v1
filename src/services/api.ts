/**
 * VAARIS Centralized API Client
 * Handles base URL configuration, token injection, token refresh rotation, and standardized error extraction.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private getAccessToken(): string | null {
    return localStorage.getItem('vaaris_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('vaaris_refresh_token');
  }

  public setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('vaaris_access_token', accessToken);
    localStorage.setItem('vaaris_refresh_token', refreshToken);
  }

  public clearTokens() {
    localStorage.removeItem('vaaris_access_token');
    localStorage.removeItem('vaaris_refresh_token');
  }

  private onTokenRefreshed(newToken: string) {
    this.refreshSubscribers.forEach((callback) => callback(newToken));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const json: ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }> =
        await response.json();

      if (json.success && json.data?.tokens) {
        this.setTokens(json.data.tokens.accessToken, json.data.tokens.refreshToken);
        return json.data.tokens.accessToken;
      }

      this.clearTokens();
      return null;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

      // Handle 401 Unauthorized token refresh
      if (
        response.status === 401 &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/register') &&
        !endpoint.includes('/auth/refresh')
      ) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, { ...options, headers });
          } else {
            throw new Error('Session expired. Please log in again.');
          }
        } else {
          // Wait for active refresh
          const retryToken = await new Promise<string>((resolve) => {
            this.addRefreshSubscriber((t) => resolve(t));
          });
          headers['Authorization'] = `Bearer ${retryToken}`;
          response = await fetch(url, { ...options, headers });
        }
      }

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || json.success === false) {
        const message = json.error?.message || `Request failed with status ${response.status}`;
        const error = new Error(message);
        (error as any).code = json.error?.code;
        (error as any).status = response.status;
        throw error;
      }

      return json.data;
  }

  public get<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
