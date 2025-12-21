import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
	children: ReactNode;
	variant?: "default" | "question" | "answer" | "success" | "error" | "warning";
	className?: string;
	onClick?: () => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
	tabIndex?: number;
	role?: string;
	"aria-label"?: string;
}

export function ContentCard({
	children,
	variant = "default",
	className,
	onClick,
	onKeyDown,
	tabIndex,
	role,
	"aria-label": ariaLabel,
}: ContentCardProps) {
	const variants = {
		default: "bg-card-background border-card-border",
		question: "bg-gradient-to-br from-flashcard-primary to-flashcard-secondary",
		answer: "bg-gradient-to-br from-success to-success",
		success: "bg-success-muted border-success",
		error: "bg-error-muted border-error",
		warning: "bg-warning-muted border-warning",
	};

	const baseClasses = "rounded-lg border shadow-lg transition-all duration-200";
	const interactiveClasses = onClick
		? "cursor-pointer hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
		: "";

	const Component = onClick ? "button" : "div";

	return (
		<Component
			className={cn(
				baseClasses,
				variants[variant],
				interactiveClasses,
				className,
			)}
			onClick={onClick}
			onKeyDown={onKeyDown}
			tabIndex={tabIndex}
			role={role}
			aria-label={ariaLabel}
		>
			{children}
		</Component>
	);
}
