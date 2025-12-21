import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
	children: ReactNode;
	className?: string;
	error?: string;
}

export function FormField({ children, className, error }: FormFieldProps) {
	return (
		<div className={cn("space-y-1", className)}>
			{children}
			{error && <p className="text-sm text-error">{error}</p>}
		</div>
	);
}

export interface FormSectionProps {
	title?: string;
	children: ReactNode;
	className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{title && (
				<h3 className="text-lg font-medium text-foreground">{title}</h3>
			)}
			{children}
		</div>
	);
}
