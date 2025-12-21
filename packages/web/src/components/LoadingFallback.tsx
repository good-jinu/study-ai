/**
 * LoadingFallback Component
 *
 * Displays a loading state with animated IdleMotion for content fetching operations.
 * Used as fallback component while FastContent is loading initial content.
 *
 * Requirements: 1.5
 */

import type React from "react";
import IdleMotion from "@/components/ui/IdleMotion";

interface LoadingFallbackProps {
	message?: string;
	size?: "sm" | "md" | "lg";
	speed?: "slow" | "normal" | "fast";
	className?: string;
}

/**
 * Loading fallback component with IdleMotion animation and customizable message
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
	message = "Loading content...",
	size = "lg",
	speed = "normal",
	className,
}) => {
	return (
		<output
			className={`h-full flex items-center justify-center bg-background ${className || ""}`}
			aria-live="polite"
			aria-label="Loading content"
		>
			<div className="text-center">
				<IdleMotion size={size} speed={speed} />
				<p className="text-muted-foreground text-lg mt-4" id="loading-message">
					{message}
				</p>
			</div>
		</output>
	);
};

export default LoadingFallback;
