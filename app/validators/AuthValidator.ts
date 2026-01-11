/**
 * Auth Validation Schemas
 * Schemas untuk LoginController, RegisterController, PasswordController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Login schema
 * Used by: LoginController.processLogin
 */
export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password wajib diisi'),
}).refine(
  (data: any) => data.email || data.phone,
  {
    message: 'Email atau nomor telepon wajib diisi',
    path: ['email'],
  }
);

/**
 * Register schema
 * Used by: RegisterController.processRegister
 */
export const registerSchema = z.object({
  name: field.name,
  email: field.email,
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

/**
 * Forgot password schema
 * Used by: PasswordController.sendResetPassword
 */
export const forgotPasswordSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
}).refine(
  (data: any) => data.email || data.phone,
  {
    message: 'Email atau nomor telepon wajib diisi',
    path: ['email'],
  }
);

/**
 * Reset password schema
 * Used by: PasswordController.resetPassword
 */
export const resetPasswordSchema = z.object({
  id: z.string().min(1, 'Token tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

/**
 * Change password schema
 * Used by: PasswordController.changePassword
 */
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
});
