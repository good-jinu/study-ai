import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "./s3-client";

export interface GetPresignedUploadUrlParams {
	fileName: string;
	contentType: string;
	bucketName: string;
	expiresIn?: number; // seconds, default 3600 (1 hour)
}

export interface GetMediaUrlParams {
	key: string;
	bucketName: string;
	expiresIn?: number; // seconds, default 3600 (1 hour)
}

export interface DeleteMediaParams {
	key: string;
	bucketName: string;
}

export interface PresignedUploadResult {
	key: string;
	presignedUrl: string;
	publicUrl: string;
}

/**
 * Generate presigned URL for media upload
 */
export async function getPresignedUploadUrl({
	fileName,
	contentType,
	bucketName,
	expiresIn = 3600,
}: GetPresignedUploadUrlParams): Promise<PresignedUploadResult> {
	try {
		// Generate unique key with timestamp and UUID
		const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
		const uuid = uuidv4();
		const fileExtension = fileName.split(".").pop();
		const key = `media/${timestamp}/${uuid}.${fileExtension}`;

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: contentType,
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn,
			signableHeaders: new Set(["content-type"]),
		});

		// Generate public URL (assuming bucket is public)
		const publicUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

		return {
			key,
			presignedUrl,
			publicUrl,
		};
	} catch (error) {
		console.error("Error generating presigned upload URL:", error);
		throw new Error(
			`Failed to generate presigned upload URL: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Generate presigned URLs for multiple media uploads
 */
export async function getMultiplePresignedUploadUrls({
	files,
	bucketName,
	expiresIn = 3600,
}: {
	files: { fileName: string; contentType: string }[];
	bucketName: string;
	expiresIn?: number;
}): Promise<PresignedUploadResult[]> {
	try {
		const results = await Promise.all(
			files.map((file) =>
				getPresignedUploadUrl({
					fileName: file.fileName,
					contentType: file.contentType,
					bucketName,
					expiresIn,
				}),
			),
		);

		return results;
	} catch (error) {
		console.error("Error generating multiple presigned upload URLs:", error);
		throw new Error(
			`Failed to generate presigned upload URLs: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
export async function getMediaSignedUrl({
	key,
	bucketName,
	expiresIn = 3600,
}: GetMediaUrlParams): Promise<string> {
	try {
		const command = new GetObjectCommand({
			Bucket: bucketName,
			Key: key,
		});

		const signedUrl = await getSignedUrl(s3Client, command, {
			expiresIn,
		});

		return signedUrl;
	} catch (error) {
		console.error("Error generating signed URL:", error);
		throw new Error(
			`Failed to generate signed URL: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Delete media file from S3
 */
export async function deleteMedia({
	key,
	bucketName,
}: DeleteMediaParams): Promise<void> {
	try {
		const command = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: key,
		});

		await s3Client.send(command);
	} catch (error) {
		console.error("Error deleting media:", error);
		throw new Error(
			`Failed to delete media: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Get public URL for media file (for public buckets)
 */
export function getPublicMediaUrl(key: string, bucketName: string): string {
	return `https://${bucketName}.s3.amazonaws.com/${key}`;
}
