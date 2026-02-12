import { signIn } from "@/auth";
import { getDictionary } from "@/dictionaries";

export default async function SignIn({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const dict = await getDictionary(lang);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
			<h1 className="text-2xl font-bold mb-4 text-foreground">
				{dict.common.signIn}
			</h1>
			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: `/${lang}` });
				}}
			>
				<button
					type="submit"
					className="bg-primary text-success-foreground font-bold py-2 px-4 rounded hover:opacity-90 transition-opacity"
				>
					{dict.common.signInWithGoogle}
				</button>
			</form>
		</div>
	);
}
