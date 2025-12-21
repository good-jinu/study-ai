import { useCallback, useState } from "react";
import type { ContentResponse } from "@/types";
import { fetchStudyContent, getErrorMessage } from "../services/contentService";

export interface UseContentFetchingResult {
	isLoading: boolean;
	error: string | null;
	retryCount: number;
	fetchContent: (
		offset: number,
		limit: number,
	) => Promise<ContentResponse | null>;
	clearError: () => void;
	retry: () => Promise<ContentResponse | null>;
}

interface LastFetchParams {
	offset: number;
	limit: number;
}

/**
 * Custom hook for content fetching with error handling and recovery
 * Provides retry mechanisms and user-friendly error states
 */
export function useContentFetching(): UseContentFetchingResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);
	const [lastFetchParams, setLastFetchParams] =
		useState<LastFetchParams | null>(null);

	const fetchContent = useCallback(
		async (offset: number, limit: number): Promise<ContentResponse | null> => {
			setIsLoading(true);
			setError(null);
			setLastFetchParams({ offset, limit });

			try {
				const result = await fetchStudyContent({ offset, limit });
				setRetryCount(0); // Reset retry count on success
				return result;
			} catch (err) {
				const errorMessage = getErrorMessage(err);
				setError(errorMessage);
				setRetryCount((prev) => prev + 1);

				// Log error for debugging (in development)
				if (process.env.NODE_ENV === "development") {
					console.error("Content fetching error:", err);
				}

				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const retry = useCallback(async (): Promise<ContentResponse | null> => {
		if (!lastFetchParams) {
			setError("No previous request to retry");
			return null;
		}

		return fetchContent(lastFetchParams.offset, lastFetchParams.limit);
	}, [fetchContent, lastFetchParams]);

	const clearError = useCallback(() => {
		setError(null);
		setRetryCount(0);
	}, []);

	return {
		isLoading,
		error,
		retryCount,
		fetchContent,
		clearError,
		retry,
	};
}

/**
 * Hook for handling offline/online state
 */
export function useNetworkStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true,
	);

	useState(() => {
		if (typeof window === "undefined") return;

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	});

	return isOnline;
}
