"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import type { ContentResponse, ContentType, StudyContent } from "../types";

const client = new DynamoDBClient({
	region: process.env.APP_AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client);

export interface FetchContentActionParams {
	offset: number;
	limit: number;
}

/**
 * DynamoDB item structure for content
 */
interface DynamoDBContentItem {
	contentId: string;
	type: string;
	title?: string;
	content: unknown;
	difficulty?: string;
	subject?: string;
	tags?: string[];
	createdAt: string;
	authorId: string;
}

/**
 * Server Action to fetch study content from DynamoDB
 * Provides type-safe content fetching with pagination support
 */
export async function fetchStudyContentAction({
	offset,
	limit,
}: FetchContentActionParams): Promise<ContentResponse> {
	try {
		// Validate parameters
		if (offset < 0 || limit <= 0 || limit > 50) {
			throw new Error("Invalid pagination parameters");
		}

		const command = new ScanCommand({
			TableName: Resource.ContentsTable.name,
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
				content: item.content,
				metadata: {
					difficulty: item.difficulty,
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
 * Server Action to fetch content by type
 */
export async function fetchContentByTypeAction({
	type,
	offset,
	limit,
}: {
	type: string;
	offset: number;
	limit: number;
}): Promise<ContentResponse> {
	try {
		// Validate parameters
		if (offset < 0 || limit <= 0 || limit > 50) {
			throw new Error("Invalid pagination parameters");
		}

		const command = new ScanCommand({
			TableName: Resource.ContentsTable.name,
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
				content: item.content,
				metadata: {
					difficulty: item.difficulty,
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
