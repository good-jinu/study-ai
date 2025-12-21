/**
 * QuizRenderer Component
 *
 * Creates interactive multiple choice interface with answer selection state management
 * and immediate feedback with explanation display.
 *
 * Requirements: 3.3
 */

import {
	isQuizContent,
	type QuizContent,
	type StudyContent,
} from "@study-ai/core";
import type React from "react";
import { useState } from "react";
import {
	Alert,
	AnswerOption,
	Button,
	Card,
	CardContent,
	FeedbackCard,
} from "@/components/ui";

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
				<Alert variant="error">Invalid quiz content</Alert>
			</div>
		);
	}

	const quizContent = content.content as QuizContent;

	const handleAnswerSelect = (answerIndex: number) => {
		if (isAnswered) return; // Prevent changing answer after submission

		setSelectedAnswer(answerIndex);
		setIsAnswered(true);
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
				<Card>
					<CardContent className="p-4 sm:p-6">
						<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
							Question
						</h3>
						<p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
							{quizContent.question}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Answer Options */}
			<div className="mb-8 space-y-3">
				<h4 className="text-lg font-semibold text-foreground mb-4">
					Choose your answer:
				</h4>
				{quizContent.options.map((option: string, index: number) => (
					<AnswerOption
						key={`option-${option.slice(0, 20)}-${index}`}
						option={option}
						index={index}
						isSelected={selectedAnswer === index}
						isCorrect={index === quizContent.correctAnswer}
						isAnswered={isAnswered}
						onSelect={handleAnswerSelect}
					/>
				))}
			</div>

			{/* Feedback Section */}
			{isAnswered && (
				<div className="mb-6">
					<FeedbackCard
						type={isCorrect ? "success" : "error"}
						title={isCorrect ? "Correct!" : "Incorrect"}
						message={
							!isCorrect
								? `The correct answer is: ${quizContent.options[quizContent.correctAnswer]}`
								: undefined
						}
						explanation={quizContent.explanation}
					/>
				</div>
			)}

			{/* Reset Button */}
			{isAnswered && (
				<div className="mt-auto pt-4">
					<Button
						onClick={resetQuiz}
						className="w-full bg-quiz-primary hover:bg-quiz-secondary text-background"
					>
						Try Again
					</Button>
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
