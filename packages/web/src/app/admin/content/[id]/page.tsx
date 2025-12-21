import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentByIdAction } from "@/actions/adminActions";
import ContentForm from "@/components/admin/ContentForm";

interface EditContentPageProps {
	params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
	title: "Edit Content - StudyAI Admin",
	description: "Edit study content",
};

export default async function EditContentPage({
	params,
}: EditContentPageProps) {
	const { id } = await params;

	try {
		const content = await getContentByIdAction(id);

		if (!content) {
			notFound();
		}

		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Edit Content</h1>
					<p className="text-muted-foreground mt-1">Update "{content.title}"</p>
				</div>
				<ContentForm initialData={content} />
			</div>
		);
	} catch (error) {
		console.error("Error loading content:", error);
		notFound();
	}
}
