import type { StudyContent } from "@study-ai/core";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { DifficultyBadge } from "./DifficultyBadge";

interface MetadataDisplayProps {
	metadata?: StudyContent["metadata"];
	className?: string;
	position?: "absolute" | "relative";
}

export function MetadataDisplay({
	metadata,
	className,
	position = "absolute",
}: MetadataDisplayProps) {
	if (!metadata) return null;

	const containerClasses = cn(
		"z-10",
		position === "absolute" ? "absolute bottom-4 left-4" : "",
		className,
	);

	return (
		<div className={containerClasses}>
			<div className="flex flex-wrap gap-2">
				{metadata.difficulty && (
					<DifficultyBadge difficulty={metadata.difficulty} />
				)}
				{metadata.subject && (
					<Badge variant="default">{metadata.subject}</Badge>
				)}
				{metadata.tags && metadata.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{metadata.tags.map((tag) => (
							<Badge key={tag} variant="default" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
