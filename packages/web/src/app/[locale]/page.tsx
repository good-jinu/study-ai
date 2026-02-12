import { Link } from "@/i18n/routing";
import {
	getCurrentUserAction,
	getMissionsAction,
} from "@/actions/missionActions";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export default async function Home() {
	const session = await auth();
	const user = session ? await getCurrentUserAction() : null;
	const missions = await getMissionsAction();
    const t = await getTranslations('HomePage');

	return (
		<main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<header className="mb-12 text-center">
					<h1 className="text-4xl font-extrabold text-foreground mb-2">
						{t('title')}
					</h1>
					<p className="text-lg text-muted-foreground">
						{t('description')}
					</p>
				</header>

				{session && user ? (
					<div className="space-y-8">
						{/* User Status Card */}
						<div className="bg-card-background rounded-2xl shadow-sm p-8 border border-card-border">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground mb-1">
										{t('currentLevel')}
									</p>
									<h2 className="text-3xl font-bold text-primary">
										{user.level}
									</h2>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-muted-foreground mb-1">
										{t('missionProgress')}
									</p>
									<p className="text-2xl font-bold text-foreground">
										{user.completedMissions.length} / {missions.length}
									</p>
								</div>
							</div>
							<div className="mt-6 w-full bg-muted rounded-full h-2.5">
								<div
									className="bg-primary h-2.5 rounded-full"
									style={{
										width: `${(user.completedMissions.length / missions.length) * 100}%`,
									}}
								/>
							</div>
						</div>

						{/* Missions Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{missions.map((mission) => {
								const isCompleted = user.completedMissions.includes(
									mission.missionId,
								);
								return (
									<Link
										key={mission.missionId}
										href={`/missions/${mission.missionId}`}
										className="group bg-card-background p-6 rounded-xl shadow-sm border border-card-border hover:border-primary transition-all"
									>
										<div className="text-4xl mb-4">{mission.uiConfig.icon}</div>
										<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
											{mission.title}
										</h3>
										<p className="mt-2 text-muted-foreground text-sm">
											{mission.description}
										</p>
										{isCompleted && (
											<span className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-muted text-success">
												{t('completed')}
											</span>
										)}
									</Link>
								);
							})}
						</div>

						{/* Previous Platform Link */}
						<div className="pt-8 border-t border-card-border">
							<h3 className="text-lg font-bold text-foreground mb-4">
								{t('knowledgeBase')}
							</h3>
							<Link
								href="/contents"
								className="inline-flex items-center gap-2 p-6 bg-card-background rounded-xl border border-card-border hover:border-secondary transition-all w-full md:w-auto"
							>
								<span className="text-2xl">📚</span>
								<div>
									<p className="font-bold text-foreground">
										{t('viewStudyContent')}
									</p>
									<p className="text-sm text-muted-foreground">
										{t('studyContentDesc')}
									</p>
								</div>
							</Link>
						</div>
					</div>
				) : (
					<div className="text-center bg-card-background p-12 rounded-2xl shadow-sm border border-card-border">
						<p className="text-xl text-muted-foreground mb-8">
							{t('loginMessage')}
						</p>
						<Link
							href="/login"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-success-foreground bg-primary hover:opacity-90 transition-opacity"
						>
							{t('startTraining')}
						</Link>
					</div>
				)}
			</div>
		</main>
	);
}
