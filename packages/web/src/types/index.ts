/**
 * Core types and interfaces for the AI Study Platform
 *
 * This file contains all the TypeScript interfaces and types used throughout
 * the application for content rendering, API integration, and data modeling.
 */

/**
 * Content type discriminator for different study materials
 */
export type ContentType = "flashcard" | "quiz" | "lesson" | "summary";

/**
 * Difficulty levels for study content
 */
export type DifficultyLevel = "easy" | "medium" | "hard";

/**
 * Metadata associated with study content
 */
export interface ContentMetadata {
	difficulty?: DifficultyLevel;
	subject?: string;
	tags?: string[];
}

/**
 * Base interface for all study content items
 * Requirements: 6.1, 6.3, 3.2, 3.3, 3.4
 */
export interface StudyContent {
	id: string;
	type: ContentType;
	title: string;
	content: FlashcardContent | QuizContent | LessonContent | SummaryContent;
	metadata?: ContentMetadata;
}

/**
 * Content structure for flashcard study materials
 * Requirements: 3.2
 */
export interface FlashcardContent {
	question: string;
	answer: string;
	hint?: string;
}

/**
 * Content structure for quiz questions
 * Requirements: 3.3
 */
export interface QuizContent {
	question: string;
	options: string[];
	correctAnswer: number;
	explanation?: string;
}

/**
 * Content structure for lesson materials
 * Requirements: 3.4
 */
export interface LessonContent {
	sections: {
		heading: string;
		body: string;
	}[];
	keyPoints?: string[];
}

/**
 * Content structure for summary materials
 * Requirements: 3.4
 */
export interface SummaryContent {
	summary: string;
	bulletPoints?: string[];
	relatedTopics?: string[];
}

/**
 * API response structure for content fetching
 * Requirements: 6.1, 6.3
 */
export interface ContentResponse {
	contents: StudyContent[];
	hasMore: boolean;
	total?: number;
}

/**
 * Parameters for content fetching API calls
 * Requirements: 6.1
 */
export interface ContentFetchParams {
	offset: number;
	limit: number;
	subject?: string;
	difficulty?: DifficultyLevel;
	contentType?: ContentType;
}

/**
 * Type guards for content type checking
 */
export const isFlashcardContent = (
	content: unknown,
): content is FlashcardContent => {
	return !!(
		content &&
		typeof content === "object" &&
		"question" in content &&
		"answer" in content &&
		typeof (content as Record<string, unknown>).question === "string" &&
		typeof (content as Record<string, unknown>).answer === "string"
	);
};

export const isQuizContent = (content: unknown): content is QuizContent => {
	return !!(
		content &&
		typeof content === "object" &&
		"question" in content &&
		"options" in content &&
		"correctAnswer" in content &&
		typeof (content as Record<string, unknown>).question === "string" &&
		Array.isArray((content as Record<string, unknown>).options) &&
		typeof (content as Record<string, unknown>).correctAnswer === "number"
	);
};

export const isLessonContent = (content: unknown): content is LessonContent => {
	return !!(
		content &&
		typeof content === "object" &&
		"sections" in content &&
		Array.isArray((content as Record<string, unknown>).sections) &&
		(content as Record<string, unknown>).sections.every(
			(section: unknown) =>
				section &&
				typeof section === "object" &&
				"heading" in section &&
				"body" in section &&
				typeof (section as Record<string, unknown>).heading === "string" &&
				typeof (section as Record<string, unknown>).body === "string",
		)
	);
};

export const isSummaryContent = (
	content: unknown,
): content is SummaryContent => {
	return !!(
		content &&
		typeof content === "object" &&
		"summary" in content &&
		typeof (content as Record<string, unknown>).summary === "string"
	);
};

/**
 * Type guard for StudyContent validation
 */
export const isValidStudyContent = (item: unknown): item is StudyContent => {
	if (
		!item ||
		typeof item !== "object" ||
		!("id" in item) ||
		!("title" in item) ||
		!("type" in item) ||
		typeof (item as Record<string, unknown>).id !== "string" ||
		typeof (item as Record<string, unknown>).title !== "string"
	) {
		return false;
	}

	const validTypes: ContentType[] = ["flashcard", "quiz", "lesson", "summary"];
	if (
		!validTypes.includes((item as Record<string, unknown>).type as ContentType)
	) {
		return false;
	}

	// Validate content based on type
	switch ((item as Record<string, unknown>).type) {
		case "flashcard":
			return (
				"content" in item &&
				isFlashcardContent((item as Record<string, unknown>).content)
			);
		case "quiz":
			return (
				"content" in item &&
				isQuizContent((item as Record<string, unknown>).content)
			);
		case "lesson":
			return (
				"content" in item &&
				isLessonContent((item as Record<string, unknown>).content)
			);
		case "summary":
			return (
				"content" in item &&
				isSummaryContent((item as Record<string, unknown>).content)
			);
		default:
			return false;
	}
};
