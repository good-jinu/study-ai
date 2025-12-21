interface AnswerOptionProps {
	option: string;
	index: number;
	isSelected: boolean;
	isCorrect: boolean;
	isAnswered: boolean;
	onSelect: (index: number) => void;
	disabled?: boolean;
}

export function AnswerOption({
	option,
	index,
	isSelected,
	isCorrect,
	isAnswered,
	onSelect,
	disabled = false,
}: AnswerOptionProps) {
	const handleClick = () => {
		if (!disabled && !isAnswered) {
			onSelect(index);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	const getButtonClasses = () => {
		let classes =
			"w-full p-4 text-left rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 ";

		if (!isAnswered) {
			classes +=
				"border-border bg-card-background hover:border-quiz-primary hover:bg-accent cursor-pointer";
		} else {
			if (isCorrect) {
				classes += "border-success bg-success-muted";
			} else if (isSelected && !isCorrect) {
				classes += "border-error bg-error-muted";
			} else {
				classes += "border-border bg-muted opacity-60";
			}
		}

		return classes;
	};

	const getStatusIndicator = () => {
		if (!isAnswered) return null;

		if (isCorrect) {
			return <span className="ml-auto text-success">✓ Correct</span>;
		}

		if (isSelected && !isCorrect) {
			return <span className="ml-auto text-error">✗ Incorrect</span>;
		}

		return null;
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			disabled={disabled || isAnswered}
			className={getButtonClasses()}
			aria-label={`Option ${index + 1}: ${option}`}
		>
			<div className="flex items-center">
				<span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 font-semibold">
					{String.fromCharCode(65 + index)}
				</span>
				<span className="text-foreground text-base sm:text-lg">{option}</span>
				{getStatusIndicator()}
			</div>
		</button>
	);
}
