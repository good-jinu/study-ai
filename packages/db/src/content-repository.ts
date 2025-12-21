import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import type {
	ContentResponse,
	ContentType,
	DifficultyLevel,
	DynamoDBContentItem,
	StudyContent,
} from "@study-ai/core";
import { docClient } from "./client";

export interface FetchContentParams {
	offset: number;
	limit: number;
	tableName: string;
}

export interface FetchContentByTypeParams extends FetchContentParams {
	type: string;
}

/**
 * Fetch study content with pagination
 */
export async function fetchStudyContent({
	offset,
	limit,
	tableName,
}: FetchContentParams): Promise<ContentResponse> {
	try {
		// Validate parameters
		if (offset < 0 || limit <= 0 || limit > 50) {
			throw new Error("Invalid pagination parameters");
		}

		const command = new ScanCommand({
			TableName: tableName,
			Limit: limit + 1, // Fetch one extra to check if there are more
		});

		const result = await docClient.send(command);
		const items = (result.Items || []) as DynamoDBContentItem[];

		// Check if there are more items
		const hasMore = items.length > limit;
		const contents = hasMore ? items.slice(0, limit) : items;

		// Transform DynamoDB items to StudyContent format
		const studyContents: StudyContent[] = contents.map(
			(item: DynamoDBContentItem) => ({
				id: item.contentId,
				type: item.type as ContentType,
				title: item.title || "Untitled",
				content: item.content as StudyContent["content"],
				metadata: {
					difficulty: item.difficulty as DifficultyLevel | undefined,
					subject: item.subject,
					tags: item.tags || [],
				},
			}),
		);

		return {
			contents: studyContents,
			hasMore,
			total: result.Count,
		};
	} catch (error) {
		console.error("Error fetching study content:", error);

		// Re-throw with a user-friendly message
		if (error instanceof Error) {
			throw new Error(`Failed to fetch study content: ${error.message}`);
		}
		throw new Error("Failed to fetch study content due to an unexpected error");
	}
}

/**
 * Fetch content by type with pagination
 */
export async function fetchContentByType({
	type,
	offset,
	limit,
	tableName,
}: FetchContentByTypeParams): Promise<ContentResponse> {
	try {
		// Validate parameters
		if (offset < 0 || limit <= 0 || limit > 50) {
			throw new Error("Invalid pagination parameters");
		}

		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: "#type = :type",
			ExpressionAttributeNames: {
				"#type": "type",
			},
			ExpressionAttributeValues: {
				":type": type,
			},
			Limit: limit + 1,
		});

		const result = await docClient.send(command);
		const items = (result.Items || []) as DynamoDBContentItem[];

		const hasMore = items.length > limit;
		const contents = hasMore ? items.slice(0, limit) : items;

		const studyContents: StudyContent[] = contents.map(
			(item: DynamoDBContentItem) => ({
				id: item.contentId,
				type: item.type as ContentType,
				title: item.title || "Untitled",
				content: item.content as StudyContent["content"],
				metadata: {
					difficulty: item.difficulty as DifficultyLevel | undefined,
					subject: item.subject,
					tags: item.tags || [],
				},
			}),
		);

		return {
			contents: studyContents,
			hasMore,
			total: result.Count,
		};
	} catch (error) {
		console.error("Error fetching content by type:", error);

		if (error instanceof Error) {
			throw new Error(`Failed to fetch ${type} content: ${error.message}`);
		}
		throw new Error(
			`Failed to fetch ${type} content due to an unexpected error`,
		);
	}
}

import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export interface CreateContentParams {
	content: Omit<StudyContent, "id">;
	tableName: string;
}

export interface UpdateContentParams {
	contentId: string;
	content: Omit<StudyContent, "id">;
	tableName: string;
}

export interface DeleteContentParams {
	contentId: string;
	tableName: string;
}

export interface GetContentByIdParams {
	contentId: string;
	tableName: string;
}

/**
 * Get content by ID
 */
export async function getContentById({
	contentId,
	tableName,
}: GetContentByIdParams): Promise<StudyContent | null> {
	try {
		const command = new GetCommand({
			TableName: tableName,
			Key: {
				contentId,
			},
		});

		const result = await docClient.send(command);

		if (!result.Item) {
			return null;
		}

		const item = result.Item as DynamoDBContentItem;

		return {
			id: item.contentId,
			type: item.type as ContentType,
			title: item.title || "Untitled",
			content: item.content as StudyContent["content"],
			metadata: {
				difficulty: item.difficulty as DifficultyLevel | undefined,
				subject: item.subject,
				tags: item.tags || [],
			},
		};
	} catch (error) {
		console.error("Error getting content by ID:", error);
		throw new Error(
			`Failed to get content: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Create new content
 */
export async function createContent({
	content,
	tableName,
}: CreateContentParams): Promise<{ id: string }> {
	try {
		const contentId = uuidv4();
		const now = new Date().toISOString();

		const item: DynamoDBContentItem = {
			contentId,
			type: content.type,
			title: content.title,
			content: content.content,
			difficulty: content.metadata?.difficulty,
			subject: content.metadata?.subject,
			tags: content.metadata?.tags || [],
			createdAt: now,
			authorId: "admin", // TODO: Replace with actual user ID when auth is implemented
		};

		const command = new PutCommand({
			TableName: tableName,
			Item: item,
		});

		await docClient.send(command);

		return { id: contentId };
	} catch (error) {
		console.error("Error creating content:", error);
		throw new Error(
			`Failed to create content: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Update existing content
 */
export async function updateContent({
	contentId,
	content,
	tableName,
}: UpdateContentParams): Promise<void> {
	try {
		const command = new UpdateCommand({
			TableName: tableName,
			Key: {
				contentId,
			},
			UpdateExpression:
				"SET #type = :type, title = :title, content = :content, difficulty = :difficulty, subject = :subject, tags = :tags",
			ExpressionAttributeNames: {
				"#type": "type",
			},
			ExpressionAttributeValues: {
				":type": content.type,
				":title": content.title,
				":content": content.content,
				":difficulty": content.metadata?.difficulty,
				":subject": content.metadata?.subject,
				":tags": content.metadata?.tags || [],
			},
		});

		await docClient.send(command);
	} catch (error) {
		console.error("Error updating content:", error);
		throw new Error(
			`Failed to update content: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Delete content
 */
export async function deleteContent({
	contentId,
	tableName,
}: DeleteContentParams): Promise<void> {
	try {
		const command = new DeleteCommand({
			TableName: tableName,
			Key: {
				contentId,
			},
		});

		await docClient.send(command);
	} catch (error) {
		console.error("Error deleting content:", error);
		throw new Error(
			`Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
