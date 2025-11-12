// app/_components/footer.tsx
import Link from "next/link";
import { Grid } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t bg-card py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
					<Link href="/" className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500">
							<Grid className="h-5 w-5 text-white" />
						</div>
						<span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
							Pinspire
						</span>
					</Link>
					<div className="flex space-x-6">
						<Link
							href="/privacy"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Privacy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Terms
						</Link>
						<Link
							href="/contact"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Contact
						</Link>
					</div>
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Pinspire. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
