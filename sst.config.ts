/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "study-ai",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		const contentsTable = new sst.aws.Dynamo("ContentsTable", {
			fields: {
				contentId: "string",
				createdAt: "string",
				authorId: "string",
				status: "string",
			},
			primaryIndex: { hashKey: "contentId" },
			globalIndexes: {
				AuthorIndex: {
					hashKey: "authorId",
					rangeKey: "createdAt",
					projection: "all",
				},
				StatusIndex: {
					hashKey: "status",
					rangeKey: "createdAt",
					projection: "all",
				},
			},
		});

		new sst.aws.Nextjs("StudyAIWeb", {
			domain: {
				name: process.env.WEB_DOMAIN ?? "",
			},
			environment: {
				APP_AWS_REGION: process.env.APP_AWS_REGION ?? "us-east-1",
			},
			path: "packages/web",
			link: [contentsTable],
		});
	},
});
