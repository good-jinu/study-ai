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
import {
	Alert,
	Button,
	Card,
	CardContent,
	FormField,
	FormSection,
	Input,
	Label,
	Select,
	Textarea,
} from "@/components/ui";

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
						<FormField>
							<Label htmlFor="flashcard-question" required>
								Question
							</Label>
							<Textarea
								id="flashcard-question"
								value={flashcardContent.question}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										question: e.target.value,
									}))
								}
								rows={3}
								required
							/>
						</FormField>
						<FormField>
							<Label htmlFor="flashcard-answer" required>
								Answer
							</Label>
							<Textarea
								id="flashcard-answer"
								value={flashcardContent.answer}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										answer: e.target.value,
									}))
								}
								rows={3}
								required
							/>
						</FormField>
						<FormField>
							<Label htmlFor="flashcard-hint">Hint (optional)</Label>
							<Input
								id="flashcard-hint"
								type="text"
								value={flashcardContent.hint || ""}
								onChange={(e) =>
									setFlashcardContent((prev) => ({
										...prev,
										hint: e.target.value,
									}))
								}
							/>
						</FormField>
					</div>
				);

			case "quiz":
				return (
					<div className="space-y-4">
						<FormField>
							<Label htmlFor="quiz-question" required>
								Question
							</Label>
							<Textarea
								id="quiz-question"
								value={quizContent.question}
								onChange={(e) =>
									setQuizContent((prev) => ({
										...prev,
										question: e.target.value,
									}))
								}
								rows={3}
								required
							/>
						</FormField>
						<FormField>
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
										<Input
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
											className="flex-1"
											required
										/>
									</div>
								))}
							</fieldset>
						</FormField>
						<FormField>
							<Label htmlFor="quiz-explanation">Explanation (optional)</Label>
							<Textarea
								id="quiz-explanation"
								value={quizContent.explanation || ""}
								onChange={(e) =>
									setQuizContent((prev) => ({
										...prev,
										explanation: e.target.value,
									}))
								}
								rows={3}
							/>
						</FormField>
					</div>
				);

			case "lesson":
				return (
					<div className="space-y-4">
						<FormField>
							<fieldset>
								<legend className="block text-sm font-medium text-foreground mb-2">
									Sections *
								</legend>
								{lessonContent.sections.map((section, index) => (
									<Card
										key={`section-${index}-${section.heading.slice(0, 10)}`}
										className="mb-4"
									>
										<CardContent className="p-4">
											<div className="flex justify-between items-center mb-2">
												<h4 className="text-sm font-medium text-foreground">
													Section {index + 1}
												</h4>
												{lessonContent.sections.length > 1 && (
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => {
															const newSections = lessonContent.sections.filter(
																(_, i) => i !== index,
															);
															setLessonContent((prev) => ({
																...prev,
																sections: newSections,
															}));
														}}
														className="text-error hover:text-error/80"
													>
														Remove
													</Button>
												)}
											</div>
											<div className="space-y-2">
												<Input
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
													required
												/>
												<Textarea
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
													rows={4}
													required
												/>
											</div>
										</CardContent>
									</Card>
								))}
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										setLessonContent((prev) => ({
											...prev,
											sections: [...prev.sections, { heading: "", body: "" }],
										}));
									}}
									className="text-primary hover:text-primary/80"
								>
									+ Add Section
								</Button>
							</fieldset>
						</FormField>
						<FormField>
							<Label htmlFor="lesson-keypoints">
								Key Points (optional, one per line)
							</Label>
							<Textarea
								id="lesson-keypoints"
								value={lessonContent.keyPoints?.join("\n") || ""}
								onChange={(e) => {
									const keyPoints = e.target.value.split("\n").filter(Boolean);
									setLessonContent((prev) => ({ ...prev, keyPoints }));
								}}
								rows={4}
								placeholder="Enter key points, one per line"
							/>
						</FormField>
					</div>
				);

			case "summary":
				return (
					<div className="space-y-4">
						<FormField>
							<Label htmlFor="summary-content" required>
								Summary
							</Label>
							<Textarea
								id="summary-content"
								value={summaryContent.summary}
								onChange={(e) =>
									setSummaryContent((prev) => ({
										...prev,
										summary: e.target.value,
									}))
								}
								rows={6}
								required
							/>
						</FormField>
						<FormField>
							<Label htmlFor="summary-bullets">
								Bullet Points (optional, one per line)
							</Label>
							<Textarea
								id="summary-bullets"
								value={summaryContent.bulletPoints?.join("\n") || ""}
								onChange={(e) => {
									const bulletPoints = e.target.value
										.split("\n")
										.filter(Boolean);
									setSummaryContent((prev) => ({ ...prev, bulletPoints }));
								}}
								rows={4}
								placeholder="Enter bullet points, one per line"
							/>
						</FormField>
						<FormField>
							<Label htmlFor="summary-topics">
								Related Topics (optional, one per line)
							</Label>
							<Textarea
								id="summary-topics"
								value={summaryContent.relatedTopics?.join("\n") || ""}
								onChange={(e) => {
									const relatedTopics = e.target.value
										.split("\n")
										.filter(Boolean);
									setSummaryContent((prev) => ({ ...prev, relatedTopics }));
								}}
								rows={3}
								placeholder="Enter related topics, one per line"
							/>
						</FormField>
					</div>
				);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
			<Card className="p-6 space-y-6">
				{error && <Alert variant="error">{error}</Alert>}

				{/* Basic Information */}
				<FormSection title="Basic Information">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField>
							<Label htmlFor="content-type" required>
								Content Type
							</Label>
							<Select
								id="content-type"
								value={type}
								onChange={(e) => setType(e.target.value as ContentType)}
								required
							>
								{CONTENT_TYPES.map((contentType) => (
									<option key={contentType.value} value={contentType.value}>
										{contentType.label}
									</option>
								))}
							</Select>
						</FormField>

						<FormField>
							<Label htmlFor="content-title" required>
								Title
							</Label>
							<Input
								id="content-title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</FormField>

						<FormField>
							<Label htmlFor="content-difficulty">Difficulty Level</Label>
							<Select
								id="content-difficulty"
								value={difficulty}
								onChange={(e) =>
									setDifficulty(e.target.value as DifficultyLevel | "")
								}
							>
								<option value="">Select difficulty</option>
								{DIFFICULTY_LEVELS.map((level) => (
									<option key={level.value} value={level.value}>
										{level.label}
									</option>
								))}
							</Select>
						</FormField>

						<FormField>
							<Label htmlFor="content-subject">Subject</Label>
							<Input
								id="content-subject"
								type="text"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								placeholder="e.g., Mathematics, History, Science"
							/>
						</FormField>
					</div>

					<FormField>
						<Label htmlFor="content-tags">Tags (comma-separated)</Label>
						<Input
							id="content-tags"
							type="text"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="e.g., algebra, equations, problem-solving"
						/>
					</FormField>
				</FormSection>

				{/* Content-specific fields */}
				<FormSection title="Content Details">
					{renderContentFields()}
				</FormSection>

				{/* Actions */}
				<div className="flex justify-end space-x-4 pt-6 border-t border-card-border">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.back()}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading
							? "Saving..."
							: initialData
								? "Update Content"
								: "Create Content"}
					</Button>
				</div>
			</Card>
		</form>
	);
}
