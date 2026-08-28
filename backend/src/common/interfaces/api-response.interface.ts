export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  pagination?: ApiPagination;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | string[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta: ApiMeta;
}
