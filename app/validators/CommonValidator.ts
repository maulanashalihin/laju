/**
 * Common Validator - Reusable Field Schemas
 * Building blocks untuk compose validation schemas
 */

import { z } from 'zod';

/**
 * Reusable field schemas
 * Gunakan ini untuk compose schema yang lebih kompleks
 */
export const field = {
  // Email validation (auto lowercase)
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .toLowerCase(),

  // Password validation (min 8 chars, must contain number)
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),

  // Phone number (Indonesian format)
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Format nomor telepon tidak valid'),

  // Name validation
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),

  // UUID validation
  uuid: z.string().uuid('UUID tidak valid'),

  // URL validation
  url: z.string().url('Format URL tidak valid'),

  // Positive integer
  positiveInt: z.number().int().positive('Harus berupa angka positif'),

  // Date string (ISO format)
  dateString: z.string().datetime('Format tanggal tidak valid'),

  // Boolean
  boolean: z.boolean(),

  // Required string (generic)
  requiredString: (fieldName: string, minLength = 1) =>
    z
      .string()
      .min(minLength, `${fieldName} minimal ${minLength} karakter`)
      .trim(),

  // Optional string
  optionalString: z.string().optional(),

  // Slug (URL-friendly string)
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
};

/**
 * Pagination schema factory
 * @param maxLimit - Maximum items per page (default: 100)
 */
export function paginationSchema(maxLimit = 100) {
  return z.object({
    page: z
      .number()
      .int()
      .positive()
      .default(1)
      .or(z.string().transform((val) => parseInt(val) || 1)),
    limit: z
      .number()
      .int()
      .positive()
      .max(maxLimit, `Limit maksimal ${maxLimit}`)
      .default(10)
      .or(z.string().transform((val) => parseInt(val) || 10)),
  });
}

/**
 * Search/Filter schema
 */
export const searchSchema = z.object({
  q: z.string().optional(),
  sort_by: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * ID parameter validation
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, 'ID tidak valid'),
});

/**
 * File upload validation
 */
export function fileUploadSchema(options?: {
  maxSize?: number;
  allowedTypes?: string[];
}) {
  const maxSize = options?.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options?.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  return z.object({
    file_name: z.string().min(1, 'Nama file wajib diisi'),
    file_size: z
      .number()
      .max(maxSize, `Ukuran file maksimal ${maxSize / 1024 / 1024}MB`),
    file_type: z.enum(allowedTypes as [string, ...string[]]),
  });
}

/**
 * Password confirmation helper
 */
export function withPasswordConfirmation(schema: z.ZodObject<any>) {
  return schema
    .extend({
      password_confirmation: z.string(),
    })
    .refine((data: any) => data.password === data.password_confirmation, {
      message: 'Konfirmasi password tidak cocok',
      path: ['password_confirmation'],
    });
}

/**
 * Common error messages
 */
export const errorMessages = {
  required: (field: string) => `${field} wajib diisi`,
  invalid: (field: string) => `${field} tidak valid`,
  minLength: (field: string, min: number) =>
    `${field} minimal ${min} karakter`,
  maxLength: (field: string, max: number) =>
    `${field} maksimal ${max} karakter`,
  email: 'Format email tidak valid',
  phone: 'Format nomor telepon tidak valid',
  password: 'Password minimal 8 karakter dan harus mengandung angka',
  passwordMismatch: 'Konfirmasi password tidak cocok',
};
