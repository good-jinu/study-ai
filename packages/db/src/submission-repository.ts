import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { DynamoDBSubmissionItem, Submission } from "@study-ai/core";
import { docClient } from "./client";

export interface CreateSubmissionParams {
	submission: Submission;
	tableName: string;
}

export interface ListSubmissionsByUserParams {
	userId: string;
	tableName: string;
}

export async function createSubmission({
	submission,
	tableName,
}: CreateSubmissionParams): Promise<void> {
	const item: DynamoDBSubmissionItem = {
		submissionId: submission.submissionId,
		userId: submission.userId,
		missionId: submission.missionId,
		inputText: submission.inputText,
		outputText: submission.outputText,
		createdAt: submission.createdAt,
	};

	const command = new PutCommand({
		TableName: tableName,
		Item: item,
	});

	await docClient.send(command);
}

export async function listSubmissionsByUser({
	userId,
	tableName,
}: ListSubmissionsByUserParams): Promise<Submission[]> {
	const command = new QueryCommand({
		TableName: tableName,
		IndexName: "AuthorIndex",
		KeyConditionExpression: "userId = :userId",
		ExpressionAttributeValues: {
			":userId": userId,
		},
		ScanIndexForward: false, // Latest first
	});

	const result = await docClient.send(command);
	const items = (result.Items || []) as DynamoDBSubmissionItem[];

	return items.map((item) => ({
		submissionId: item.submissionId,
		userId: item.userId,
		missionId: item.missionId,
		inputText: item.inputText,
		outputText: item.outputText,
		createdAt: item.createdAt,
	}));
}
