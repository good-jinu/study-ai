import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
	ref?: React.Ref<HTMLTextAreaElement>;
}

function Textarea({ className, error, ref, ...props }: TextareaProps) {
	return (
		<textarea
			className={cn(
				"w-full px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-vertical",
				error ? "border-error" : "border-border",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
}

Textarea.displayName = "Textarea";

export { Textarea };
