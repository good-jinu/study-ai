import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean;
	ref?: React.Ref<HTMLSelectElement>;
}

function Select({ className, error, children, ref, ...props }: SelectProps) {
	return (
		<select
			className={cn(
				"w-full px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
				error ? "border-error" : "border-border",
				className,
			)}
			ref={ref}
			{...props}
		>
			{children}
		</select>
	);
}

Select.displayName = "Select";

export { Select };
