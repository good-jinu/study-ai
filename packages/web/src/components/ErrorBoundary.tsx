import type React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

/**
 * Error boundary component to catch and handle React component crashes
 * Provides graceful degradation when components fail to render
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

		// Call optional error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			// Render custom fallback UI or default error message
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
					<div className="text-red-500 text-xl mb-4">⚠️</div>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						Something went wrong
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						We encountered an error while displaying this content.
					</p>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false, error: undefined })}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Try Again
					</button>
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
) {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary fallback={fallback}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
}
