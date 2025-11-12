import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import LandingPage from "./_components/landingpage";

export default async function PinterestHomepage() {
	const session = await getSession();

	if (session) redirect("/home");

	return (
		<>
			<LandingPage />
		</>
	);
}
