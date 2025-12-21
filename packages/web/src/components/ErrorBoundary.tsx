import type React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { RetryButton } from "./RetryButton";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	onRetry?: () => void;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

/**
 * Error boundary component to catch and handle React component crashes
 * Provides graceful degradation when components fail to render
 * Enhanced with retry functionality and better error messaging
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log the error for debugging
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Store error info in state for better error reporting
		this.setState({ errorInfo });

		// Call optional error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	handleRetry = () => {
		// Reset error state
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });

		// Call optional retry handler
		if (this.props.onRetry) {
			this.props.onRetry();
		}
	};

	render() {
		if (this.state.hasError) {
			// Render custom fallback UI or default error message
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div
					className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-background"
					role="alert"
					aria-live="assertive"
				>
					<div
						className="text-error text-4xl mb-4"
						role="img"
						aria-label="Warning icon"
					>
						⚠️
					</div>
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Something went wrong
					</h2>
					<p className="text-muted-foreground mb-6 max-w-md">
						We encountered an error while displaying this content. This might be
						a temporary issue.
					</p>

					<div className="space-y-4">
						<RetryButton onRetry={this.handleRetry} />

						{/* Error details for development */}
						{process.env.NODE_ENV === "development" && this.state.error && (
							<details className="mt-6 text-left max-w-lg">
								<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded">
									Error Details (Development)
								</summary>
								<div className="mt-2 p-4 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto">
									<div className="mb-2">
										<strong>Error:</strong> {this.state.error.message}
									</div>
									{this.state.error.stack && (
										<div>
											<strong>Stack:</strong>
											<pre className="whitespace-pre-wrap mt-1">
												{this.state.error.stack}
											</pre>
										</div>
									)}
								</div>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode,
	onRetry?: () => void,
) {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary fallback={fallback} onRetry={onRetry}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
}
