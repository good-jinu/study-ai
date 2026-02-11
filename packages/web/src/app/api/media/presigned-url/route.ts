import { getPresignedUploadUrl } from "@study-ai/db";
import { type NextRequest, NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { fileName, contentType } = body;

		if (!fileName || !contentType) {
			return NextResponse.json(
				{ error: "fileName and contentType are required" },
				{ status: 400 },
			);
		}

		// Validate file type (optional security measure)
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
			"video/mp4",
			"video/webm",
			"audio/mp3",
			"audio/wav",
			"application/pdf",
		];

		if (!allowedTypes.includes(contentType)) {
			return NextResponse.json(
				{ error: "File type not allowed" },
				{ status: 400 },
			);
		}

		// Generate presigned URL
		const result = await getPresignedUploadUrl({
			fileName,
			contentType,
			bucketName: Resource.MediaBucket.name,
			expiresIn: 3600, // 1 hour
		});

		return NextResponse.json({
			key: result.key,
			presignedUrl: result.presignedUrl,
			publicUrl: result.publicUrl,
		});
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return NextResponse.json(
			{ error: "Failed to generate presigned URL" },
			{ status: 500 },
		);
	}
}
