import {
	type ButtonHTMLAttributes,
	cloneElement,
	type ReactElement,
} from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	asChild?: boolean;
	ref?: React.Ref<HTMLButtonElement>;
}

function Button({
	className,
	variant = "primary",
	size = "md",
	asChild = false,
	children,
	ref,
	...props
}: ButtonProps) {
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

	const variants = {
		primary:
			"bg-primary text-background hover:opacity-90 border border-transparent",
		secondary:
			"bg-card-background text-foreground hover:bg-muted border border-border",
		danger:
			"bg-card-background text-error hover:bg-error-muted border border-error",
		ghost: "bg-transparent text-foreground hover:bg-muted border-none",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
	};

	const classes = cn(baseClasses, variants[variant], sizes[size], className);

	if (asChild && children) {
		return cloneElement(children as ReactElement, {
			className: cn(classes, (children as ReactElement).props?.className),
			...props,
		});
	}

	return (
		<button className={classes} ref={ref} {...props}>
			{children}
		</button>
	);
}

Button.displayName = "Button";

export { Button };
