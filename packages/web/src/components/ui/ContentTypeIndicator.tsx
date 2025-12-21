import type { ContentType } from "@study-ai/core";
import { Badge } from "./Badge";

interface ContentTypeIndicatorProps {
	type: ContentType;
	className?: string;
}

export function ContentTypeIndicator({
	type,
	className,
}: ContentTypeIndicatorProps) {
	const getVariant = (contentType: ContentType) => {
		switch (contentType) {
			case "flashcard":
				return "flashcard";
			case "quiz":
				return "quiz";
			case "lesson":
				return "lesson";
			case "summary":
				return "summary";
			default:
				return "default";
		}
	};

	return (
		<Badge variant={getVariant(type)} className={className}>
			{type}
		</Badge>
	);
}
