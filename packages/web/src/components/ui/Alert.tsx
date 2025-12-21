import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "error" | "warning" | "info" | "success";
	ref?: React.Ref<HTMLDivElement>;
}

function Alert({ className, variant = "info", ref, ...props }: AlertProps) {
	const variants = {
		error: "bg-error-muted border-error text-error",
		warning: "bg-warning-muted border-warning text-warning-foreground",
		info: "bg-info-muted border-info text-info-foreground",
		success: "bg-success-muted border-success text-success-foreground",
	};

	return (
		<div
			ref={ref}
			className={cn("border rounded-md p-4", variants[variant], className)}
			{...props}
		/>
	);
}

Alert.displayName = "Alert";

export { Alert };
