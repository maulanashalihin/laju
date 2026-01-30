/**
 * File Validator Service
 * Handles file validation (mime type, size, extension)
 */

import path from "path";

// Mime type map for common file types
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".txt": "text/plain",
  ".csv": "text/csv",
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeInBytes?: number;
  allowedExtensions?: string[];
}

/**
 * Get mime type from filename
 */
export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * Validate file mime type
 */
export function validateMimeType(
  mimeType: string,
  allowedTypes: string[]
): ValidationResult {
  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}. Got: ${mimeType}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(
  sizeInBytes: number,
  maxSizeInBytes: number
): ValidationResult {
  if (sizeInBytes > maxSizeInBytes) {
    const maxMB = (maxSizeInBytes / 1024 / 1024).toFixed(2);
    const actualMB = (sizeInBytes / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxMB}MB. Got: ${actualMB}MB`,
    };
  }
  return { valid: true };
}

/**
 * Validate file extension
 */
export function validateExtension(
  filename: string,
  allowedExtensions: string[]
): ValidationResult {
  const ext = path.extname(filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExtensions.join(", ")}. Got: ${ext}`,
    };
  }
  return { valid: true };
}

/**
 * Comprehensive file validation
 */
export function validateFile(
  filename: string,
  mimeType: string,
  sizeInBytes: number,
  options: FileValidationOptions
): ValidationResult {
  // Check mime type
  if (options.allowedMimeTypes) {
    const mimeResult = validateMimeType(mimeType, options.allowedMimeTypes);
    if (!mimeResult.valid) return mimeResult;
  }

  // Check file size
  if (options.maxSizeInBytes) {
    const sizeResult = validateFileSize(sizeInBytes, options.maxSizeInBytes);
    if (!sizeResult.valid) return sizeResult;
  }

  // Check extension
  if (options.allowedExtensions) {
    const extResult = validateExtension(filename, options.allowedExtensions);
    if (!extResult.valid) return extResult;
  }

  return { valid: true };
}

// Predefined validation sets
export const ValidationSets = {
  images: {
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxSizeInBytes: 5 * 1024 * 1024, // 5MB
  },
  documents: {
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv"],
    maxSizeInBytes: 10 * 1024 * 1024, // 10MB
  },
};
