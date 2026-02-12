"use client";

import type { ContentType, StudyContent } from "@study-ai/core";
import { Edit, Eye, Filter, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	deleteContentAction,
	fetchAllContentAction,
} from "@/actions/adminActions";
import { Alert, Badge, Button, Card, Select } from "@/components/ui";
import { useDictionary } from "@/components/DictionaryProvider";

export default function ContentList() {
	const dict = useDictionary();
	const params = useParams();
	const lang = params.lang as string;
	const [contents, setContents] = useState<StudyContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState("all");
	const [hasMore, setHasMore] = useState(false);
	const offsetRef = useRef(0);
	const limit = 20;

	const CONTENT_TYPES = [
		{ value: "all", label: dict.admin.allTypes },
		{ value: "flashcard", label: dict.admin.flashcards },
		{ value: "quiz", label: dict.admin.quizzes },
		{ value: "lesson", label: dict.admin.lessons },
		{ value: "summary", label: dict.admin.summaries },
	];

	const loadContent = async (reset = false) => {
		try {
			setLoading(true);
			const currentOffset = reset ? 0 : offsetRef.current;

			const response = await fetchAllContentAction({
				offset: currentOffset,
				limit,
				type: selectedType === "all" ? undefined : selectedType,
			});

			if (reset) {
				setContents(response.contents);
				offsetRef.current = limit;
			} else {
				setContents((prev) => [...prev, ...response.contents]);
				offsetRef.current += limit;
			}

			setHasMore(response.hasMore);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : dict.admin.failedToLoad);
		} finally {
			setLoading(false);
		}
	};

	// Load content when selectedType changes
	useEffect(() => {
		offsetRef.current = 0;
		setContents([]);
		loadContent(true);
	}, [selectedType]);

	const handleDelete = async (id: string, title: string) => {
		if (
			!confirm(dict.admin.confirmDelete.replace("{title}", title))
		) {
			return;
		}

		try {
			const result = await deleteContentAction(id);
			if (result.success) {
				setContents((prev) => prev.filter((content) => content.id !== id));
			} else {
				alert(result.error || dict.admin.failedToDelete);
			}
		} catch (_err) {
			alert(dict.admin.failedToDelete);
		}
	};

	const getTypeColor = (
		type: ContentType,
	): "flashcard" | "quiz" | "lesson" | "summary" => {
		switch (type) {
			case "flashcard":
				return "flashcard";
			case "quiz":
				return "quiz";
			case "lesson":
				return "lesson";
			case "summary":
				return "summary";
			default:
				return "flashcard";
		}
	};

	if (loading && contents.length === 0) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filter */}
			<div className="flex items-center space-x-4">
				<Filter className="h-5 w-5 text-muted-foreground" />
				<Select
					value={selectedType}
					onChange={(e) => setSelectedType(e.target.value)}
					className="border border-border rounded-md px-3 py-2 bg-card-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				>
					{CONTENT_TYPES.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</Select>
			</div>

			{error && <Alert variant="error">{error}</Alert>}

			{/* Content Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{contents.map((content) => (
					<Card
						key={content.id}
						className="p-6 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="flex items-center space-x-2 mb-2">
									<Badge variant={getTypeColor(content.type)}>
										{content.type}
									</Badge>
									{content.metadata?.difficulty && (
										<Badge variant="difficulty">
											{content.metadata.difficulty}
										</Badge>
									)}
								</div>
								<h3 className="text-lg font-medium text-foreground mb-2">
									{content.title}
								</h3>
								{content.metadata?.subject && (
									<p className="text-sm text-muted-foreground mb-2">
										{dict.common.subject}: {content.metadata.subject}
									</p>
								)}
								{content.metadata?.tags && content.metadata.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mb-2">
										{content.metadata.tags.map((tag) => (
											<Badge key={tag} variant="default" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								)}
								{content.metadata?.media &&
									content.metadata.media.length > 0 && (
										<div className="flex items-center space-x-1 text-xs text-muted-foreground">
											<span>📎</span>
											<span>
												{content.metadata.media.length}{" "}
												{content.metadata.media.length !== 1
													? dict.common.attachments
													: dict.common.attachment}
											</span>
										</div>
									)}
							</div>
						</div>

						<div className="flex items-center justify-between pt-4 border-t border-card-border">
							<div className="flex space-x-2">
								<Button variant="secondary" size="sm" asChild>
									<Link href={`/${lang}/admin/content/${content.id}`}>
										<Edit className="h-4 w-4 mr-1" />
										{dict.common.edit}
									</Link>
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleDelete(content.id, content.title)}
								>
									<Trash2 className="h-4 w-4 mr-1" />
									{dict.common.delete}
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Load More */}
			{hasMore && (
				<div className="flex justify-center">
					<Button
						variant="secondary"
						onClick={() => loadContent(false)}
						disabled={loading}
					>
						{loading ? dict.common.loading : dict.common.loadMore}
					</Button>
				</div>
			)}

			{contents.length === 0 && !loading && (
				<div className="text-center py-12">
					<Eye className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-sm font-medium text-foreground">
						{dict.admin.noContent}
					</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						{dict.admin.startCreating}
					</p>
					<div className="mt-6">
						<Button asChild>
							<Link href={`/${lang}/admin/content/new`}>{dict.admin.createContent}</Link>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
