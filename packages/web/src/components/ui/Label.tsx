import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
	ref?: React.Ref<HTMLLabelElement>;
}

function Label({
	className,
	required,
	children,
	htmlFor,
	ref,
	...props
}: LabelProps) {
	return (
		<label
			className={cn(
				"block text-sm font-medium text-foreground mb-2",
				className,
			)}
			htmlFor={htmlFor}
			ref={ref}
			{...props}
		>
			{children}
			{required && <span className="text-error ml-1">*</span>}
		</label>
	);
}

Label.displayName = "Label";

export { Label };
