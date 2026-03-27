/**
 * DTO (Data Transfer Object) Types
 * Common request/response DTOs for the application
 */

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

/**
 * User response (excludes sensitive fields)
 */
export interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  is_verified: number;
  membership_date: number | null;
  is_admin: number;
  created_at: number;
  updated_at: number;
}
