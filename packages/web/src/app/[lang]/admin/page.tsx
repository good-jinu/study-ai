import type { Metadata } from "next";
import ContentList from "@/components/admin/ContentList";
import { getDictionary } from "@/dictionaries";

export const metadata: Metadata = {
	title: "Content Library - StudyAI Admin",
	description: "Manage study content for StudyAI platform",
};

export default async function AdminPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const dict = await getDictionary(lang);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						{dict.admin.title}
					</h1>
					<p className="text-muted-foreground mt-1">{dict.admin.subtitle}</p>
				</div>
			</div>
			<ContentList />
		</div>
	);
}
