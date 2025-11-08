"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S3_1 = require("../services/S3");
class S3Controller {
    async getSignedUrl(request, response) {
        try {
            const { filename, contentType } = await request.json();
            if (!filename || !contentType) {
                return response.status(400).json({
                    success: false,
                    message: "Filename and content type are required",
                });
            }
            const fileKey = "assets/" + filename;
            const signedUrl = await (0, S3_1.getSignedUploadUrl)(fileKey, contentType);
            const publicUrl = (0, S3_1.getPublicUrl)(fileKey);
            return response.json({
                success: true,
                data: {
                    signedUrl,
                    publicUrl,
                    fileKey,
                    bucket: process.env.WASABI_BUCKET,
                    expiresIn: 3600,
                },
            });
        }
        catch (error) {
            console.error("Error generating signed URL:", error);
            return response.status(500).json({
                success: false,
                message: "Failed to generate signed URL",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getPublicUrl(request, response) {
        try {
            const { fileKey } = request.params;
            if (!fileKey) {
                return response.status(400).json({
                    success: false,
                    message: "File key is required",
                });
            }
            const publicUrl = (0, S3_1.getPublicUrl)(fileKey);
            return response.json({
                success: true,
                data: {
                    publicUrl,
                    fileKey,
                    bucket: process.env.WASABI_BUCKET,
                },
            });
        }
        catch (error) {
            console.error("Error getting public URL:", error);
            return response.status(500).json({
                success: false,
                message: "Failed to get public URL",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async health(request, response) {
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
        }
        catch (error) {
            console.error("S3 health check failed:", error);
            return response.status(500).json({
                success: false,
                message: "S3 service health check failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.default = new S3Controller();
//# sourceMappingURL=S3Controller.js.map