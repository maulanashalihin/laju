/**
 * S3 Validation Schemas
 * Schemas for S3Controller
 */

import { z } from 'zod';

/**
 * Signed URL request schema
 * Used by: S3Controller.getSignedUrl
 */
export const signedUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z.string().min(1, 'Content type is required'),
});
