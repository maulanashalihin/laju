import AWS from 'aws-sdk';

class S3Service {
    private s3: AWS.S3;
    private bucket: string;

    constructor() {
        // Configure AWS SDK for Wasabi
        this.s3 = new AWS.S3({
            accessKeyId: process.env.WASABI_ACCESS_KEY,
            secretAccessKey: process.env.WASABI_SECRET_KEY,
            endpoint: process.env.WASABI_ENDPOINT,
            region: process.env.WASABI_REGION,
            s3ForcePathStyle: true, // Required for Wasabi
            signatureVersion: 'v4'
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
    async uploadBuffer(buffer: Buffer, key: string, contentType: string): Promise<AWS.S3.ManagedUpload.SendData> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read' // Make files publicly accessible
        };

        return this.s3.upload(params).promise();
    }

    /**
     * Delete object from S3
     * @param key - The S3 key to delete
     * @returns Promise with deletion result
     */
    async deleteObject(key: string): Promise<AWS.S3.DeleteObjectOutput> {
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: this.bucket,
            Key: key
        };

        return this.s3.deleteObject(params).promise();
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
            await this.s3.headObject({
                Bucket: this.bucket,
                Key: key
            }).promise();
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default new S3Service();