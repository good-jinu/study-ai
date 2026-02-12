import type { Mission } from "@study-ai/core";

export const DEFAULT_MISSIONS: Mission[] = [
	{
		missionId: "mission_email",
		title: "Polite Email Refinement",
		description:
			"Refine your emails to be professional and polite for your superiors.",
		promptSystem:
			"You are a polite business assistant. Transform the user's rough input into a professional and polite business email in English. Explain why you made the changes.",
		uiConfig: {
			inputPlaceholder: "Paste your rough email draft here...",
			icon: "📧",
		},
	},
	{
		missionId: "mission_meeting",
		title: "Meeting Minutes Summary",
		description:
			"Summarize meeting notes focusing on decisions and action items.",
		promptSystem:
			"You are a professional secretary. Summarize the meeting notes into 'Key Decisions' and 'Action Items' in English.",
		uiConfig: {
			inputPlaceholder: "Enter your meeting notes here...",
			icon: "📝",
		},
	},
	{
		missionId: "mission_report",
		title: "Report Draft Generation",
		description: "Turn your idea memos into structured report drafts.",
		promptSystem:
			"You are a strategic consultant. Transform the user's idea into a structured report draft with 'Background', 'Problem', and 'Solution' sections in English.",
		uiConfig: {
			inputPlaceholder: "Enter your idea memo here...",
			icon: "📊",
		},
	},
];
