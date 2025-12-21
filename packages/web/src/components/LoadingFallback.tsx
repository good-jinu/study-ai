/**
 * LoadingFallback Component
 *
 * Displays a loading state with spinner for content fetching operations.
 * Used as fallback component while FastContent is loading initial content.
 *
 * Requirements: 1.5
 */

import type React from "react";
import Spinner from "@/components/ui/Spinner";

interface LoadingFallbackProps {
	message?: string;
	size?: "sm" | "md" | "lg";
}

/**
 * Loading fallback component with spinner and customizable message
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
	message = "Loading content...",
	size = "lg",
}) => {
	return (
		<output
			className="h-full flex items-center justify-center bg-background"
			aria-live="polite"
			aria-label="Loading content"
		>
			<div className="text-center">
				<Spinner size={size} />
				<p className="text-muted-foreground text-lg mt-4" id="loading-message">
					{message}
				</p>
			</div>
		</output>
	);
};

export default LoadingFallback;
