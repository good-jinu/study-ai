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
				<div className="text-center text-error">
					<p>Invalid lesson or summary content</p>
				</div>
			</div>
		);
	}

	const lessonContent = content.content as LessonContent;
	const summaryContent = content.content as SummaryContent;

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Header */}
			<div className="flex-shrink-0 p-4 sm:p-6 border-b border-border">
				<h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
					{content.title}
				</h1>
				<div className="mt-2">
					<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lesson-primary text-background">
						{isSummary ? "Summary" : "Lesson"}
					</span>
				</div>
			</div>

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
									<section
										key={`section-${section.heading}-${sectionIndex}`}
										className="space-y-4"
									>
										<h2 className="text-xl sm:text-2xl font-semibold text-foreground border-l-4 border-lesson-primary pl-4">
											{section.heading}
										</h2>
										<div className="prose prose-gray max-w-none">
											<div className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
												{section.body}
											</div>
										</div>
									</section>
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
									<div className="bg-accent rounded-lg p-4 sm:p-6 border border-card-border">
										<h3 className="text-lg font-semibold text-accent-foreground mb-4">
											Key Points
										</h3>
										<ul className="space-y-2">
											{summaryContent.bulletPoints.map(
												(point: string, pointIndex: number) => (
													<li
														key={`bullet-${point.slice(0, 20)}-${pointIndex}`}
														className="flex items-start"
													>
														<span className="flex-shrink-0 w-2 h-2 bg-lesson-primary rounded-full mt-2 mr-3"></span>
														<span className="text-accent-foreground text-base leading-relaxed">
															{point}
														</span>
													</li>
												),
											)}
										</ul>
									</div>
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
												<span
													key={`topic-${topic}`}
													className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-card-background text-muted-foreground border border-card-border"
												>
													{topic}
												</span>
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
							<div className="bg-success-muted rounded-lg p-4 sm:p-6 mt-8 border border-success">
								<h3 className="text-lg font-semibold text-success-foreground mb-4 flex items-center">
									<span className="mr-2">💡</span>
									Key Takeaways
								</h3>
								<ul className="space-y-3">
									{lessonContent.keyPoints.map(
										(point: string, pointIndex: number) => (
											<li
												key={`keypoint-${point.slice(0, 20)}-${pointIndex}`}
												className="flex items-start"
											>
												<span className="flex-shrink-0 w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
													{pointIndex + 1}
												</span>
												<span className="text-success-foreground text-base leading-relaxed">
													{point}
												</span>
											</li>
										),
									)}
								</ul>
							</div>
						)}
				</div>

				{/* Bottom Padding for Mobile */}
				<div className="h-4 sm:h-6"></div>
			</div>

			{/* Scroll Indicator */}
			<div className="flex-shrink-0 p-2 text-center">
				<div className="text-xs text-muted-foreground">Scroll to read more</div>
			</div>
		</div>
	);
};

export default LessonRenderer;
