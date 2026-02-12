import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata, Viewport } from "next";
import "../globals.css";
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

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

	return (
		<html lang={locale} className="h-full">
			<head></head>
			<body className="antialiased bg-background text-foreground h-full">
        <NextIntlClientProvider messages={messages}>
				  <SkipLink />
				  <main id="main-content" className="min-h-screen">
					  {children}
				  </main>
        </NextIntlClientProvider>
			</body>
		</html>
	);
}
