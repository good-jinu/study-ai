import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	ref?: React.Ref<HTMLInputElement>;
}

function Input({ className, error, ref, ...props }: InputProps) {
	return (
		<input
			className={cn(
				"w-full px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
				error ? "border-error" : "border-border",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
}

Input.displayName = "Input";

export { Input };
