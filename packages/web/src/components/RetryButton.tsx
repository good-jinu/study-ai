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
				<p
					className="text-error text-sm text-center max-w-sm"
					role="alert"
					aria-live="polite"
				>
					{error}
				</p>
			)}

			<button
				type="button"
				onClick={onRetry}
				disabled={isLoading}
				className={`
          px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
          ${
						isLoading
							? "bg-muted text-muted-foreground cursor-not-allowed"
							: "bg-primary hover:opacity-90 text-background shadow-sm hover:shadow-md active:scale-95"
					}
        `}
				aria-label={
					isLoading ? "Retrying to load content" : "Retry loading content"
				}
			>
				{isLoading && <Spinner />}
				{getRetryText()}
			</button>

			{retryCount > 2 && (
				<p className="text-xs text-muted-foreground text-center">
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
		<div
			className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center"
			role="alert"
			aria-live="polite"
		>
			<div
				className="text-muted-foreground text-4xl mb-4"
				role="img"
				aria-label="Network connection icon"
			>
				📡
			</div>
			<h3 className="text-lg font-semibold text-foreground mb-2">
				Connection Problem
			</h3>
			<p className="text-muted-foreground mb-6 max-w-sm">
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
