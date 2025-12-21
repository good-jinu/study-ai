import type { ContentFetchParams, ContentResponse } from "@study-ai/core";
import { fetchStudyContentAction } from "../actions/contentActions";

/**
 * Fetches study content using Server Actions with pagination support
 * Implements retry logic with exponential backoff for resilience
 */
export async function fetchStudyContent({
	offset,
	limit,
}: ContentFetchParams): Promise<ContentResponse> {
	const maxRetries = 3;
	const baseDelay = 1000; // 1 second

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			// Use Server Action instead of fetch
			const data = await fetchStudyContentAction({ offset, limit });

			// Validate response structure
			if (!Array.isArray(data.contents) || typeof data.hasMore !== "boolean") {
				throw new Error("Invalid response structure from Server Action");
			}

			return data;
		} catch (error) {
			const isLastAttempt = attempt === maxRetries;

			if (isLastAttempt) {
				// On final attempt, throw a user-friendly error
				if (error instanceof Error) {
					throw new Error(`Failed to load study content: ${error.message}`);
				}
				throw new Error("Failed to load study content due to network error");
			}

			// Wait before retrying with exponential backoff
			const delay = baseDelay * 2 ** attempt;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	// This should never be reached, but TypeScript requires it
	throw new Error("Unexpected error in fetchStudyContent");
}

/**
 * Detects if the current error is a network or server error
 */
export function isNetworkError(error: unknown): boolean {
	if (error instanceof TypeError && error.message.includes("fetch")) {
		return true;
	}

	if (error instanceof Error) {
		return (
			error.message.includes("network") ||
			error.message.includes("offline") ||
			error.message.includes("timeout") ||
			error.message.includes("Failed to fetch") ||
			error.message.includes("Server Action")
		);
	}

	return false;
}

/**
 * Creates a user-friendly error message based on the error type
 */
export function getErrorMessage(error: unknown): string {
	if (isNetworkError(error)) {
		return "Please check your internet connection and try again.";
	}

	if (error instanceof Error) {
		if (error.message.includes("Invalid pagination parameters")) {
			return "Invalid request parameters. Please refresh the page and try again.";
		}
		if (error.message.includes("Failed to fetch study content")) {
			return "Unable to load study content. Please try again in a moment.";
		}
		return error.message;
	}

	return "An unexpected error occurred. Please try again.";
}
