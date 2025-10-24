import { getPublicUrl, getSignedUploadUrl } from "app/services/S3";
import { Request, Response } from "../../type"; 

class S3Controller {
  /**
   * Generate signed URL for file upload
   * POST /api/s3/signed-url
   */
  public async getSignedUrl(request: Request, response: Response) {
    try {
      const { filename, contentType } = await request.json();

      // Validate required fields
      if (!filename || !contentType) {
        return response.status(400).json({
          success: false,
          message: "Filename and content type are required",
        });
      }
 
     

  

      // Generate unique file key
      const fileKey = "assets/" + filename;

      // Generate signed URL
      const signedUrl = await getSignedUploadUrl(fileKey, contentType);
      const publicUrl = getPublicUrl(fileKey);

      return response.json({
        success: true,
        data: {
          signedUrl,
          publicUrl,
          fileKey,
          bucket: process.env.WASABI_BUCKET,
          expiresIn: 3600, // 1 hour
        },
      });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return response.status(500).json({
        success: false,
        message: "Failed to generate signed URL",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Generate signed URL specifically for product images
   * POST /api/s3/product-image-url
   */
  

  /**
   * Get public URL for existing file
   * GET /api/s3/public-url/:fileKey
   */
  public async getPublicUrl(request: Request, response: Response) {
    try {
      const { fileKey } = request.params;

      if (!fileKey) {
        return response.status(400).json({
          success: false,
          message: "File key is required",
        });
      }

      const publicUrl = getPublicUrl(fileKey);

      return response.json({
        success: true,
        data: {
          publicUrl,
          fileKey,
          bucket: process.env.WASABI_BUCKET,
        },
      });
    } catch (error) {
      console.error("Error getting public URL:", error);
      return response.status(500).json({
        success: false,
        message: "Failed to get public URL",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Health check for S3 service
   * GET /api/s3/health
   */
  public async health(request: Request, response: Response) {
    try {
      return response.json({
        success: true,
        message: "S3 service is healthy",
        data: {
          bucket: process.env.WASABI_BUCKET,
          endpoint: process.env.WASABI_ENDPOINT,
          region: process.env.WASABI_REGION,
        },
      });
    } catch (error) {
      console.error("S3 health check failed:", error);
      return response.status(500).json({
        success: false,
        message: "S3 service health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new S3Controller();