/**
 * Auth Validation Schemas
 * Schemas for LoginController, RegisterController, PasswordController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

interface EmailPhoneData {
  email?: string;
  phone?: string;
}

/**
 * Login schema
 * Used by: LoginController.processLogin
 */
export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(
  (data: EmailPhoneData) => data.email || data.phone,
  {
    message: 'Email or phone number is required',
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
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Forgot password schema
 * Used by: PasswordController.sendResetPassword
 */
export const forgotPasswordSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
}).refine(
  (data: EmailPhoneData) => data.email || data.phone,
  {
    message: 'Email or phone number is required',
    path: ['email'],
  }
);

/**
 * Reset password schema
 * Used by: PasswordController.resetPassword
 */
export const resetPasswordSchema = z.object({
  id: z.string().min(1, 'Invalid token'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Change password schema
 * Used by: PasswordController.changePassword
 */
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
});
