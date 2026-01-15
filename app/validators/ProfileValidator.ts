/**
 * Profile Validation Schemas
 * Schemas for ProfileController
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
  phone: z.string().nullish().refine(
    (val) => !val || /^(\+62|62|0)[0-9]{9,12}$/.test(val),
    'Invalid phone number format'
  ),
  avatar: z.string().nullish(),
});

/**
 * Delete users schema (admin only)
 * Used by: ProfileController.deleteUsers
 */
export const deleteUsersSchema = z.object({
  ids: z.array(z.string()).min(1, 'Select at least 1 user'),
});
