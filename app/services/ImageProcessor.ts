/**
 * Image Processor Service
 * Handles image processing using Sharp library
 */

import sharp from "sharp";

export interface ProcessImageOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: "webp" | "jpeg" | "png";
}

const DEFAULT_OPTIONS: ProcessImageOptions = {
  quality: 80,
  maxWidth: 1200,
  maxHeight: 1200,
  format: "webp",
};

/**
 * Process image buffer with Sharp
 */
export async function processImage(
  buffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let pipeline = sharp(buffer);

  // Resize if dimensions provided
  if (opts.maxWidth || opts.maxHeight) {
    pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to specified format
  switch (opts.format) {
    case "webp":
      pipeline = pipeline.webp({ quality: opts.quality });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: opts.quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality: opts.quality });
      break;
  }

  return pipeline.toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}

/**
 * Check if mime type is an image
 */
export function isImageMimeType(mimeType: string): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return allowedTypes.includes(mimeType);
}

/**
 * Generate thumbnail from buffer
 */
export async function generateThumbnail(
  buffer: Buffer,
  width: number = 200,
  height: number = 200
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, height, { fit: "cover" })
    .webp({ quality: 60 })
    .toBuffer();
}
