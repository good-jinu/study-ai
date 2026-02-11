import type { MediaAttachment, StudyContent } from "@study-ai/core";
import {
	createContent,
	deleteContent,
	updateContent,
} from "./content-repository";
import {
	deleteMedia,
	getMultiplePresignedUploadUrls,
} from "./media-repository";

export interface GetPresignedUrlsForContentParams {
	mediaFiles: {
		fileName: string;
		contentType: string;
		type: MediaAttachment["type"];
	}[];
	bucketName: string;
	expiresIn?: number;
}

export interface CreateContentWithPresignedMediaParams {
	content: Omit<StudyContent, "id">;
	mediaAttachments: MediaAttachment[];
	tableName: string;
}

export interface UpdateContentWithPresignedMediaParams {
	contentId: string;
	content: Omit<StudyContent, "id">;
	mediaAttachments?: MediaAttachment[];
	tableName: string;
}

/**
 * Get presigned URLs for media uploads when creating content
 */
export async function getPresignedUrlsForContent({
	mediaFiles,
	bucketName,
	expiresIn = 3600,
}: GetPresignedUrlsForContentParams): Promise<{
	presignedUrls: Array<{
		key: string;
		presignedUrl: string;
		publicUrl: string;
		fileName: string;
		contentType: string;
		type: MediaAttachment["type"];
	}>;
}> {
	try {
		const presignedResults = await getMultiplePresignedUploadUrls({
			files: mediaFiles.map(({ fileName, contentType }) => ({
				fileName,
				contentType,
			})),
			bucketName,
			expiresIn,
		});

		const presignedUrls = presignedResults.map((result, index) => ({
			...result,
			fileName: mediaFiles[index].fileName,
			contentType: mediaFiles[index].contentType,
			type: mediaFiles[index].type,
		}));

		return { presignedUrls };
	} catch (error) {
		console.error("Error getting presigned URLs for content:", error);
		throw error;
	}
}

/**
 * Create content with media attachments (after files are uploaded via presigned URLs)
 */
export async function createContentWithPresignedMedia({
	content,
	mediaAttachments,
	tableName,
}: CreateContentWithPresignedMediaParams): Promise<{ id: string }> {
	try {
		// Add media attachments to content metadata
		const contentWithMedia: Omit<StudyContent, "id"> = {
			...content,
			metadata: {
				...content.metadata,
				media: [...(content.metadata?.media || []), ...mediaAttachments],
			},
		};

		// Create content with media references
		return await createContent({
			content: contentWithMedia,
			tableName,
		});
	} catch (error) {
		console.error("Error creating content with presigned media:", error);
		throw error;
	}
}

/**
 * Update content with media attachments (after files are uploaded via presigned URLs)
 */
export async function updateContentWithPresignedMedia({
	contentId,
	content,
	mediaAttachments = [],
	tableName,
}: UpdateContentWithPresignedMediaParams): Promise<void> {
	try {
		// Add new media attachments to existing ones
		const contentWithMedia: Omit<StudyContent, "id"> = {
			...content,
			metadata: {
				...content.metadata,
				media: [...(content.metadata?.media || []), ...mediaAttachments],
			},
		};

		// Update content with media references
		await updateContent({
			contentId,
			content: contentWithMedia,
			tableName,
		});
	} catch (error) {
		console.error("Error updating content with presigned media:", error);
		throw error;
	}
}

/**
 * Delete content and associated media files
 */
export async function deleteContentWithMedia({
	contentId,
	tableName,
	bucketName,
	mediaKeys = [],
}: {
	contentId: string;
	tableName: string;
	bucketName: string;
	mediaKeys?: string[];
}): Promise<void> {
	try {
		// Delete content from DynamoDB
		await deleteContent({ contentId, tableName });

		// Delete associated media files from S3
		for (const key of mediaKeys) {
			await deleteMedia({ key, bucketName });
		}
	} catch (error) {
		console.error("Error deleting content with media:", error);
		throw error;
	}
}
