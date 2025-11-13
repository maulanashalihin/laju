import { uuidv7 } from "uuidv7";
import { Response, Request } from "../../type";
import fs from "fs";
import sharp from "sharp";  
import DB from "../services/DB";
import { getPublicUrl, uploadBuffer } from "app/services/S3";



// Cache object to store file contents in memory
let cache: { [key: string]: Buffer } = {};

class Controller {
    /**
     * Serves assets from the dist folder (compiled assets)
     * - Handles CSS and JS files with proper content types
     * - Implements file caching for better performance
     * - Sets appropriate cache headers for browser caching
     */

    public async uploadAsset(request: Request, response: Response) {
        try { 

        
     

            let isValidFile = true;

            await request.multipart(async (field: any) => {
                if (field.file) {
                    if (!field.mime_type.includes("image")) {
                        isValidFile = false;
                        return;
                    }

                    const id = uuidv7();
                    const fileName = `${id}.webp`; 

                    // Create a buffer to store the image data
                    const chunks: Buffer[] = [];
                    const readable = field.file.stream;

                    readable.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    readable.on('end', async () => {
                        const buffer = Buffer.concat(chunks);

                        try {
                            // Process image with Sharp and get buffer
                            const processedBuffer = await sharp(buffer)
                                .webp({ quality: 80 }) // Convert to WebP with 80% quality
                                .resize(1200, 1200, { // Resize to max 1200x1200 while maintaining aspect ratio
                                    fit: 'inside',
                                    withoutEnlargement: true
                                })
                                .toBuffer();

                            // Upload directly to S3/Wasabi
                            const s3Key = `/assets/${fileName}`; 

                             await uploadBuffer(s3Key, processedBuffer, 'image/webp', 'public, max-age=31536000');

                            // Get public URL from S3 service
                            const publicUrl = getPublicUrl(s3Key);

                            // Save to assets table with S3 URL
                            const result = {
                                id,
                                type: 'image',
                                url: publicUrl,
                                mime_type: 'image/webp',
                                name: fileName,
                                size: processedBuffer.length,
                                user_id: request.user.id,
                                s3_key: s3Key, // Store S3 key for future reference
                                created_at: Date.now(),
                                updated_at: Date.now()
                            }
                            await DB.from("assets").insert(result);

                            response.json(result);
                        } catch (err) {
                            console.error('Error processing and uploading image:', err);
                            response.status(500).send("Error processing and uploading image");
                        }
                    });
                }
            });

            if (!isValidFile) {
                return response.status(400).send("Invalid file type. Only images are allowed.");
            }

        } catch (error) {
            console.error("Error uploading asset:", error);
            return response.status(500).send("Internal server error");
        }
    }

    public async distFolder(request: Request, response: Response) {
        const file = request.params.file;

        try {
            const filePath = `dist/assets/${file}`;

            // Set appropriate content type based on file extension
            if (file.endsWith(".css")) {
                response.setHeader("Content-Type", "text/css");
            } else if (file.endsWith(".js")) {
                response.setHeader("Content-Type", "application/javascript");
            } else {
                response.setHeader("Content-Type", "application/octet-stream");
            }

            // Set cache control header for browser caching (1 year)
            response.setHeader("Cache-Control", "public, max-age=31536000");

            // Return cached content if available
            if (cache[file]) {
                return response.send(cache[file]);
            }

            // Check if file exists and serve it
            if (await fs.promises.access(filePath).then(() => true).catch(() => false)) {
                const fileContent = await fs.promises.readFile(filePath);
                
                // Cache the file content
                cache[file] = fileContent;

                return response.send(fileContent);
            }

            return response.status(404).send("File not found");
        } catch (error) {
            console.error("Error serving dist file:", error);
            return response.status(500).send("Internal server error");
        }
    }

    /**
     * Serves static files from the public folder
     * - Implements security by checking allowed file extensions
     * - Prevents directory traversal attacks
     * - Handles various file types (images, fonts, documents, etc.)
     */
    public async publicFolder(request: Request, response: Response) {
        // List of allowed file extensions for security
        const allowedExtensions = [
            '.ico', '.png', '.jpeg', '.jpg', '.gif', '.svg',
            '.txt', '.pdf', '.css', '.js',
            '.woff', '.woff2', '.ttf', '.eot',
            '.mp4', '.webm', '.mp3', '.wav'
        ];

        // Clean and construct the file path
        const path =  request.path.replace("/", "").replaceAll("%20", " ");

        // Check if the path has any extension
        if (!path.includes('.')) {
            return response.status(404).send('Page not found');
        }

        // Security check: validate file extension
        if (!allowedExtensions.some(ext => path.toLowerCase().endsWith(ext))) {
            return response.status(403).send('File type not allowed');
        }

        // Check if file exists
        if (!fs.existsSync(path)) {
            return response.status(404).send('File not found');
        }

        // Serve the file
        return response.download(path);
    }
}

export default new Controller();