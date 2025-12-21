/**
 * ThemeToggle Component
 *
 * Provides a button to toggle between light, dark, and system themes.
 * Includes proper accessibility features and visual feedback.
 *
 * Requirements: 7.2, 7.5
 */

"use client";

import type React from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Theme toggle button component
 */
export const ThemeToggle: React.FC = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();

	const handleToggle = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const getIcon = () => {
		if (theme === "system") {
			return (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>System theme</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			);
		}

		if (resolvedTheme === "dark") {
			return (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>Dark theme</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			);
		}

		return (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<title>Light theme</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		);
	};

	const getLabel = () => {
		if (theme === "system") {
			return `System theme (currently ${resolvedTheme})`;
		}
		return `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`;
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			className="fixed top-4 right-4 z-50 p-3 rounded-full bg-card-background border border-card-border shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
			aria-label={`Switch theme. Current: ${getLabel()}`}
			title={`Click to switch theme. Current: ${getLabel()}`}
		>
			<div className="text-foreground transition-colors duration-200">
				{getIcon()}
			</div>
		</button>
	);
};

export default ThemeToggle;
