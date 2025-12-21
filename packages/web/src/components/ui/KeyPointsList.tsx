import { cn } from "@/lib/utils";

interface KeyPointsListProps {
	points: string[];
	title?: string;
	variant?: "bullets" | "numbered";
	className?: string;
}

export function KeyPointsList({
	points,
	title = "Key Points",
	variant = "bullets",
	className,
}: KeyPointsListProps) {
	if (!points || points.length === 0) return null;

	const isNumbered = variant === "numbered";

	return (
		<div
			className={cn(
				"rounded-lg p-4 sm:p-6 border",
				isNumbered
					? "bg-success-muted border-success"
					: "bg-accent border-card-border",
				className,
			)}
		>
			<h3
				className={cn(
					"text-lg font-semibold mb-4 flex items-center",
					isNumbered ? "text-success-foreground" : "text-accent-foreground",
				)}
			>
				{isNumbered && <span className="mr-2">💡</span>}
				{title}
			</h3>
			<ul className="space-y-3">
				{points.map((point, index) => (
					<li
						key={`point-${point.slice(0, 20)}-${index}`}
						className="flex items-start"
					>
						{isNumbered ? (
							<span className="flex-shrink-0 w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
								{index + 1}
							</span>
						) : (
							<span className="flex-shrink-0 w-2 h-2 bg-lesson-primary rounded-full mt-2 mr-3" />
						)}
						<span
							className={cn(
								"text-base leading-relaxed",
								isNumbered
									? "text-success-foreground"
									: "text-accent-foreground",
							)}
						>
							{point}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
