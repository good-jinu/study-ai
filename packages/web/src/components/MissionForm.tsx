"use client";

import type { Mission } from "@study-ai/core";
import { useState } from "react";
import { submitMissionAction } from "@/actions/missionActions";

interface MissionFormProps {
	mission: Mission;
}

export default function MissionForm({ mission }: MissionFormProps) {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		setLoading(true);
		setError("");
		try {
			const result = await submitMissionAction(mission.missionId, input);
			setOutput(result.outputText);
		} catch (err) {
			console.error(err);
			setError(
				"AI 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-8">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="input"
						className="block text-sm font-medium text-muted-foreground mb-2"
					>
						입력 데이터
					</label>
					<textarea
						id="input"
						rows={8}
						className="w-full p-4 border border-input bg-background text-foreground rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
						placeholder={mission.uiConfig.inputPlaceholder}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						required
					/>
				</div>
				<button
					type="submit"
					disabled={loading || !input.trim()}
					className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
						loading || !input.trim()
							? "bg-muted text-muted-foreground cursor-not-allowed"
							: "bg-primary text-success-foreground hover:opacity-90 active:scale-[0.98]"
					}`}
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							처리 중...
						</div>
					) : (
						"AI에게 부탁하기"
					)}
				</button>
			</form>

			{error && (
				<div className="p-4 bg-error-muted text-error rounded-xl border border-error">
					{error}
				</div>
			)}

			{output && (
				<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<h3 className="text-xl font-bold text-foreground">✨ AI 훈련 결과</h3>
					<div className="bg-card-background p-6 rounded-xl shadow-sm border border-card-border whitespace-pre-wrap text-foreground leading-relaxed">
						{output}
					</div>
					<button
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(output);
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
						}}
						className="inline-flex items-center text-primary font-medium hover:underline gap-2"
					>
						{copied ? "복사 완료! ✨" : "복사하기 📋"}
					</button>
				</div>
			)}
		</div>
	);
}
