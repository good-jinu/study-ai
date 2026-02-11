"use client";

import type { MediaAttachment } from "@study-ai/core";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button, Card, CardContent, Label } from "@/components/ui";
import {
	type FileUploadInfo,
	getMediaTypeFromFile,
	uploadFiles,
} from "@/lib/media-upload";

interface MediaUploadProps {
	value: MediaAttachment[];
	onChange: (media: MediaAttachment[]) => void;
	maxFiles?: number;
	acceptedTypes?: string[];
}

export default function MediaUpload({
	value = [],
	onChange,
	maxFiles = 5,
	acceptedTypes = ["image/*", "video/*", "audio/*", "application/pdf"],
}: MediaUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleFileSelect = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || []);
			if (files.length === 0) return;

			// Check file count limit
			if (value.length + files.length > maxFiles) {
				setUploadError(`Maximum ${maxFiles} files allowed`);
				return;
			}

			setUploading(true);
			setUploadError(null);

			try {
				const fileInfos: FileUploadInfo[] = files.map((file) => ({
					file,
					type: getMediaTypeFromFile(file),
				}));

				const uploadedMedia = await uploadFiles(fileInfos);
				onChange([...value, ...uploadedMedia]);
			} catch (error) {
				console.error("Upload error:", error);
				setUploadError(
					error instanceof Error ? error.message : "Failed to upload files",
				);
			} finally {
				setUploading(false);
				// Reset input
				event.target.value = "";
			}
		},
		[value, onChange, maxFiles],
	);

	const handleRemoveMedia = useCallback(
		(index: number) => {
			const newMedia = value.filter((_, i) => i !== index);
			onChange(newMedia);
		},
		[value, onChange],
	);

	const getFileTypeIcon = (type: MediaAttachment["type"]) => {
		switch (type) {
			case "image":
				return "🖼️";
			case "video":
				return "🎥";
			case "audio":
				return "🎵";
			case "document":
				return "📄";
			default:
				return "📎";
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div className="space-y-4">
			<div>
				<Label>Media Attachments</Label>
				<p className="text-sm text-muted-foreground mt-1">
					Upload images, videos, audio files, or documents (max {maxFiles}{" "}
					files)
				</p>
			</div>

			{/* Upload Button */}
			<div>
				<input
					type="file"
					multiple
					accept={acceptedTypes.join(",")}
					onChange={handleFileSelect}
					disabled={uploading || value.length >= maxFiles}
					className="hidden"
					id="media-upload-input"
				/>
				<Button
					type="button"
					variant="secondary"
					onClick={() => document.getElementById("media-upload-input")?.click()}
					disabled={uploading || value.length >= maxFiles}
					className="w-full"
				>
					{uploading ? "Uploading..." : "Choose Files"}
				</Button>
			</div>

			{/* Upload Error */}
			{uploadError && (
				<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
					{uploadError}
				</div>
			)}

			{/* Uploaded Files List */}
			{value.length > 0 && (
				<div className="space-y-2">
					<Label>
						Uploaded Files ({value.length}/{maxFiles})
					</Label>
					{value.map((media, index) => (
						<Card key={media.key} className="p-3">
							<CardContent className="p-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<span className="text-lg">
											{getFileTypeIcon(media.type)}
										</span>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground truncate">
												{media.fileName}
											</p>
											<div className="flex items-center space-x-2 text-xs text-muted-foreground">
												<span className="capitalize">{media.type}</span>
												{media.size && (
													<>
														<span>•</span>
														<span>{formatFileSize(media.size)}</span>
													</>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										{media.type === "image" && (
											<Image
												src={media.url}
												alt={media.fileName}
												width={40} // Specify appropriate width
												height={40} // Specify appropriate height
												className="w-10 h-10 object-cover rounded"
											/>
										)}
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveMedia(index)}
											className="text-red-600 hover:text-red-700"
										>
											Remove
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
