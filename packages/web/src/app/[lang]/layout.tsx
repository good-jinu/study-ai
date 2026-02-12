import type { Metadata, Viewport } from "next";
import "../globals.css";
import { SkipLink } from "@/components/SkipLink";
import { getDictionary } from "@/dictionaries";
import { DictionaryProvider } from "@/components/DictionaryProvider";

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

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}>) {
	const { lang } = await params;
	const dictionary = await getDictionary(lang);

	return (
		<html lang={lang} className="h-full">
			<head></head>
			<body className="antialiased bg-background text-foreground h-full">
				<DictionaryProvider dictionary={dictionary}>
					<SkipLink />
					<main id="main-content" className="min-h-screen">
						{children}
					</main>
				</DictionaryProvider>
			</body>
		</html>
	);
}
