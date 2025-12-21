import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";

export const metadata: Metadata = {
	title: "StudyAI",
	description: "Study ai infinitely",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "StudyAI",
	},
};

export const viewport: Viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<head></head>
			<body className="antialiased bg-background text-foreground h-full">
				<SkipLink />
				<main id="main-content" className="min-h-screen">
					{children}
				</main>
			</body>
		</html>
	);
}
