"use client";

import type {
	ContentType,
	DifficultyLevel,
	FlashcardContent,
	LessonContent,
	QuizContent,
	StudyContent,
	SummaryContent,
} from "@study-ai/core";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
	createContentAction,
	updateContentAction,
} from "@/actions/adminActions";

interface ContentFormProps {
	initialData?: StudyContent;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
	{ value: "flashcard", label: "Flashcard" },
	{ value: "quiz", label: "Quiz" },
	{ value: "lesson", label: "Lesson" },
	{ value: "summary", label: "Summary" },
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
	{ value: "easy", label: "Easy" },
	{ value: "medium", label: "Medium" },
	{ value: "hard", label: "Hard" },
];

export default function ContentForm({ initialData }: ContentFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [type, setType] = useState<ContentType>(
		initialData?.type || "flashcard",
	);
	const [title, setTitle] = useState(initialData?.title || "");
	const [difficulty, setDifficulty] = useState<DifficultyLevel | "">(
		initialData?.metadata?.difficulty || "",
	);
	const [subject, setSubject] = useState(initialData?.metadata?.subject || "");
	const [tags, setTags] = useState(
		initialData?.metadata?.tags?.join(", ") || "",
	);

	// Content-specific state
	const [flashcardContent, setFlashcardContent] = useState<FlashcardContent>(
		() => {
			if (initialData?.type === "flashcard") {
				return initialData.content as FlashcardContent;
			}
			return { question: "", answer: "", hint: "" };
		},
	);

	const [quizContent, setQuizContent] = useState<QuizContent>(() => {
		if (initialData?.type === "quiz") {
			return initialData.content as QuizContent;
		}
		return {
			question: "",
			options: ["", "", "", ""],
			correctAnswer: 0,
			explanation: "",
		};
	});

	const [lessonContent, setLessonContent] = useState<LessonContent>(() => {
		if (initialData?.type === "lesson") {
			return initialData.content as LessonContent;
		}
		return { sections: [{ heading: "", body: "" }], keyPoints: [] };
	});

	const [summaryContent, setSummaryContent] = useState<SummaryContent>(() => {
		if (initialData?.type === "summary") {
			return initialData.content as SummaryContent;
		}
		return { summary: "", bulletPoints: [], relatedTopics: [] };
	});

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setLoading(true);
			setError(null);

			try {
				let content: StudyContent["content"];

				switch (type) {
					case "flashcard":
						content = flashcardContent;
						break;
					case "quiz":
						content = quizContent;
						break;
					case "lesson":
						content = lessonContent;
						break;
					case "summary":
						content = summaryContent;
						break;
				}

				const contentData = {
					type,
					title,
					content,
					metadata: {
						difficulty: difficulty || undefined,
						subject: subject || undefined,
						tags: tags
							? tags
									.split(",")
									.map((tag) => tag.trim())
									.filter(Boolean)
							: [],
					},
				};

				let result: { success: boolean; error?: string };
				if (initialData) {
					result = await updateContentAction(initialData.id, contentData);
				} else {
					result = await createContentAction(contentData);
				}

				if (!result.success) {
					setError(result.error || "Failed to save content");
					return;
				}

				// Success - redirect handled by server action
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to save content");
			} finally {
				setLoading(false);
			}
		},
		[
			type,
			title,
			difficulty,
			subject,
			tags,
			flashcardContent,
			quizContent,
			lessonContent,
			summaryContent,
			initialData,
		],
	);

	const renderContentFields = () => {
		switch (type) {
			case "flashcard":
				return (
					<div className="space-y-4">
						<div>
							<label
								htmlFor="flashcard-question"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Question *
							</label>
							<textarea
								id="flashcard-question"
								value={flashcardContent.question}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										question: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={3}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="flashcard-answer"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Answer *
							</label>
							<textarea
								id="flashcard-answer"
								value={flashcardContent.answer}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										answer: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={3}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="flashcard-hint"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Hint (optional)
							</label>
							<input
								id="flashcard-hint"
								type="text"
								value={flashcardContent.hint || ""}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										hint: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							/>
						</div>
					</div>
				);

			case "quiz":
				return (
					<div className="space-y-4">
						<div>
							<label
								htmlFor="quiz-question"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Question *
							</label>
							<textarea
								id="quiz-question"
								value={quizContent.question}
								onChange={(e) =>
									setQuizContent((prev) => ({
										...prev,
										question: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={3}
								required
							/>
						</div>
						<div>
							<fieldset>
								<legend className="block text-sm font-medium text-foreground mb-2">
									Options *
								</legend>
								{quizContent.options.map((option, index) => (
									<div
										key={`option-${index}-${option.slice(0, 10)}`}
										className="flex items-center space-x-2 mb-2"
									>
										<input
											type="radio"
											name="correctAnswer"
											checked={quizContent.correctAnswer === index}
											onChange={() =>
												setQuizContent((prev) => ({
													...prev,
													correctAnswer: index,
												}))
											}
											className="text-primary focus:ring-ring"
										/>
										<input
											type="text"
											value={option}
											onChange={(e) => {
												const newOptions = [...quizContent.options];
												newOptions[index] = e.target.value;
												setQuizContent((prev) => ({
													...prev,
													options: newOptions,
												}));
											}}
											placeholder={`Option ${index + 1}`}
											className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
											required
										/>
									</div>
								))}
							</fieldset>
						</div>
						<div>
							<label
								htmlFor="quiz-explanation"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Explanation (optional)
							</label>
							<textarea
								id="quiz-explanation"
								value={quizContent.explanation || ""}
								onChange={(e) =>
									setQuizContent((prev) => ({
										...prev,
										explanation: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={3}
							/>
						</div>
					</div>
				);

			case "lesson":
				return (
					<div className="space-y-4">
						<fieldset>
							<legend className="block text-sm font-medium text-foreground mb-2">
								Sections *
							</legend>
							{lessonContent.sections.map((section, index) => (
								<div
									key={`section-${index}-${section.heading.slice(0, 10)}`}
									className="border border-card-border rounded-md p-4 mb-4 bg-card-background"
								>
									<div className="flex justify-between items-center mb-2">
										<h4 className="text-sm font-medium text-foreground">
											Section {index + 1}
										</h4>
										{lessonContent.sections.length > 1 && (
											<button
												type="button"
												onClick={() => {
													const newSections = lessonContent.sections.filter(
														(_, i) => i !== index,
													);
													setLessonContent((prev) => ({
														...prev,
														sections: newSections,
													}));
												}}
												className="text-error hover:text-error/80 text-sm"
											>
												Remove
											</button>
										)}
									</div>
									<input
										type="text"
										value={section.heading}
										onChange={(e) => {
											const newSections = [...lessonContent.sections];
											newSections[index].heading = e.target.value;
											setLessonContent((prev) => ({
												...prev,
												sections: newSections,
											}));
										}}
										placeholder="Section heading"
										className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-2"
										required
									/>
									<textarea
										value={section.body}
										onChange={(e) => {
											const newSections = [...lessonContent.sections];
											newSections[index].body = e.target.value;
											setLessonContent((prev) => ({
												...prev,
												sections: newSections,
											}));
										}}
										placeholder="Section content"
										className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
										rows={4}
										required
									/>
								</div>
							))}
							<button
								type="button"
								onClick={() => {
									setLessonContent((prev) => ({
										...prev,
										sections: [...prev.sections, { heading: "", body: "" }],
									}));
								}}
								className="text-primary hover:text-primary/80 text-sm"
							>
								+ Add Section
							</button>
						</fieldset>
						<div>
							<label
								htmlFor="lesson-keypoints"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Key Points (optional, one per line)
							</label>
							<textarea
								id="lesson-keypoints"
								value={lessonContent.keyPoints?.join("\n") || ""}
								onChange={(e) => {
									const keyPoints = e.target.value.split("\n").filter(Boolean);
									setLessonContent((prev) => ({ ...prev, keyPoints }));
								}}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={4}
								placeholder="Enter key points, one per line"
							/>
						</div>
					</div>
				);

			case "summary":
				return (
					<div className="space-y-4">
						<div>
							<label
								htmlFor="summary-content"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Summary *
							</label>
							<textarea
								id="summary-content"
								value={summaryContent.summary}
								onChange={(e) =>
									setSummaryContent((prev) => ({
										...prev,
										summary: e.target.value,
									}))
								}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={6}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="summary-bullets"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Bullet Points (optional, one per line)
							</label>
							<textarea
								id="summary-bullets"
								value={summaryContent.bulletPoints?.join("\n") || ""}
								onChange={(e) => {
									const bulletPoints = e.target.value
										.split("\n")
										.filter(Boolean);
									setSummaryContent((prev) => ({ ...prev, bulletPoints }));
								}}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={4}
								placeholder="Enter bullet points, one per line"
							/>
						</div>
						<div>
							<label
								htmlFor="summary-topics"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Related Topics (optional, one per line)
							</label>
							<textarea
								id="summary-topics"
								value={summaryContent.relatedTopics?.join("\n") || ""}
								onChange={(e) => {
									const relatedTopics = e.target.value
										.split("\n")
										.filter(Boolean);
									setSummaryContent((prev) => ({ ...prev, relatedTopics }));
								}}
								className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								rows={3}
								placeholder="Enter related topics, one per line"
							/>
						</div>
					</div>
				);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
			<div className="bg-card-background shadow-sm rounded-lg p-6 space-y-6 border border-card-border">
				{error && (
					<div className="bg-error-muted border border-error rounded-md p-4">
						<p className="text-error">{error}</p>
					</div>
				)}

				{/* Basic Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label
							htmlFor="content-type"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Content Type *
						</label>
						<select
							id="content-type"
							value={type}
							onChange={(e) => setType(e.target.value as ContentType)}
							className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							required
						>
							{CONTENT_TYPES.map((contentType) => (
								<option key={contentType.value} value={contentType.value}>
									{contentType.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="content-title"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Title *
						</label>
						<input
							id="content-title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="content-difficulty"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Difficulty Level
						</label>
						<select
							id="content-difficulty"
							value={difficulty}
							onChange={(e) =>
								setDifficulty(e.target.value as DifficultyLevel | "")
							}
							className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						>
							<option value="">Select difficulty</option>
							{DIFFICULTY_LEVELS.map((level) => (
								<option key={level.value} value={level.value}>
									{level.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="content-subject"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Subject
						</label>
						<input
							id="content-subject"
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
							placeholder="e.g., Mathematics, History, Science"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="content-tags"
						className="block text-sm font-medium text-foreground mb-2"
					>
						Tags (comma-separated)
					</label>
					<input
						id="content-tags"
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						placeholder="e.g., algebra, equations, problem-solving"
					/>
				</div>

				{/* Content-specific fields */}
				<div>
					<h3 className="text-lg font-medium text-foreground mb-4">
						Content Details
					</h3>
					{renderContentFields()}
				</div>

				{/* Actions */}
				<div className="flex justify-end space-x-4 pt-6 border-t border-card-border">
					<button
						type="button"
						onClick={() => router.back()}
						className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-background bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
					>
						{loading
							? "Saving..."
							: initialData
								? "Update Content"
								: "Create Content"}
					</button>
				</div>
			</div>
		</form>
	);
}
