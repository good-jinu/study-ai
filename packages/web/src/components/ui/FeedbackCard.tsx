import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
	type: "success" | "error";
	title: string;
	message?: string;
	explanation?: string;
	children?: ReactNode;
	className?: string;
}

export function FeedbackCard({
	type,
	title,
	message,
	explanation,
	children,
	className,
}: FeedbackCardProps) {
	const isSuccess = type === "success";

	const containerClasses = cn(
		"rounded-lg p-4 sm:p-6 border",
		isSuccess
			? "bg-success-muted border-success"
			: "bg-error-muted border-error",
		className,
	);

	const textColor = isSuccess
		? "text-success-foreground"
		: "text-error-foreground";

	const icon = isSuccess ? "🎉" : "❌";

	return (
		<div className={containerClasses}>
			<div className="flex items-center mb-3">
				<span
					className={`text-2xl mr-2 ${isSuccess ? "text-success" : "text-error"}`}
				>
					{icon}
				</span>
				<h4 className={cn("text-lg font-semibold", textColor)}>{title}</h4>
			</div>

			{message && <p className={cn("mb-3", textColor)}>{message}</p>}

			{explanation && (
				<div>
					<h5 className={cn("font-medium mb-2", textColor)}>Explanation:</h5>
					<p className={cn("text-base leading-relaxed", textColor)}>
						{explanation}
					</p>
				</div>
			)}

			{children}
		</div>
	);
}
