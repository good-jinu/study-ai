import Spinner from "./ui/Spinner";

interface RetryButtonProps {
	onRetry: () => void;
	isLoading?: boolean;
	retryCount?: number;
	error?: string;
	className?: string;
}

/**
 * Reusable retry button component with loading states and retry count display
 */
export function RetryButton({
	onRetry,
	isLoading = false,
	retryCount = 0,
	error,
	className = "",
}: RetryButtonProps) {
	const getRetryText = () => {
		if (isLoading) return "Retrying...";
		if (retryCount > 0) return `Retry (${retryCount})`;
		return "Retry";
	};

	return (
		<div className={`flex flex-col items-center space-y-3 ${className}`}>
			{error && (
				<p className="text-red-600 dark:text-red-400 text-sm text-center max-w-sm">
					{error}
				</p>
			)}

			<button
				type="button"
				onClick={onRetry}
				disabled={isLoading}
				className={`
          px-6 py-2 rounded-lg font-medium transition-all duration-200
          ${
						isLoading
							? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
							: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md active:scale-95"
					}
        `}
			>
				{isLoading && <Spinner />}
				{getRetryText()}
			</button>

			{retryCount > 2 && (
				<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
					Having trouble? Check your internet connection.
				</p>
			)}
		</div>
	);
}

/**
 * Network error display component with retry functionality
 */
export function NetworkErrorDisplay({
	onRetry,
	isLoading = false,
	retryCount = 0,
}: Omit<RetryButtonProps, "error">) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
			<div className="text-gray-400 text-4xl mb-4">📡</div>
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
				Connection Problem
			</h3>
			<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
				We're having trouble loading your study content. Please check your
				internet connection and try again.
			</p>
			<RetryButton
				onRetry={onRetry}
				isLoading={isLoading}
				retryCount={retryCount}
			/>
		</div>
	);
}
