import type React from "react";

interface EndOfContentProps {
	message?: string;
	onRetry?: () => void;
}

/**
 * End of content component that informs users when no more content is available
 */
export const EndOfContent: React.FC<EndOfContentProps> = ({
	message = "You've reached the end of available content!",
	onRetry,
}) => {
	return (
		<output
			className="h-full flex items-center justify-center bg-background p-6"
			aria-live="polite"
		>
			<div className="text-center max-w-md">
				<div
					className="text-6xl mb-4"
					role="img"
					aria-label="Celebration emoji"
				>
					🎉
				</div>
				<h2 className="text-xl font-semibold text-foreground mb-2">
					Great job studying!
				</h2>
				<p className="text-muted-foreground mb-6">{message}</p>

				{onRetry && (
					<button
						type="button"
						onClick={onRetry}
						className="px-6 py-3 bg-primary text-background rounded-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:scale-95"
						aria-label="Check for new study content"
					>
						Check for new content
					</button>
				)}

				<div className="mt-6 text-sm text-muted-foreground">
					<p>Come back later for more study materials!</p>
				</div>
			</div>
		</output>
	);
};

export default EndOfContent;
