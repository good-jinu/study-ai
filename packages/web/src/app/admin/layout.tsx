import { BookOpen, Home, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Admin - StudyAI",
	description: "Content management for StudyAI platform",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-muted">
			<nav className="bg-card-background shadow-sm border-b border-card-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link href="/admin" className="flex items-center space-x-2">
								<BookOpen className="h-6 w-6 text-primary" />
								<span className="text-xl font-semibold text-foreground">
									StudyAI Admin
								</span>
							</Link>
							<div className="flex space-x-4">
								<Link
									href="/admin"
									className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
								>
									Content Library
								</Link>
								<Link
									href="/admin/content/new"
									className="bg-primary text-background hover:opacity-90 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
								>
									<Plus className="h-4 w-4" />
									<span>Add Content</span>
								</Link>
							</div>
						</div>
						<div className="flex items-center">
							<Link
								href="/"
								className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
							>
								<Home className="h-4 w-4" />
								<span>Back to App</span>
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
