import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
	const session = await auth();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-4xl font-bold mb-4">Contents List</h1>
			<p className="mb-4">Welcome to the study platform.</p>

			{session ? (
				<div className="flex flex-col items-center gap-4">
					<p>Signed in as {session.user?.email}</p>
					<Link href="/contents" className="text-blue-500 hover:underline">
						Go to Contents
					</Link>
				</div>
			) : (
				<Link
					href="/login"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Sign In
				</Link>
			)}
		</div>
	);
}
