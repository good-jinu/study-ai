import type { Metadata } from "next";
import ContentsScreen from "@/components/ContentsScreen";

/**
 * Metadata for the home page
 */
export const metadata: Metadata = {
	title: "AI Study Platform",
	description:
		"An AI-powered studying platform that delivers educational content in a short-form, infinite-scroll format. Study with flashcards, quizzes, and bite-sized lessons.",
	keywords: ["study", "education", "AI", "flashcards", "quiz", "learning"],
};

export default function Home() {
	return <ContentsScreen />;
}
