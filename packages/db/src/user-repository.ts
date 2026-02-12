import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { DynamoDBUserItem, User, UserLevel } from "@study-ai/core";
import { docClient } from "./client";

export interface GetUserParams {
	userId: string;
	tableName: string;
}

export interface CreateUserParams {
	user: User;
	tableName: string;
}

export interface UpdateUserLevelParams {
	userId: string;
	level: UserLevel;
	completedMissionId: string;
	tableName: string;
}

export async function getUser({
	userId,
	tableName,
}: GetUserParams): Promise<User | null> {
	const command = new GetCommand({
		TableName: tableName,
		Key: { userId },
	});

	const result = await docClient.send(command);
	if (!result.Item) return null;

	const item = result.Item as DynamoDBUserItem;
	return {
		userId: item.userId,
		email: item.email,
		completedMissions: item.completedMissions || [],
		level: item.level as UserLevel,
		createdAt: item.createdAt,
	};
}

export async function createUser({
	user,
	tableName,
}: CreateUserParams): Promise<void> {
	const item: DynamoDBUserItem = {
		userId: user.userId,
		email: user.email,
		completedMissions: user.completedMissions,
		level: user.level,
		createdAt: user.createdAt,
	};

	const command = new PutCommand({
		TableName: tableName,
		Item: item,
	});

	await docClient.send(command);
}

export async function updateUserProgress({
	userId,
	level,
	completedMissionId,
	tableName,
}: UpdateUserLevelParams): Promise<void> {
	const command = new UpdateCommand({
		TableName: tableName,
		Key: { userId },
		UpdateExpression:
			"SET #level = :level, completedMissions = list_append(if_not_exists(completedMissions, :empty_list), :mission)",
		ExpressionAttributeNames: {
			"#level": "level",
		},
		ExpressionAttributeValues: {
			":level": level,
			":mission": [completedMissionId],
			":empty_list": [],
		},
	});

	await docClient.send(command);
}
