/**
 * NavigationControls Component
 *
 * Provides navigation interface with loading states for the AI Study Platform.
 * Designed for mobile-first interaction with touch-friendly buttons positioned
 * for easy thumb access. Includes keyboard navigation support for accessibility.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import type React from "react";
import { useEffect, useRef } from "react";

/**
 * Props interface for NavigationControls component
 * These props are typically provided by FastContent library
 */
export interface NavigationControlsProps {
	/** Whether there is previous content available */
	hasPrev: boolean;
	/** Whether there is next content available */
	hasNext: boolean;
	/** Function to navigate to previous content */
	onPrev: () => void;
	/** Function to navigate to next content */
	onNext: () => void;
	/** Whether content is currently loading */
	isLoading?: boolean;
	/** Current content index for accessibility */
	currentIndex?: number;
	/** Total content count for accessibility */
	totalCount?: number;
}

/**
 * NavigationControls component that provides previous/next navigation
 * with loading states, mobile-optimized positioning, and keyboard navigation support
 */
export const NavigationControls: React.FC<NavigationControlsProps> = ({
	hasPrev,
	hasNext,
	onPrev,
	onNext,
	isLoading = false,
	currentIndex,
	totalCount,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	// Keyboard navigation support
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Only handle keyboard events when the navigation controls are in focus
			// or when no other input elements are focused
			const activeElement = document.activeElement;
			const isInputFocused =
				activeElement &&
				(activeElement.tagName === "INPUT" ||
					activeElement.tagName === "TEXTAREA" ||
					(activeElement as HTMLElement).contentEditable === "true");

			// Skip keyboard handling if an input is focused
			if (isInputFocused) {
				return;
			}

			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault();
					if (hasPrev && !isLoading) {
						onPrev();
					}
					break;
				case "ArrowRight":
					event.preventDefault();
					if (hasNext && !isLoading) {
						onNext();
					}
					break;
				case " ": // Space bar
					event.preventDefault();
					if (hasNext && !isLoading) {
						onNext();
					}
					break;
				case "ArrowUp":
					event.preventDefault();
					if (hasPrev && !isLoading) {
						onPrev();
					}
					break;
				case "ArrowDown":
					event.preventDefault();
					if (hasNext && !isLoading) {
						onNext();
					}
					break;
			}
		};

		// Add event listener to document for global keyboard navigation
		document.addEventListener("keydown", handleKeyDown);

		// Focus management - ensure the container can receive focus
		if (containerRef.current) {
			containerRef.current.setAttribute("tabindex", "0");
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [hasPrev, hasNext, onPrev, onNext, isLoading]);

	// Handle focus on the container for accessibility
	const handleContainerFocus = () => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	};

	// Handle keyboard events on the container
	const handleContainerKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case "Enter":
			case " ":
				event.preventDefault();
				handleContainerFocus();
				break;
		}
	};

	return (
		<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
			<nav
				ref={containerRef}
				className="flex items-center gap-4 bg-card-background/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-card-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
				aria-label="Content navigation controls"
				onClick={handleContainerFocus}
				onKeyDown={handleContainerKeyDown}
			>
				{/* Previous Button */}
				<button
					type="button"
					onClick={onPrev}
					disabled={!hasPrev || isLoading}
					className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
            ${
							!hasPrev || isLoading
								? "bg-muted text-muted-foreground cursor-not-allowed"
								: "bg-primary text-background hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg"
						}
          `}
					aria-label="Previous content (Left arrow key)"
					aria-disabled={!hasPrev || isLoading}
					title="Previous content (Left arrow or Up arrow)"
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
					) : (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<title>Previous</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					)}
				</button>

				{/* Content Position Indicator */}
				{currentIndex !== undefined && totalCount !== undefined && (
					<div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
						<span className="text-sm font-medium text-foreground">
							{currentIndex + 1}
						</span>
						<span className="text-xs text-muted-foreground">of</span>
						<span className="text-sm font-medium text-foreground">
							{totalCount}
						</span>
					</div>
				)}

				{/* Next Button */}
				<button
					type="button"
					onClick={onNext}
					disabled={!hasNext || isLoading}
					className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
            ${
							!hasNext || isLoading
								? "bg-muted text-muted-foreground cursor-not-allowed"
								: "bg-primary text-background hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg"
						}
          `}
					aria-label="Next content (Right arrow key or Space)"
					aria-disabled={!hasNext || isLoading}
					title="Next content (Right arrow, Down arrow, or Space)"
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
					) : (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<title>Next</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					)}
				</button>
			</nav>
		</div>
	);
};

export default NavigationControls;
