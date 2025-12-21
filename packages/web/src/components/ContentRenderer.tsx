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
import { Alert, ContentTypeIndicator, MetadataDisplay } from "@/components/ui";
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
			<div className="max-w-md">
				<Alert variant="warning">
					<h3 className="text-lg font-semibold mb-2">Unknown Content Type</h3>
					<p className="mb-4">
						Content type "{content.type}" is not supported.
					</p>
					<div className="text-left">
						<h4 className="font-medium mb-2">{content.title}</h4>
						<pre className="text-sm text-muted-foreground bg-muted p-2 rounded overflow-auto">
							{JSON.stringify(content.content, null, 2)}
						</pre>
					</div>
				</Alert>
			</div>
		</div>
	);

	// Main container with consistent styling
	return (
		<div className="w-full h-full flex flex-col bg-background text-foreground">
			{/* Content type indicator for debugging */}
			<div className="absolute top-4 right-4 z-10">
				<ContentTypeIndicator type={content.type} />
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
			<MetadataDisplay metadata={content.metadata} />
		</div>
	);
};

export default ContentRenderer;
