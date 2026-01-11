/**
 * S3 Validation Schemas
 * Schemas untuk S3Controller
 */

import { z } from 'zod';

/**
 * Signed URL request schema
 * Used by: S3Controller.getSignedUrl
 */
export const signedUrlSchema = z.object({
  filename: z.string().min(1, 'Filename wajib diisi'),
  contentType: z.string().min(1, 'Content type wajib diisi'),
});
