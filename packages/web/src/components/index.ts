/**
 * Component exports for the AI Study Platform
 *
 * This file provides centralized exports for all content renderer components
 * to simplify imports throughout the application.
 */

// Re-export default components
export {
	ContentRenderer,
	default as ContentRendererDefault,
} from "./ContentRenderer";
export {
	default as FlashcardRendererDefault,
	FlashcardRenderer,
} from "./FlashcardRenderer";
export {
	default as LessonRendererDefault,
	LessonRenderer,
} from "./LessonRenderer";
export { default as QuizRendererDefault, QuizRenderer } from "./QuizRenderer";
