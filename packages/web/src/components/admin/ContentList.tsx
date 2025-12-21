"use client";

import type { ContentType, StudyContent } from "@study-ai/core";
import { Edit, Eye, Filter, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	deleteContentAction,
	fetchAllContentAction,
} from "@/actions/adminActions";

const CONTENT_TYPES: { value: string; label: string }[] = [
	{ value: "all", label: "All Types" },
	{ value: "flashcard", label: "Flashcards" },
	{ value: "quiz", label: "Quizzes" },
	{ value: "lesson", label: "Lessons" },
	{ value: "summary", label: "Summaries" },
];

export default function ContentList() {
	const [contents, setContents] = useState<StudyContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState("all");
	const [hasMore, setHasMore] = useState(false);
	const [offset, setOffset] = useState(0);
	const limit = 20;

	const loadContent = useCallback(
		async (reset = false) => {
			try {
				setLoading(true);
				const currentOffset = reset ? 0 : offset;

				const response = await fetchAllContentAction({
					offset: currentOffset,
					limit,
					type: selectedType,
				});

				if (reset) {
					setContents(response.contents);
					setOffset(limit);
				} else {
					setContents((prev) => [...prev, ...response.contents]);
					setOffset((prev) => prev + limit);
				}

				setHasMore(response.hasMore);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load content");
			} finally {
				setLoading(false);
			}
		},
		[offset, selectedType],
	);

	useEffect(() => {
		setOffset(0);
		loadContent(true);
	}, [loadContent]);

	const handleDelete = async (id: string, title: string) => {
		if (!confirm(`Are you sure you want to delete "${title}"?`)) {
			return;
		}

		try {
			const result = await deleteContentAction(id);
			if (result.success) {
				setContents((prev) => prev.filter((content) => content.id !== id));
			} else {
				alert(result.error || "Failed to delete content");
			}
		} catch (_err) {
			alert("Failed to delete content");
		}
	};

	const getTypeColor = (type: ContentType) => {
		switch (type) {
			case "flashcard":
				return "bg-flashcard-primary text-background";
			case "quiz":
				return "bg-quiz-primary text-background";
			case "lesson":
				return "bg-lesson-primary text-background";
			case "summary":
				return "bg-warning text-warning-foreground";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	if (loading && contents.length === 0) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filter */}
			<div className="flex items-center space-x-4">
				<Filter className="h-5 w-5 text-muted-foreground" />
				<select
					value={selectedType}
					onChange={(e) => setSelectedType(e.target.value)}
					className="border border-border rounded-md px-3 py-2 bg-card-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				>
					{CONTENT_TYPES.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>

			{error && (
				<div className="bg-error-muted border border-error rounded-md p-4">
					<p className="text-error">{error}</p>
				</div>
			)}

			{/* Content Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{contents.map((content) => (
					<div
						key={content.id}
						className="bg-card-background rounded-lg shadow-sm border border-card-border p-6 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="flex items-center space-x-2 mb-2">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
											content.type,
										)}`}
									>
										{content.type}
									</span>
									{content.metadata?.difficulty && (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
											{content.metadata.difficulty}
										</span>
									)}
								</div>
								<h3 className="text-lg font-medium text-foreground mb-2">
									{content.title}
								</h3>
								{content.metadata?.subject && (
									<p className="text-sm text-muted-foreground mb-2">
										Subject: {content.metadata.subject}
									</p>
								)}
								{content.metadata?.tags && content.metadata.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{content.metadata.tags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between pt-4 border-t border-card-border">
							<div className="flex space-x-2">
								<Link
									href={`/admin/content/${content.id}`}
									className="inline-flex items-center px-3 py-1.5 border border-border text-sm font-medium rounded-md text-foreground bg-card-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
								>
									<Edit className="h-4 w-4 mr-1" />
									Edit
								</Link>
								<button
									type="button"
									onClick={() => handleDelete(content.id, content.title)}
									className="inline-flex items-center px-3 py-1.5 border border-error text-sm font-medium rounded-md text-error bg-card-background hover:bg-error-muted focus:outline-none focus:ring-2 focus:ring-error"
								>
									<Trash2 className="h-4 w-4 mr-1" />
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Load More */}
			{hasMore && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => loadContent(false)}
						disabled={loading}
						className="px-6 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
					>
						{loading ? "Loading..." : "Load More"}
					</button>
				</div>
			)}

			{contents.length === 0 && !loading && (
				<div className="text-center py-12">
					<Eye className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-sm font-medium text-foreground">
						No content found
					</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Get started by creating your first piece of content.
					</p>
					<div className="mt-6">
						<Link
							href="/admin/content/new"
							className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-background bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
						>
							Create Content
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
