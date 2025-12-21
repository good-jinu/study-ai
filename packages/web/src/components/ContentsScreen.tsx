"use client";

import { FastContent, type FetchCallback } from "@fastcontents/react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ContentRenderer } from "@/components/ContentRenderer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { NavigationControls } from "@/components/NavigationControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchStudyContent } from "@/services/contentService";
import type { StudyContent } from "@/types";

/**
 * ContentsScreen Component
 *
 * Client component that handles the interactive study content display
 * using FastContent for infinite scrolling and navigation.
 * Separated from the server component page for better performance.
 */
export default function ContentsScreen() {
	// Fetch callback that integrates with ContentService via server action
	const fetchCallback: FetchCallback<StudyContent> = async ({
		offset,
		limit,
	}: {
		offset: number;
		limit: number;
	}) => {
		const response = await fetchStudyContent({ offset, limit });
		return {
			items: response.contents,
			hasMore: response.hasMore,
		};
	};

	// Handle retry for error boundary
	const handleRetry = () => {
		// Force a page refresh to reset the FastContent state
		window.location.reload();
	};

	return (
		<div className="h-screen max-h-screen w-full max-w-2xl m-auto overflow-hidden relative">
			{/* Top Controls */}
			<div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
				<Link
					href="/admin"
					className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-background/90 transition-colors"
					title="Admin Panel"
				>
					<Settings className="h-5 w-5 text-foreground" />
				</Link>
				<ThemeToggle />
			</div>

			<ErrorBoundary
				onRetry={handleRetry}
				fallback={
					<div className="h-full flex items-center justify-center bg-background">
						<div className="text-center">
							<div className="text-error text-4xl mb-4">⚠️</div>
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Unable to load content
							</h2>
							<p className="text-muted-foreground mb-6">
								There was a problem loading the study platform. Please try
								again.
							</p>
							<button
								type="button"
								onClick={handleRetry}
								className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
							>
								Reload Page
							</button>
						</div>
					</div>
				}
			>
				<FastContent
					fetchCallback={fetchCallback}
					renderer={ContentRenderer}
					renderControls={NavigationControls}
					initialBatchSize={3}
					batchSize={2}
					fallback={<LoadingFallback message="Loading your study content..." />}
				/>
			</ErrorBoundary>
		</div>
	);
}
