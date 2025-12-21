import type { DifficultyLevel } from "@study-ai/core";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
	difficulty: DifficultyLevel;
	className?: string;
}

export function DifficultyBadge({
	difficulty,
	className,
}: DifficultyBadgeProps) {
	const getDifficultyStyles = (level: DifficultyLevel) => {
		switch (level) {
			case "easy":
				return "bg-success-muted text-success-foreground border-success";
			case "medium":
				return "bg-warning-muted text-warning-foreground border-warning";
			case "hard":
				return "bg-error-muted text-error-foreground border-error";
			default:
				return "bg-muted text-muted-foreground border-border";
		}
	};

	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
				getDifficultyStyles(difficulty),
				className,
			)}
		>
			{difficulty}
		</span>
	);
}
