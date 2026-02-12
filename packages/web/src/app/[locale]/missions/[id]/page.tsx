import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import MissionForm from "@/components/MissionForm";
import { DEFAULT_MISSIONS } from "@/lib/missions";

interface MissionPageProps {
	params: Promise<{ id: string }>;
}

export default async function MissionPage({ params }: MissionPageProps) {
	const { id } = await params;
	const session = await auth();

	if (!session) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
				<h1 className="text-2xl font-bold mb-4 text-foreground">
					Login Required
				</h1>
				<Link href="/login" className="text-primary hover:underline">
					Go to Login Page
				</Link>
			</div>
		);
	}

	const mission = DEFAULT_MISSIONS.find((m) => m.missionId === id);

	if (!mission) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<Link
					href="/"
					className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
				>
					← Back to Dashboard
				</Link>

				<header className="mb-8">
					<div className="text-5xl mb-4">{mission.uiConfig.icon}</div>
					<h1 className="text-3xl font-extrabold text-foreground mb-2">
						{mission.title}
					</h1>
					<p className="text-lg text-muted-foreground">{mission.description}</p>
				</header>

				<div className="bg-card-background rounded-2xl shadow-sm border border-card-border p-8">
					<MissionForm mission={mission} />
				</div>
			</div>
		</main>
	);
}
