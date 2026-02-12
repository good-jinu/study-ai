import type { Metadata } from "next";
import ContentForm from "@/components/admin/ContentForm";

export const metadata: Metadata = {
	title: "Create Content - StudyAI Admin",
	description: "Create new study content",
};

export default function NewContentPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-foreground">
					Create New Content
				</h1>
				<p className="text-muted-foreground mt-1">
					Add a new flashcard, quiz, lesson, or summary
				</p>
			</div>
			<ContentForm />
		</div>
	);
}
