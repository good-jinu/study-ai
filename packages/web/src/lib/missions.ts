import type { Mission } from "@study-ai/core";

export const DEFAULT_MISSIONS: Mission[] = [
	{
		missionId: "mission_email",
		title: "이메일 정중하게 다듬기",
		description: "상사에게 보내는 메일을 세련되게 바꿉니다.",
		promptSystem:
			"You are a polite business assistant. Transform the user's rough input into a professional and polite business email in Korean. Explain why you made the changes.",
		uiConfig: {
			inputPlaceholder: "여기에 거친 메일을 붙여넣으세요...",
			icon: "📧",
		},
	},
	{
		missionId: "mission_meeting",
		title: "회의록 깔끔 요약",
		description: "회의 노트를 결정사항과 액션 아이템 중심으로 요약합니다.",
		promptSystem:
			"You are a professional secretary. Summarize the meeting notes into 'Key Decisions' and 'Action Items' in Korean.",
		uiConfig: {
			inputPlaceholder: "회의 노트를 입력하세요...",
			icon: "📝",
		},
	},
	{
		missionId: "mission_report",
		title: "보고서 초안 작성",
		description: "아이디어 메모를 구조화된 보고서 초안으로 만듭니다.",
		promptSystem:
			"You are a strategic consultant. Transform the user's idea into a structured report draft with 'Background', 'Problem', and 'Solution' sections in Korean.",
		uiConfig: {
			inputPlaceholder: "아이디어 메모를 입력하세요...",
			icon: "📊",
		},
	},
];
