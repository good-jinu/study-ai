/**
 * ThemeProvider Component
 *
 * Provides theme context and handles theme switching behavior.
 * Supports both light and dark themes based on user system preferences
 * and manual theme selection.
 *
 * Requirements: 7.1, 7.2, 7.3
 */

"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

/**
 * Theme provider that manages theme state and applies theme classes
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	defaultTheme = "system",
	storageKey = "study-ai-theme",
}) => {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

	// Initialize theme from localStorage or system preference
	useEffect(() => {
		const storedTheme = localStorage.getItem(storageKey) as Theme;
		if (storedTheme) {
			setTheme(storedTheme);
		}
	}, [storageKey]);

	// Update resolved theme based on current theme and system preference
	useEffect(() => {
		const updateResolvedTheme = () => {
			if (theme === "system") {
				const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
					.matches
					? "dark"
					: "light";
				setResolvedTheme(systemTheme);
			} else {
				setResolvedTheme(theme);
			}
		};

		updateResolvedTheme();

		// Listen for system theme changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (theme === "system") {
				updateResolvedTheme();
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	// Apply theme to document root
	useEffect(() => {
		const root = document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");

		// Add current theme class
		root.classList.add(resolvedTheme);

		// Update CSS custom properties based on theme
		if (resolvedTheme === "dark") {
			root.style.colorScheme = "dark";
		} else {
			root.style.colorScheme = "light";
		}
	}, [resolvedTheme]);

	// Handle theme change
	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem(storageKey, newTheme);
	};

	const value: ThemeContextType = {
		theme,
		setTheme: handleSetTheme,
		resolvedTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export default ThemeProvider;
