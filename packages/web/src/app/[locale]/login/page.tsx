import { signIn } from "@/auth";

export default function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
			<h1 className="text-2xl font-bold mb-4 text-foreground">Sign In</h1>
			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: "/" });
				}}
			>
				<button
					type="submit"
					className="bg-primary text-success-foreground font-bold py-2 px-4 rounded hover:opacity-90 transition-opacity"
				>
					Sign in with Google
				</button>
			</form>
		</div>
	);
}
