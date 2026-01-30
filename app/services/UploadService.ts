/**
 * Upload Service
 * Orchestrates file upload flow: validation → processing → storage → database
 */

import { processImage, isImageMimeType, ProcessImageOptions } from "./ImageProcessor";
import { validateFile, ValidationSets, ValidationResult } from "./FileValidator";
import { AssetRepository, CreateAssetData } from "../repositories/AssetRepository";
import { getPublicUrl, uploadBuffer } from "./LocalStorage";
import path from "path";

// Storage Service Selection:
// To switch between S3 and Local Storage, change the import below:
//
// Local Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";
//
// S3 Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/S3";

export interface UploadResult {
  success: boolean;
  asset?: {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
    mimeType: string;
  };
  error?: string;
}

export interface UploadOptions {
  processImage?: boolean;
  imageOptions?: ProcessImageOptions;
  validation?: {
    allowedMimeTypes?: string[];
    maxSizeInBytes?: number;
    allowedExtensions?: string[];
  };
}

const DEFAULT_IMAGE_OPTIONS: ProcessImageOptions = {
  quality: 80,
  maxWidth: 1200,
  maxHeight: 1200,
  format: "webp",
};

/**
 * Read stream to buffer
 */
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * Upload file with validation and optional image processing
 */
export async function uploadFile(
  fileStream: NodeJS.ReadableStream,
  filename: string,
  mimeType: string,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Read stream to buffer
    const buffer = await streamToBuffer(fileStream);
    const size = buffer.length;

    // Validate file
    const validationOptions = options.validation ||
      (isImageMimeType(mimeType) ? ValidationSets.images : ValidationSets.documents);

    const validation = validateFile(filename, mimeType, size, validationOptions);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Process image if needed
    let processedBuffer = buffer;
    let processedMimeType = mimeType;
    let processedExt = path.extname(filename);

    if (options.processImage && isImageMimeType(mimeType)) {
      const imageOptions = { ...DEFAULT_IMAGE_OPTIONS, ...options.imageOptions };
      processedBuffer = await processImage(buffer, imageOptions);
      processedMimeType = "image/webp";
      processedExt = ".webp";
    }

    // Generate unique filename
    const { uuidv7 } = await import("uuidv7");
    const id = uuidv7();
    const storageKey = `${id}${processedExt}`;

    // Upload to storage
    await uploadBuffer(storageKey, processedBuffer, processedMimeType);

    // Get public URL
    const url = getPublicUrl(storageKey);

    // Save to database
    const assetData: CreateAssetData = {
      id,
      name: filename,
      type: isImageMimeType(mimeType) ? "image" : "document",
      url,
      mime_type: processedMimeType,
      size: processedBuffer.length,
      storage_key: storageKey,
      user_id: userId,
    };

    const asset = await AssetRepository.create(assetData);

    return {
      success: true,
      asset: {
        id: asset.id,
        url: asset.url,
        name: filename,
        type: asset.type,
        size: processedBuffer.length,
        mimeType: processedMimeType,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: Array<{
    stream: NodeJS.ReadableStream;
    filename: string;
    mimeType: string;
  }>,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile(
      file.stream,
      file.filename,
      file.mimeType,
      userId,
      options
    );
    results.push(result);
  }

  return results;
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(assetId: string): Promise<boolean> {
  try {
    const asset = await AssetRepository.findById(assetId);
    if (!asset) {
      return false;
    }

    // Delete from storage (implement based on your storage service)
    // await deleteFromStorage(asset.storage_key);

    // Delete from database
    await AssetRepository.delete(assetId);

    return true;
  } catch (error) {
    console.error("Delete upload error:", error);
    return false;
  }
}
