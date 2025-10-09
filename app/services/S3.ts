import { 
    S3Client, 
    PutObjectCommand, 
    DeleteObjectCommand, 
    HeadObjectCommand,
    PutObjectCommandInput 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

class S3Service {
    private s3Client: S3Client;
    private bucket: string;

    constructor() {
        // Configure AWS SDK v3 for Wasabi
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.WASABI_ACCESS_KEY!,
                secretAccessKey: process.env.WASABI_SECRET_KEY!,
            },
            endpoint: process.env.WASABI_ENDPOINT,
            region: process.env.WASABI_REGION || 'us-east-1',
            forcePathStyle: true, // Required for Wasabi
        });

        this.bucket = process.env.WASABI_BUCKET || 'laju-dev';
    }

    /**
     * Upload buffer directly to S3
     * @param buffer - The file buffer to upload
     * @param key - The S3 key (path/filename)
     * @param contentType - MIME type of the file
     * @returns Promise with upload result
     */
    async uploadBuffer(buffer: Buffer, key: string, contentType: string): Promise<any> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read' // Make files publicly accessible
        });

        return await this.s3Client.send(command);
    }

    async getSignedUploadUrl(
        key: string,
        contentType: string,
        expiresIn: number = 3600
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn,
        });

        return signedUrl;
    }

    /**
     * Delete object from S3
     * @param key - The S3 key to delete
     * @returns Promise with deletion result
     */
    async deleteObject(key: string): Promise<any> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return await this.s3Client.send(command);
    }

    /**
     * Get public URL for an object
     * @param key - The S3 key
     * @returns Public URL string
     */
    getPublicUrl(key: string): string {
        // Use CDN URL if available, otherwise use direct S3 URL
        // CDN use bunny cdn
        const cdnUrl = process.env.CDN_URL;
        if (cdnUrl) {
            return `${cdnUrl}/${this.bucket}/${key}`;
        }
        
        return `${process.env.WASABI_ENDPOINT}/${this.bucket}/${key}`;
    }

    /**
     * Check if object exists
     * @param key - The S3 key to check
     * @returns Promise<boolean>
     */
    async objectExists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: key
            });
            await this.s3Client.send(command);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get bucket name
     * @returns string
     */
    getBucket(): string {
        return this.bucket;
    } 
}

export default new S3Service();