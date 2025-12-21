import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?:
		| "default"
		| "flashcard"
		| "quiz"
		| "lesson"
		| "summary"
		| "difficulty";
	ref?: React.Ref<HTMLSpanElement>;
}

function Badge({ className, variant = "default", ref, ...props }: BadgeProps) {
	const variants = {
		default: "bg-muted text-muted-foreground",
		flashcard: "bg-flashcard-primary text-background",
		quiz: "bg-quiz-primary text-background",
		lesson: "bg-lesson-primary text-background",
		summary: "bg-warning text-warning-foreground",
		difficulty: "bg-muted text-muted-foreground",
	};

	return (
		<span
			ref={ref}
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
				variants[variant],
				className,
			)}
			{...props}
		/>
	);
}

Badge.displayName = "Badge";

export { Badge };
