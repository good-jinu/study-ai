import type { MediaAttachment } from "@study-ai/core";
import Image from "next/image";
import { useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";

interface MediaDisplayProps {
	media: MediaAttachment[];
	className?: string;
}

export function MediaDisplay({ media, className = "" }: MediaDisplayProps) {
	const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(
		null,
	);

	if (!media || media.length === 0) {
		return null;
	}

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

	const formatFileSize = (bytes?: number) => {
		if (!bytes || bytes === 0) return "";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const renderMediaPreview = (mediaItem: MediaAttachment) => {
		switch (mediaItem.type) {
			case "image":
				return (
					<div
						className="relative w-full h-32 cursor-pointer hover:opacity-80 transition-opacity"
						onClick={() => setSelectedMedia(mediaItem)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedMedia(mediaItem);
							}
						}}
						role="dialog"
					>
						<Image
							src={mediaItem.url}
							alt={mediaItem.fileName}
							fill
							style={{ objectFit: "cover" }}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				);
			case "video":
				return (
					<video
						src={mediaItem.url}
						className="w-full h-32 object-cover rounded"
						controls
						preload="metadata"
					>
						<track kind="captions" srcLang="en" label="English" />
					</video>
				);
			case "audio":
				return (
					<div className="flex items-center justify-center h-32 bg-muted rounded">
						<div className="text-center">
							<div className="text-2xl mb-2">🎵</div>
							<audio src={mediaItem.url} controls className="w-full">
								<track kind="captions" srcLang="en" label="English" />
							</audio>{" "}
						</div>
					</div>
				);
			case "document":
				return (
					<div className="flex items-center justify-center h-32 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors">
						<div className="text-center">
							<div className="text-2xl mb-2">📄</div>
							<p className="text-sm font-medium truncate">
								{mediaItem.fileName}
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => window.open(mediaItem.url, "_blank")}
								className="mt-2"
							>
								Open
							</Button>
						</div>
					</div>
				);
			default:
				return (
					<div className="flex items-center justify-center h-32 bg-muted rounded">
						<div className="text-center">
							<div className="text-2xl mb-2">📎</div>
							<p className="text-sm font-medium truncate">
								{mediaItem.fileName}
							</p>
						</div>
					</div>
				);
		}
	};

	return (
		<>
			<div className={`space-y-3 ${className}`}>
				<h4 className="text-sm font-medium text-foreground">
					Media Attachments ({media.length})
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{media.map((mediaItem) => (
						<Card key={mediaItem.key} className="overflow-hidden">
							<CardContent className="p-3">
								{renderMediaPreview(mediaItem)}
								<div className="mt-2">
									<div className="flex items-center space-x-2 text-xs text-muted-foreground">
										<span>{getFileTypeIcon(mediaItem.type)}</span>
										<span className="truncate flex-1">
											{mediaItem.fileName}
										</span>
									</div>
									{mediaItem.size && (
										<p className="text-xs text-muted-foreground mt-1">
											{formatFileSize(mediaItem.size)}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Image Modal */}
			{selectedMedia && selectedMedia.type === "image" && (
				<div
					className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedMedia(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setSelectedMedia(null);
						}
					}}
					role="dialog"
				>
					<div className="relative w-full h-full max-w-4xl max-h-full">
						<Image
							src={selectedMedia.url}
							alt={selectedMedia.fileName}
							fill
							style={{ objectFit: "contain" }}
							sizes="100vw"
						/>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSelectedMedia(null)}
							className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
						>
							✕
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
