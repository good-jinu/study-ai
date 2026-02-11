import { getMultiplePresignedUploadUrls } from "@study-ai/db";
import { type NextRequest, NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { files } = body;

		if (!files || !Array.isArray(files) || files.length === 0) {
			return NextResponse.json(
				{ error: "files array is required" },
				{ status: 400 },
			);
		}

		// Validate each file
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

		for (const file of files) {
			if (!file.fileName || !file.contentType) {
				return NextResponse.json(
					{ error: "Each file must have fileName and contentType" },
					{ status: 400 },
				);
			}

			if (!allowedTypes.includes(file.contentType)) {
				return NextResponse.json(
					{ error: `File type ${file.contentType} not allowed` },
					{ status: 400 },
				);
			}
		}

		// Limit number of files
		if (files.length > 10) {
			return NextResponse.json(
				{ error: "Maximum 10 files allowed per request" },
				{ status: 400 },
			);
		}

		// Generate presigned URLs
		const results = await getMultiplePresignedUploadUrls({
			files: files.map(({ fileName, contentType }) => ({
				fileName,
				contentType,
			})),
			bucketName: Resource.MediaBucket.name,
			expiresIn: 3600, // 1 hour
		});

		return NextResponse.json({
			presignedUrls: results.map((result, index) => ({
				key: result.key,
				presignedUrl: result.presignedUrl,
				publicUrl: result.publicUrl,
				fileName: files[index].fileName,
				contentType: files[index].contentType,
			})),
		});
	} catch (error) {
		console.error("Error generating presigned URLs:", error);
		return NextResponse.json(
			{ error: "Failed to generate presigned URLs" },
			{ status: 500 },
		);
	}
}
