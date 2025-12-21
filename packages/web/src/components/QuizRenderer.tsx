/**
 * QuizRenderer Component
 *
 * Creates interactive multiple choice interface with answer selection state management
 * and immediate feedback with explanation display.
 *
 * Requirements: 3.3
 */

import type React from "react";
import { useState } from "react";
import { isQuizContent, type QuizContent, type StudyContent } from "@/types";

interface QuizRendererProps {
	content: StudyContent;
}

/**
 * Quiz renderer with interactive multiple choice interface
 */
export const QuizRenderer: React.FC<QuizRendererProps> = ({ content }) => {
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);

	// Type guard to ensure we have quiz content
	if (!isQuizContent(content.content)) {
		return (
			<div className="flex items-center justify-center h-full p-6">
				<div className="text-center text-error">
					<p>Invalid quiz content</p>
				</div>
			</div>
		);
	}

	const quizContent = content.content as QuizContent;

	const handleAnswerSelect = (answerIndex: number) => {
		if (isAnswered) return; // Prevent changing answer after submission

		setSelectedAnswer(answerIndex);
		setIsAnswered(true);
	};

	const handleKeyDown = (event: React.KeyboardEvent, answerIndex: number) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleAnswerSelect(answerIndex);
		}
	};

	const resetQuiz = () => {
		setSelectedAnswer(null);
		setIsAnswered(false);
	};

	const isCorrect = selectedAnswer === quizContent.correctAnswer;

	return (
		<div className="flex flex-col h-full p-4 sm:p-6 md:p-8 overflow-y-auto bg-background">
			{/* Title */}
			<h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-foreground">
				{content.title}
			</h2>

			{/* Question */}
			<div className="mb-8">
				<div className="bg-muted rounded-lg p-4 sm:p-6 border border-card-border">
					<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
						Question
					</h3>
					<p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
						{quizContent.question}
					</p>
				</div>
			</div>

			{/* Answer Options */}
			<div className="mb-8 space-y-3">
				<h4 className="text-lg font-semibold text-foreground mb-4">
					Choose your answer:
				</h4>
				{quizContent.options.map((option, index) => {
					const isSelected = selectedAnswer === index;
					const isCorrectAnswer = index === quizContent.correctAnswer;

					let buttonClasses =
						"w-full p-4 text-left rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 ";

					if (!isAnswered) {
						// Before answering
						buttonClasses +=
							"border-border bg-card-background hover:border-quiz-primary hover:bg-accent cursor-pointer";
					} else {
						// After answering
						if (isCorrectAnswer) {
							buttonClasses += "border-success bg-success-muted";
						} else if (isSelected && !isCorrectAnswer) {
							buttonClasses += "border-error bg-error-muted";
						} else {
							buttonClasses += "border-border bg-muted opacity-60";
						}
					}

					return (
						<button
							type="button"
							key={`option-${option.slice(0, 20)}-${index}`}
							onClick={() => handleAnswerSelect(index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							disabled={isAnswered}
							className={buttonClasses}
							aria-label={`Option ${index + 1}: ${option}`}
						>
							<div className="flex items-center">
								<span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 font-semibold">
									{String.fromCharCode(65 + index)}
								</span>
								<span className="text-foreground text-base sm:text-lg">
									{option}
								</span>
								{isAnswered && isCorrectAnswer && (
									<span className="ml-auto text-success">✓ Correct</span>
								)}
								{isAnswered && isSelected && !isCorrectAnswer && (
									<span className="ml-auto text-error">✗ Incorrect</span>
								)}
							</div>
						</button>
					);
				})}
			</div>

			{/* Feedback Section */}
			{isAnswered && (
				<div className="mb-6">
					<div
						className={`rounded-lg p-4 sm:p-6 border ${
							isCorrect
								? "bg-success-muted border-success"
								: "bg-error-muted border-error"
						}`}
					>
						<div className="flex items-center mb-3">
							<span
								className={`text-2xl mr-2 ${
									isCorrect ? "text-success" : "text-error"
								}`}
							>
								{isCorrect ? "🎉" : "❌"}
							</span>
							<h4
								className={`text-lg font-semibold ${
									isCorrect
										? "text-success-foreground"
										: "text-error-foreground"
								}`}
							>
								{isCorrect ? "Correct!" : "Incorrect"}
							</h4>
						</div>

						{!isCorrect && (
							<p className="text-error-foreground mb-3">
								The correct answer is:{" "}
								<strong>
									{quizContent.options[quizContent.correctAnswer]}
								</strong>
							</p>
						)}

						{quizContent.explanation && (
							<div>
								<h5
									className={`font-medium mb-2 ${
										isCorrect
											? "text-success-foreground"
											: "text-error-foreground"
									}`}
								>
									Explanation:
								</h5>
								<p
									className={`text-base leading-relaxed ${
										isCorrect
											? "text-success-foreground"
											: "text-error-foreground"
									}`}
								>
									{quizContent.explanation}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Reset Button */}
			{isAnswered && (
				<div className="mt-auto pt-4">
					<button
						type="button"
						onClick={resetQuiz}
						className="w-full py-3 px-4 bg-quiz-primary hover:bg-quiz-secondary text-background font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
					>
						Try Again
					</button>
				</div>
			)}

			{/* Instructions */}
			{!isAnswered && (
				<div className="mt-auto pt-4 text-center">
					<p className="text-sm text-muted-foreground">
						Select an answer to see immediate feedback
					</p>
				</div>
			)}
		</div>
	);
};

export default QuizRenderer;
