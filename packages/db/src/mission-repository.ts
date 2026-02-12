import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { DynamoDBMissionItem, Mission } from "@study-ai/core";
import { docClient } from "./client";

export interface GetMissionParams {
	missionId: string;
	tableName: string;
}

export interface ListMissionsParams {
	tableName: string;
}

export async function getMission({
	missionId,
	tableName,
}: GetMissionParams): Promise<Mission | null> {
	const command = new GetCommand({
		TableName: tableName,
		Key: { missionId },
	});

	const result = await docClient.send(command);
	if (!result.Item) return null;

	const item = result.Item as DynamoDBMissionItem;
	return {
		missionId: item.missionId,
		title: item.title,
		description: item.description,
		promptSystem: item.promptSystem,
		uiConfig: item.uiConfig,
	};
}

export async function listMissions({
	tableName,
}: ListMissionsParams): Promise<Mission[]> {
	const command = new ScanCommand({
		TableName: tableName,
	});

	const result = await docClient.send(command);
	const items = (result.Items || []) as DynamoDBMissionItem[];

	return items.map((item) => ({
		missionId: item.missionId,
		title: item.title,
		description: item.description,
		promptSystem: item.promptSystem,
		uiConfig: item.uiConfig,
	}));
}
