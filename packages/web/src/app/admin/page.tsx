import type { Metadata } from "next";
import ContentList from "@/components/admin/ContentList";

export const metadata: Metadata = {
	title: "Content Library - StudyAI Admin",
	description: "Manage study content for StudyAI platform",
};

export default function AdminPage() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Content Library
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage flashcards, quizzes, lessons, and summaries
					</p>
				</div>
			</div>
			<ContentList />
		</div>
	);
}
