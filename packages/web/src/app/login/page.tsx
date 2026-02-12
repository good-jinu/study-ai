import { signIn } from "@/auth";

export default function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl font-bold mb-4">Sign In</h1>
			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: "/contents" });
				}}
			>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Sign in with Google
				</button>
			</form>
		</div>
	);
}
