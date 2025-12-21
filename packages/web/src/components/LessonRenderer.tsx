/**
 * LessonRenderer Component
 *
 * Creates scrollable content sections with typography hierarchy,
 * key points summary display, and mobile-optimized formatting.
 *
 * Requirements: 3.4
 */

import {
	isLessonContent,
	isSummaryContent,
	type LessonContent,
	type StudyContent,
	type SummaryContent,
} from "@study-ai/core";
import type React from "react";
import {
	Alert,
	Badge,
	ContentHeader,
	ContentSection,
	KeyPointsList,
} from "@/components/ui";

interface LessonRendererProps {
	content: StudyContent;
}

/**
 * Lesson renderer with scrollable content sections and typography hierarchy
 */
export const LessonRenderer: React.FC<LessonRendererProps> = ({ content }) => {
	// Type guards to handle both lesson and summary content
	const isLesson = isLessonContent(content.content);
	const isSummary = isSummaryContent(content.content);

	if (!isLesson && !isSummary) {
		return (
			<div className="flex items-center justify-center h-full p-6">
				<Alert variant="error">Invalid lesson or summary content</Alert>
			</div>
		);
	}

	const lessonContent = content.content as LessonContent;
	const summaryContent = content.content as SummaryContent;

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Header */}
			<ContentHeader
				title={content.title}
				type={content.type}
				subtitle={isSummary ? "Summary" : "Lesson"}
			/>

			{/* Scrollable Content Area */}
			<div className="flex-1 overflow-y-auto">
				<div className="p-4 sm:p-6 space-y-6">
					{/* Lesson Content Sections */}
					{isLesson && lessonContent.sections && (
						<div className="space-y-8">
							{lessonContent.sections.map(
								(
									section: { heading: string; body: string },
									sectionIndex: number,
								) => (
									<ContentSection
										key={`section-${section.heading}-${sectionIndex}`}
										heading={section.heading}
									>
										<div className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
											{section.body}
										</div>
									</ContentSection>
								),
							)}
						</div>
					)}

					{/* Summary Content */}
					{isSummary && (
						<div className="space-y-6">
							<div className="prose prose-gray max-w-none">
								<div className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
									{summaryContent.summary}
								</div>
							</div>

							{/* Summary Bullet Points */}
							{summaryContent.bulletPoints &&
								summaryContent.bulletPoints.length > 0 && (
									<KeyPointsList
										points={summaryContent.bulletPoints}
										title="Key Points"
										variant="bullets"
									/>
								)}

							{/* Related Topics */}
							{summaryContent.relatedTopics &&
								summaryContent.relatedTopics.length > 0 && (
									<div className="bg-muted rounded-lg p-4 sm:p-6 border border-card-border">
										<h3 className="text-lg font-semibold text-foreground mb-4">
											Related Topics
										</h3>
										<div className="flex flex-wrap gap-2">
											{summaryContent.relatedTopics.map((topic: string) => (
												<Badge
													key={`topic-${topic}`}
													variant="default"
													className="border border-card-border"
												>
													{topic}
												</Badge>
											))}
										</div>
									</div>
								)}
						</div>
					)}

					{/* Key Points for Lessons */}
					{isLesson &&
						lessonContent.keyPoints &&
						lessonContent.keyPoints.length > 0 && (
							<KeyPointsList
								points={lessonContent.keyPoints}
								title="Key Takeaways"
								variant="numbered"
								className="mt-8"
							/>
						)}
				</div>

				{/* Bottom Padding for Mobile */}
				<div className="h-4 sm:h-6" />
			</div>

			{/* Scroll Indicator */}
			<div className="flex-shrink-0 p-2 text-center">
				<div className="text-xs text-muted-foreground">Scroll to read more</div>
			</div>
		</div>
	);
};

export default LessonRenderer;
