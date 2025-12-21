/**
 * ContentRenderer Component
 *
 * Polymorphic renderer that determines content type and delegates to appropriate
 * sub-components. Provides fallback for unknown content types and maintains
 * consistent styling using Tailwind classes.
 *
 * Requirements: 3.1, 3.5, 6.5
 */

import type React from "react";
import type { StudyContent } from "@/types";
import { FlashcardRenderer } from "./FlashcardRenderer";
import { LessonRenderer } from "./LessonRenderer";
import { QuizRenderer } from "./QuizRenderer";

interface ContentRendererProps {
	content: StudyContent;
	index: number;
}

/**
 * Main content renderer component that switches between different content types
 */
export const ContentRenderer: React.FC<ContentRendererProps> = ({
	content,
}) => {
	// Fallback component for unknown content types
	const UnknownContentFallback: React.FC<{ content: StudyContent }> = ({
		content,
	}) => (
		<div className="flex flex-col items-center justify-center h-full p-6 text-center">
			<div className="bg-warning-muted border border-warning rounded-lg p-4 max-w-md">
				<h3 className="text-lg font-semibold text-warning-foreground mb-2">
					Unknown Content Type
				</h3>
				<p className="text-warning-foreground mb-4">
					Content type "{content.type}" is not supported.
				</p>
				<div className="text-left">
					<h4 className="font-medium text-warning-foreground mb-2">
						{content.title}
					</h4>
					<pre className="text-sm text-muted-foreground bg-muted p-2 rounded overflow-auto">
						{JSON.stringify(content.content, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);

	// Main container with consistent styling
	return (
		<div className="w-full h-full flex flex-col bg-background text-foreground">
			{/* Content type indicator for debugging */}
			<div className="absolute top-4 right-4 z-10">
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
					{content.type}
				</span>
			</div>

			{/* Content area with full height */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{(() => {
					switch (content.type) {
						case "flashcard":
							return <FlashcardRenderer content={content} />;
						case "quiz":
							return <QuizRenderer content={content} />;
						case "lesson":
							return <LessonRenderer content={content} />;
						case "summary":
							// Summary uses the same renderer as lesson for now
							return <LessonRenderer content={content} />;
						default:
							return <UnknownContentFallback content={content} />;
					}
				})()}
			</div>

			{/* Metadata display */}
			{content.metadata && (
				<div className="absolute bottom-4 left-4 z-10">
					<div className="flex flex-wrap gap-2">
						{content.metadata.difficulty && (
							<span
								className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
									content.metadata.difficulty === "easy"
										? "bg-success-muted text-success-foreground"
										: content.metadata.difficulty === "medium"
											? "bg-warning-muted text-warning-foreground"
											: "bg-error-muted text-error-foreground"
								}`}
							>
								{content.metadata.difficulty}
							</span>
						)}
						{content.metadata.subject && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
								{content.metadata.subject}
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ContentRenderer;
