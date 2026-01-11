/**
 * Profile Validation Schemas
 * Schemas untuk ProfileController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Update profile schema
 * Used by: ProfileController.changeProfile
 */
export const updateProfileSchema = z.object({
  name: field.name,
  email: field.email,
  phone: field.phone.optional().or(z.literal('')),
});

/**
 * Delete users schema (admin only)
 * Used by: ProfileController.deleteUsers
 */
export const deleteUsersSchema = z.object({
  ids: z.array(z.string()).min(1, 'Pilih minimal 1 user'),
});
