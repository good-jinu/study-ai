import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * DynamoDB client configuration
 */
export const createDynamoDBClient = () => {
	const client = new DynamoDBClient({
		region: process.env.APP_AWS_REGION || "us-east-1",
	});
	return DynamoDBDocumentClient.from(client);
};

// Export a default client instance
export const docClient = createDynamoDBClient();
