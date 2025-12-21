import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	ref?: React.Ref<HTMLDivElement>;
}

function Card({ className, ref, ...props }: CardProps) {
	return (
		<div
			ref={ref}
			className={cn(
				"bg-card-background rounded-lg shadow-sm border border-card-border",
				className,
			)}
			{...props}
		/>
	);
}

Card.displayName = "Card";

function CardHeader({ className, ref, ...props }: CardProps) {
	return <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />;
}

CardHeader.displayName = "CardHeader";

function CardContent({ className, ref, ...props }: CardProps) {
	return <div ref={ref} className={cn("p-6", className)} {...props} />;
}

CardContent.displayName = "CardContent";

function CardFooter({ className, ref, ...props }: CardProps) {
	return (
		<div
			ref={ref}
			className={cn("p-6 pt-0 border-t border-card-border", className)}
			{...props}
		/>
	);
}

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
