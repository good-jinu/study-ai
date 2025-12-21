"use server";

import type { ContentResponse } from "@study-ai/core";
import { fetchContentByType, fetchStudyContent } from "@study-ai/db";
import { Resource } from "sst";

export interface FetchContentActionParams {
	offset: number;
	limit: number;
}

/**
 * Server Action to fetch study content from DynamoDB
 * Provides type-safe content fetching with pagination support
 */
export async function fetchStudyContentAction({
	offset,
	limit,
}: FetchContentActionParams): Promise<ContentResponse> {
	return fetchStudyContent({
		offset,
		limit,
		tableName: Resource.ContentsTable.name,
	});
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
	return fetchContentByType({
		type,
		offset,
		limit,
		tableName: Resource.ContentsTable.name,
	});
}
