/**
 * FlashcardRenderer Component
 *
 * Displays question/answer flashcards with flip interaction.
 * Includes tap/click handlers for revealing answers and mobile-first responsive design.
 *
 * Requirements: 3.2
 */

import {
	type FlashcardContent,
	isFlashcardContent,
	type StudyContent,
} from "@study-ai/core";
import type React from "react";
import { useState } from "react";

interface FlashcardRendererProps {
	content: StudyContent;
}

/**
 * Flashcard renderer with flip interaction
 */
export const FlashcardRenderer: React.FC<FlashcardRendererProps> = ({
	content,
}) => {
	const [isFlipped, setIsFlipped] = useState(false);

	// Type guard to ensure we have flashcard content
	if (!isFlashcardContent(content.content)) {
		return (
			<div className="flex items-center justify-center h-full p-6">
				<div className="text-center text-error">
					<p>Invalid flashcard content</p>
				</div>
			</div>
		);
	}

	const flashcardContent = content.content as FlashcardContent;

	const handleCardClick = () => {
		setIsFlipped(!isFlipped);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setIsFlipped(!isFlipped);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 bg-background">
			{/* Title */}
			<h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-foreground px-4">
				{content.title}
			</h2>

			{/* Flashcard Container */}
			<div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
				<button
					type="button"
					className={`relative w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] cursor-pointer transform transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 rounded-xl ${
						isFlipped ? "rotate-y-180" : ""
					}`}
					onClick={handleCardClick}
					onKeyDown={handleKeyDown}
					aria-label={isFlipped ? "Show question" : "Show answer"}
				>
					{/* Question Side */}
					<div
						className={`absolute inset-0 w-full h-full backface-hidden transition-opacity duration-300 ${
							isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
						}`}
					>
						<div className="w-full h-full bg-gradient-to-br from-flashcard-primary to-flashcard-secondary rounded-xl shadow-lg flex flex-col items-center justify-center p-6 sm:p-8">
							<div className="text-center">
								<div className="mb-4">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-card-background text-flashcard-primary">
										Question
									</span>
								</div>
								<p className="text-card-background text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
									{flashcardContent.question}
								</p>
								{flashcardContent.hint && (
									<div className="mt-6 p-3 bg-flashcard-secondary rounded-lg">
										<p className="text-card-background text-sm opacity-90">
											<span className="font-medium">Hint:</span>{" "}
											{flashcardContent.hint}
										</p>
									</div>
								)}
							</div>
							<div className="absolute bottom-4 right-4">
								<div className="text-card-background text-sm opacity-75">
									Tap to reveal answer
								</div>
							</div>
						</div>
					</div>

					{/* Answer Side */}
					<div
						className={`absolute inset-0 w-full h-full backface-hidden transition-opacity duration-300 ${
							isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
						}`}
					>
						<div className="w-full h-full bg-gradient-to-br from-success to-success rounded-xl shadow-lg flex flex-col items-center justify-center p-6 sm:p-8">
							<div className="text-center">
								<div className="mb-4">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-muted text-success-foreground">
										Answer
									</span>
								</div>
								<p className="text-success-foreground text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
									{flashcardContent.answer}
								</p>
							</div>
							<div className="absolute bottom-4 right-4">
								<div className="text-success-foreground text-sm opacity-75">
									Tap to show question
								</div>
							</div>
						</div>
					</div>
				</button>

				{/* Instructions */}
				<div className="mt-4 text-center">
					<p className="text-sm text-muted-foreground">
						{isFlipped
							? "Click the card to see the question again"
							: "Click the card to reveal the answer"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default FlashcardRenderer;
