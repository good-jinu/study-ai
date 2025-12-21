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
