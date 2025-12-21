/**
 * SkipLink Component
 *
 * Provides a skip navigation link for keyboard users to jump directly
 * to the main content, improving accessibility for screen readers and
 * keyboard navigation.
 *
 * Requirements: 7.5
 */

import type React from "react";

interface SkipLinkProps {
	href?: string;
	children?: React.ReactNode;
}

/**
 * Skip link component for keyboard navigation accessibility
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
	href = "#main-content",
	children = "Skip to main content",
}) => {
	return (
		<a
			href={href}
			className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 bg-primary text-background rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
		>
			{children}
		</a>
	);
};

export default SkipLink;
