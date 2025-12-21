import type { ContentType } from "@study-ai/core";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ContentTypeIndicator } from "./ContentTypeIndicator";

interface ContentHeaderProps {
	title: string;
	type: ContentType;
	subtitle?: string;
	children?: ReactNode;
	className?: string;
}

export function ContentHeader({
	title,
	type,
	subtitle,
	children,
	className,
}: ContentHeaderProps) {
	return (
		<div
			className={cn(
				"flex-shrink-0 p-4 sm:p-6 border-b border-border",
				className,
			)}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
						{title}
					</h1>
					{subtitle && (
						<p className="text-muted-foreground text-base sm:text-lg mb-2">
							{subtitle}
						</p>
					)}
					<ContentTypeIndicator type={type} />
				</div>
				{children}
			</div>
		</div>
	);
}
