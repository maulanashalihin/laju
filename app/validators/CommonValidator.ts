/**
 * Common Validator - Reusable Field Schemas
 * Building blocks for composing validation schemas
 */

import { z } from 'zod';

/**
 * Reusable field schemas
 * Use these to compose more complex schemas
 */
export const field = {
  // Email validation (auto lowercase)
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase(),

  // Password validation (min 8 chars, must contain number)
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),

  // Phone number (Indonesian format)
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Invalid phone number format'),

  // Name validation
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),

  // UUID validation
  uuid: z.string().uuid('Invalid UUID'),

  // URL validation
  url: z.string().url('Invalid URL format'),

  // Positive integer
  positiveInt: z.number().int().positive('Must be a positive number'),

  // Date string (ISO format)
  dateString: z.string().datetime('Invalid date format'),

  // Boolean
  boolean: z.boolean(),

  // Required string (generic)
  requiredString: (fieldName: string, minLength = 1) =>
    z
      .string()
      .min(minLength, `${fieldName} must be at least ${minLength} characters`)
      .trim(),

  // Optional string
  optionalString: z.string().optional(),

  // Slug (URL-friendly string)
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
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
      .max(maxLimit, `Maximum limit is ${maxLimit}`)
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
    .refine((val) => !isNaN(val) && val > 0, 'Invalid ID'),
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
    file_name: z.string().min(1, 'Filename is required'),
    file_size: z
      .number()
      .max(maxSize, `Maximum file size is ${maxSize / 1024 / 1024}MB`),
    file_type: z.enum(allowedTypes as [string, ...string[]]),
  });
}

/**
 * Password confirmation helper
 */
export function withPasswordConfirmation<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  return schema
    .extend({
      password_confirmation: z.string(),
    })
    .refine((data: unknown) => {
      const typed = data as { password?: string; password_confirmation?: string };
      return typed.password === typed.password_confirmation;
    }, {
      message: 'Password confirmation does not match',
      path: ['password_confirmation'],
    });
}

/**
 * Common error messages
 */
export const errorMessages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `${field} is invalid`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  email: 'Invalid email format',
  phone: 'Invalid phone number format',
  password: 'Password must be at least 8 characters and contain a number',
  passwordMismatch: 'Password confirmation does not match',
};
