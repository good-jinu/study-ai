import OpenAI from "openai";

export interface AIResponse {
	outputText: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export class AIService {
	private openai: OpenAI;

	constructor(apiKey: string) {
		this.openai = new OpenAI({
			apiKey,
		});
	}

	async generateMissionOutput(
		systemPrompt: string,
		userInput: string,
	): Promise<AIResponse> {
		try {
			const response = await this.openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userInput },
				],
				temperature: 0.7,
			});

			return {
				outputText: response.choices[0].message.content || "",
				usage: response.usage
					? {
							promptTokens: response.usage.prompt_tokens,
							completionTokens: response.usage.completion_tokens,
							totalTokens: response.usage.total_tokens,
						}
					: undefined,
			};
		} catch (error) {
			console.error("Error calling OpenAI:", error);
			throw new Error("Failed to generate AI response");
		}
	}
}
