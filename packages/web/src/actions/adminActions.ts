"use server";

import type { ContentResponse, StudyContent } from "@study-ai/core";
import {
	createContent,
	deleteContent,
	fetchContentByType,
	fetchStudyContent,
	getContentById,
	updateContent,
} from "@study-ai/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resource } from "sst";

export interface AdminFetchParams {
	offset: number;
	limit: number;
	type?: string;
}

/**
 * Fetch all content for admin with pagination
 */
export async function fetchAllContentAction({
	offset,
	limit,
	type,
}: AdminFetchParams): Promise<ContentResponse> {
	if (type && type !== "all") {
		return fetchContentByType({
			type,
			offset,
			limit,
			tableName: Resource.ContentsTable.name,
		});
	}

	return fetchStudyContent({
		offset,
		limit,
		tableName: Resource.ContentsTable.name,
	});
}

/**
 * Get content by ID for editing
 */
export async function getContentByIdAction(
	id: string,
): Promise<StudyContent | null> {
	try {
		return await getContentById({
			contentId: id,
			tableName: Resource.ContentsTable.name,
		});
	} catch (error) {
		console.error("Error fetching content by ID:", error);
		return null;
	}
}

/**
 * Create new content
 */
export async function createContentAction(content: Omit<StudyContent, "id">) {
	try {
		const result = await createContent({
			content,
			tableName: Resource.ContentsTable.name,
		});

		revalidatePath("/admin");
		redirect("/admin");

		return { success: true, id: result.id };
	} catch (error) {
		console.error("Error creating content:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create content",
		};
	}
}

/**
 * Update existing content
 */
export async function updateContentAction(
	id: string,
	content: Omit<StudyContent, "id">,
) {
	try {
		await updateContent({
			contentId: id,
			content,
			tableName: Resource.ContentsTable.name,
		});

		revalidatePath("/admin");
		revalidatePath(`/admin/content/${id}`);
		redirect("/admin");

		return { success: true };
	} catch (error) {
		console.error("Error updating content:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to update content",
		};
	}
}

/**
 * Delete content
 */
export async function deleteContentAction(id: string) {
	try {
		await deleteContent({
			contentId: id,
			tableName: Resource.ContentsTable.name,
		});

		revalidatePath("/admin");

		return { success: true };
	} catch (error) {
		console.error("Error deleting content:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to delete content",
		};
	}
}
