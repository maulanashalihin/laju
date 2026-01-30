/**
 * Upload Controller
 * Handles file upload endpoints using UploadService
 */

import { Response, Request } from "../../type";
import { uploadFile, UploadResult } from "../services/UploadService";
import { isImageMimeType } from "../services/ImageProcessor";

interface MultipartField {
  name: string;
  mime_type: string;
  file: {
    stream: NodeJS.ReadableStream;
    name: string;
  };
}

class UploadController {
  /**
   * Upload Image with Processing
   * - Validates image type
   * - Processes with Sharp (resize, convert to WebP)
   * - Uploads to storage
   * - Saves metadata to database
   */
  public async uploadImage(request: Request, response: Response) {
    try {
      if (!request.user) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const userId = request.user.id;
      let uploadResult: UploadResult | undefined;

      await request.multipart(async (field: unknown) => {
        const multipartField = field as MultipartField;

        if (!multipartField?.file?.stream) {
          return;
        }

        console.log("Uploading image:", {
          name: multipartField.file.name,
          mime_type: multipartField.mime_type,
        });

        // Check if it's an image
        if (!isImageMimeType(multipartField.mime_type)) {
          uploadResult = {
            success: false,
            error: `Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.`,
          };
          return;
        }

        // Upload with image processing
        uploadResult = await uploadFile(
          multipartField.file.stream,
          multipartField.file.name,
          multipartField.mime_type,
          userId,
          {
            processImage: true,
            imageOptions: {
              quality: 80,
              maxWidth: 1200,
              maxHeight: 1200,
              format: "webp",
            },
          }
        );
      });

      // Return result
      if (!uploadResult) {
        return response.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      if (!uploadResult.success) {
        return response.status(400).json({
          success: false,
          error: uploadResult.error,
        });
      }

      return response.json({
        success: true,
        data: uploadResult.asset,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return response.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Upload File (Non-Image)
   * - Validates file type
   * - Uploads directly without processing
   * - Saves metadata to database
   */
  public async uploadFile(request: Request, response: Response) {
    try {
      if (!request.user) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const userId = request.user.id;
      let uploadResult: UploadResult | undefined;

      await request.multipart(async (field: unknown) => {
        const multipartField = field as MultipartField;

        if (!multipartField?.file?.stream) {
          return;
        }

        console.log("Uploading file:", {
          name: multipartField.file.name,
          mime_type: multipartField.mime_type,
        });

        // Upload without image processing
        uploadResult = await uploadFile(
          multipartField.file.stream,
          multipartField.file.name,
          multipartField.mime_type,
          userId,
          {
            processImage: false,
          }
        );
      });

      // Return result
      if (!uploadResult) {
        return response.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      if (!uploadResult.success) {
        return response.status(400).json({
          success: false,
          error: uploadResult.error,
        });
      }

      return response.json({
        success: true,
        data: uploadResult.asset,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return response.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export default new UploadController();
