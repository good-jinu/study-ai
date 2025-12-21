import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
	heading: string;
	children: ReactNode;
	className?: string;
	headingLevel?: "h2" | "h3" | "h4";
}

export function ContentSection({
	heading,
	children,
	className,
	headingLevel = "h2",
}: ContentSectionProps) {
	const HeadingComponent = headingLevel;

	const headingClasses = cn(
		"font-semibold text-foreground border-l-4 border-lesson-primary pl-4",
		{
			"text-xl sm:text-2xl": headingLevel === "h2",
			"text-lg sm:text-xl": headingLevel === "h3",
			"text-base sm:text-lg": headingLevel === "h4",
		},
	);

	return (
		<section className={cn("space-y-4", className)}>
			<HeadingComponent className={headingClasses}>{heading}</HeadingComponent>
			<div className="prose prose-gray max-w-none">{children}</div>
		</section>
	);
}
