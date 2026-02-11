import type { MediaAttachment } from "@study-ai/core";

export interface FileUploadInfo {
	file: File;
	type: MediaAttachment["type"];
}

export interface PresignedUrlResponse {
	key: string;
	presignedUrl: string;
	publicUrl: string;
	fileName: string;
	contentType: string;
}

export interface UploadResult {
	key: string;
	url: string;
	fileName: string;
	type: MediaAttachment["type"];
	size: number;
}

/**
 * Get presigned URL for a single file upload
 */
export async function getPresignedUrl(
	fileName: string,
	contentType: string,
): Promise<PresignedUrlResponse> {
	const response = await fetch("/api/media/presigned-url", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			fileName,
			contentType,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to get presigned URL");
	}

	return response.json();
}

/**
 * Get presigned URLs for multiple files
 */
export async function getPresignedUrls(
	files: { fileName: string; contentType: string }[],
): Promise<PresignedUrlResponse[]> {
	const response = await fetch("/api/media/presigned-urls", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			files,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to get presigned URLs");
	}

	const data = await response.json();
	return data.presignedUrls;
}

/**
 * Upload file using presigned URL
 */
export async function uploadFileWithPresignedUrl(
	file: File,
	presignedUrl: string,
): Promise<void> {
	const response = await fetch(presignedUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	if (!response.ok) {
		throw new Error(`Upload failed: ${response.statusText}`);
	}
}

/**
 * Upload multiple files and return media attachments
 */
export async function uploadFiles(
	fileInfos: FileUploadInfo[],
): Promise<MediaAttachment[]> {
	try {
		// Get presigned URLs for all files
		const presignedUrls = await getPresignedUrls(
			fileInfos.map((info) => ({
				fileName: info.file.name,
				contentType: info.file.type,
			})),
		);

		// Upload all files in parallel
		const uploadPromises = fileInfos.map(async (fileInfo, index) => {
			const presignedData = presignedUrls[index];

			await uploadFileWithPresignedUrl(
				fileInfo.file,
				presignedData.presignedUrl,
			);

			return {
				key: presignedData.key,
				url: presignedData.publicUrl,
				type: fileInfo.type,
				fileName: fileInfo.file.name,
				size: fileInfo.file.size,
			} as MediaAttachment;
		});

		const results = await Promise.all(uploadPromises);
		return results;
	} catch (error) {
		console.error("Error uploading files:", error);
		throw error;
	}
}

/**
 * Upload a single file and return media attachment
 */
export async function uploadFile(
	fileInfo: FileUploadInfo,
): Promise<MediaAttachment> {
	const results = await uploadFiles([fileInfo]);
	return results[0];
}

/**
 * Determine media type from file type
 */
export function getMediaTypeFromFile(file: File): MediaAttachment["type"] {
	if (file.type.startsWith("image/")) return "image";
	if (file.type.startsWith("video/")) return "video";
	if (file.type.startsWith("audio/")) return "audio";
	return "document";
}
