import { S3Client } from "@aws-sdk/client-s3";

/**
 * S3 client configuration
 */
export const createS3Client = () => {
	return new S3Client({
		region: process.env.APP_AWS_REGION || "us-east-1",
	});
};

// Export a default client instance
export const s3Client = createS3Client();
