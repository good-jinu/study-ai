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
				type: "string",
				subject: "string",
			},
			primaryIndex: { hashKey: "contentId" },
			globalIndexes: {
				AuthorIndex: {
					hashKey: "authorId",
					rangeKey: "createdAt",
					projection: "all",
				},
				TypeIndex: {
					hashKey: "type",
					rangeKey: "createdAt",
					projection: "all",
				},
				SubjectIndex: {
					hashKey: "subject",
					rangeKey: "createdAt",
					projection: "all",
				},
			},
		});

		const usersTable = new sst.aws.Dynamo("UsersTable", {
			fields: {
				userId: "string",
			},
			primaryIndex: { hashKey: "userId" },
		});

		const missionsTable = new sst.aws.Dynamo("MissionsTable", {
			fields: {
				missionId: "string",
			},
			primaryIndex: { hashKey: "missionId" },
		});

		const submissionsTable = new sst.aws.Dynamo("SubmissionsTable", {
			fields: {
				submissionId: "string",
				userId: "string",
				createdAt: "string",
			},
			primaryIndex: { hashKey: "submissionId" },
			globalIndexes: {
				AuthorIndex: {
					hashKey: "userId",
					rangeKey: "createdAt",
					projection: "all",
				},
			},
		});

		const mediaBucket = new sst.aws.Bucket("MediaBucket", {
			public: true,
		});

		new sst.aws.Nextjs(
			"StudyAIWeb",
			{
				domain: {
					name: process.env.WEB_DOMAIN ?? "",
				},
				environment: {
					APP_AWS_REGION: process.env.APP_AWS_REGION ?? "us-east-1",
					GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
					GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
					AUTH_SECRET: process.env.AUTH_SECRET ?? "",
					NEXTAUTH_URL:
						process.env.NEXTAUTH_URL ??
						(process.env.WEB_DOMAIN ? `https://${process.env.WEB_DOMAIN}` : ""),
				},
				path: "packages/web",
				link: [
					contentsTable,
					usersTable,
					missionsTable,
					submissionsTable,
					mediaBucket,
				],
			},
			{ dependsOn: mediaBucket },
		);
	},
});
