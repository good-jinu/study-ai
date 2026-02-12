"use server";

import {
	AIService,
	calculateLevel,
	type Mission,
	type Submission,
	type User,
} from "@study-ai/core";
import {
	createSubmission,
	createUser,
	getUser,
	updateUserProgress,
} from "@study-ai/db";
import { Resource } from "sst";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { DEFAULT_MISSIONS } from "@/lib/missions";

export async function getCurrentUserAction(): Promise<User | null> {
	const session = await auth();
	if (!session?.user?.id || !session.user.email) return null;

	let user = await getUser({
		userId: session.user.id,
		tableName: Resource.UsersTable.name,
	});

	if (!user) {
		user = {
			userId: session.user.id,
			email: session.user.email,
			completedMissions: [],
			level: "Beginner",
			createdAt: new Date().toISOString(),
		};
		await createUser({
			user,
			tableName: Resource.UsersTable.name,
		});
	}

	return user;
}

export async function getMissionsAction(): Promise<Mission[]> {
	return DEFAULT_MISSIONS;
}

export async function submitMissionAction(
	missionId: string,
	inputText: string,
): Promise<{ outputText: string }> {
	const session = await auth();
	if (!session?.user?.id) throw new Error("Unauthorized");

	const mission = DEFAULT_MISSIONS.find((m) => m.missionId === missionId);
	if (!mission) throw new Error("Mission not found");

	const aiService = new AIService(process.env.OPENAI_API_KEY || "");
	const aiResponse = await aiService.generateMissionOutput(
		mission.promptSystem,
		inputText,
	);

	const submission: Submission = {
		submissionId: uuidv4(),
		userId: session.user.id,
		missionId,
		inputText,
		outputText: aiResponse.outputText,
		createdAt: new Date().toISOString(),
	};

	await createSubmission({
		submission,
		tableName: Resource.SubmissionsTable.name,
	});

	// Update user progress
	const user = await getUser({
		userId: session.user.id,
		tableName: Resource.UsersTable.name,
	});

	if (user && !user.completedMissions.includes(missionId)) {
		const newCompletedMissionsCount = user.completedMissions.length + 1;
		const newLevel = calculateLevel(newCompletedMissionsCount);
		await updateUserProgress({
			userId: session.user.id,
			level: newLevel,
			completedMissionId: missionId,
			tableName: Resource.UsersTable.name,
		});
	}

	return { outputText: aiResponse.outputText };
}
