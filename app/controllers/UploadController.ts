import { uuidv7 } from "uuidv7";
import { Response, Request } from "../../type";
import sharp from "sharp";
import DB from "../services/DB";
import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";
import path from "path";

// Storage Service Selection:
// To switch between S3 and Local Storage, change the import above:
//
// Local Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/LocalStorage";
//
// S3 Storage:
// import { getPublicUrl, uploadBuffer } from "app/services/S3";
//
// Both services have the same API, making it easy to switch between them.
// Local Storage is recommended for development, S3 for production.

// Mime type map for common image types
const MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv'
};

function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
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
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const userId = request.user.id;
            let uploadedAsset: any = null;
            let isValidFile = true;
            let errorMessage = '';

            await request.multipart(async (field: unknown) => {
                if (field && typeof field === 'object' && 'file' in field && field.file) {
                    const multipartField = field as { 
                        name: string; 
                        mime_type: string;
                        file: { stream: NodeJS.ReadableStream; name: string } 
                    };
                    
                    console.log('File object:', {
                        name: multipartField.file.name,
                        mime_type: multipartField.mime_type,
                        hasStream: !!multipartField.file.stream
                    });

                    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                    if (!allowedTypes.includes(multipartField.mime_type)) {
                        isValidFile = false;
                        errorMessage = `Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed. Got: ${multipartField.mime_type}`;
                        console.error('Invalid mime type:', multipartField.mime_type);
                        return;
                    }

                    const id = uuidv7();
                    const fileName = `${id}.webp`;

                    const chunks: Buffer[] = [];
                    const readable = multipartField.file.stream;

                    readable.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);

                        try {
                            const processedBuffer = await sharp(buffer)
                                .webp({ quality: 80 })
                                .resize(1200, 1200, {
                                    fit: 'inside',
                                    withoutEnlargement: true
                                })
                                .toBuffer();

                            const storageKey = `assets/${fileName}`;
                            await uploadBuffer(storageKey, processedBuffer, 'image/webp');
                            const publicUrl = getPublicUrl(storageKey);

                            uploadedAsset = {
                                id,
                                type: 'image',
                                url: publicUrl,
                                mime_type: 'image/webp',
                                name: fileName,
                                size: processedBuffer.length,
                                user_id: userId,
                                storage_key: storageKey,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            };

                            await DB.from("assets").insert(uploadedAsset);
                            response.json({ success: true, data: uploadedAsset });
                        } catch (err) {
                            console.error('Error processing and uploading image:', err);
                            response.status(500).json({ 
                                success: false, 
                                error: 'Error processing and uploading image' 
                            });
                        }
                    });
                }
            });

            if (!isValidFile) {
                return response.status(400).json({ 
                    success: false, 
                    error: errorMessage 
                });
            }

        } catch (error) {
            console.error("Error uploading image:", error);
            return response.status(500).json({ 
                success: false, 
                error: 'Internal server error' 
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
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const userId = request.user.id;
            let uploadedAsset: any = null;
            let isValidFile = true;
            let errorMessage = '';

            await request.multipart(async (field: unknown) => {
                if (field && typeof field === 'object' && 'file' in field && field.file) {
                    const file = field.file as { stream: NodeJS.ReadableStream; mime_type: string; name: string };
                    
                    const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/plain',
                        'text/csv'
                    ];
                    
                    if (!allowedTypes.includes(file.mime_type)) {
                        isValidFile = false;
                        errorMessage = 'Invalid file type. Allowed types: PDF, Word, Excel, Text, CSV';
                        return;
                    }

                    const id = uuidv7();
                    const ext = file.name.split('.').pop();
                    const fileName = `${id}.${ext}`;

                    const chunks: Buffer[] = [];
                    const readable = file.stream;

                    readable.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);

                        try {
                            const storageKey = `files/${userId}/${fileName}`;
                            await uploadBuffer(storageKey, buffer, file.mime_type);
                            const publicUrl = getPublicUrl(storageKey);

                            uploadedAsset = {
                                id,
                                type: 'file',
                                url: publicUrl,
                                mime_type: file.mime_type,
                                name: file.name,
                                size: buffer.length,
                                user_id: userId,
                                storage_key: storageKey,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            };

                            await DB.from("assets").insert(uploadedAsset);
                            response.json({ success: true, data: uploadedAsset });
                        } catch (err) {
                            console.error('Error uploading file:', err);
                            response.status(500).json({ 
                                success: false, 
                                error: 'Error uploading file' 
                            });
                        }
                    });
                }
            });

            if (!isValidFile) {
                return response.status(400).json({ 
                    success: false, 
                    error: errorMessage 
                });
            }

        } catch (error) {
            console.error("Error uploading file:", error);
            return response.status(500).json({ 
                success: false, 
                error: 'Internal server error' 
            });
        }
    }
}

export default new UploadController();
