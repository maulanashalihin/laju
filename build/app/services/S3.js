"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
exports.uploadBuffer = uploadBuffer;
exports.uploadBufferSecure = uploadBufferSecure;
exports.getObject = getObject;
exports.headObject = headObject;
exports.exists = exists;
exports.deleteObject = deleteObject;
exports.getSignedUploadUrl = getSignedUploadUrl;
exports.getPublicUrl = getPublicUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const endpoint = process.env.WASABI_ENDPOINT;
const region = process.env.WASABI_REGION;
const bucket = process.env.WASABI_BUCKET;
const accessKeyId = process.env.WASABI_ACCESS_KEY;
const secretAccessKey = process.env.WASABI_SECRET_KEY;
const cdnUrl = process.env.CDN_URL;
if (!bucket || !accessKeyId || !secretAccessKey) {
    console.warn("S3 (Wasabi) env not fully set: WASABI_BUCKET, WASABI_ACCESS_KEY, WASABI_SECRET_KEY are required.");
}
exports.s3Client = new client_s3_1.S3Client({
    region: region,
    endpoint: endpoint,
    forcePathStyle: true,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
async function uploadBuffer(key, body, contentType, cacheControl) {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType || "application/octet-stream",
        ACL: "public-read",
        CacheControl: cacheControl || "public, max-age=31536000",
    };
    await exports.s3Client.send(new client_s3_1.PutObjectCommand(params));
}
async function uploadBufferSecure(key, body, contentType, contentLength, metadata) {
    const useSSE = (process.env.BACKUP_SSE || "").toLowerCase() === "true" || (process.env.BACKUP_SSE || "") === "1";
    const params = {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType || "application/octet-stream",
        ACL: "private",
        ...(useSSE ? { ServerSideEncryption: "AES256" } : {}),
        ...(typeof contentLength === 'number' ? { ContentLength: contentLength } : {}),
        ...(metadata ? { Metadata: metadata } : {}),
    };
    await exports.s3Client.send(new client_s3_1.PutObjectCommand(params));
}
async function getObject(key) {
    const params = {
        Bucket: bucket,
        Key: key,
    };
    return exports.s3Client.send(new client_s3_1.GetObjectCommand(params));
}
async function headObject(key) {
    return exports.s3Client.send(new client_s3_1.HeadObjectCommand({ Bucket: bucket, Key: key }));
}
async function exists(key) {
    try {
        await exports.s3Client.send(new client_s3_1.HeadObjectCommand({ Bucket: bucket, Key: key }));
        return true;
    }
    catch (_err) {
        return false;
    }
}
async function deleteObject(key) {
    await exports.s3Client.send(new client_s3_1.DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
async function getSignedUploadUrl(key, contentType, expiresIn = 3600) {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        ACL: "public-read",
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(exports.s3Client, command, { expiresIn });
}
function getPublicUrl(key) {
    if (cdnUrl) {
        return `${cdnUrl.replace(/\/$/, "")}/${bucket}/${key}`;
    }
    if (endpoint) {
        const base = endpoint.replace(/\/$/, "");
        return `${base}/${bucket}/${key}`;
    }
    return `https://s3.${region}.wasabisys.com/${bucket}/${key}`;
}
//# sourceMappingURL=S3.js.map