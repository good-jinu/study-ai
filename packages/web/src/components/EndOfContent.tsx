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
		<div className="h-full flex items-center justify-center bg-background p-6">
			<div className="text-center max-w-md">
				<div className="text-6xl mb-4">🎉</div>
				<h2 className="text-xl font-semibold text-foreground mb-2">
					Great job studying!
				</h2>
				<p className="text-muted-foreground mb-6">{message}</p>

				{onRetry && (
					<button
						type="button"
						onClick={onRetry}
						className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
					>
						Check for new content
					</button>
				)}

				<div className="mt-6 text-sm text-muted-foreground">
					<p>Come back later for more study materials!</p>
				</div>
			</div>
		</div>
	);
};

export default EndOfContent;
