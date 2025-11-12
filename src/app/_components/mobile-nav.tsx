"use client";

import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { Logo } from "~/components/logo";
import { useUIStore } from "~/stores/ui-store";

interface MobileNavProps {
	isLoggedIn: boolean;
	links: string[];
	showSearchBar: boolean;
	toggleSidebar: () => void;
}

export function MobileNav({ showSearchBar, toggleSidebar }: MobileNavProps) {
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	return (
		<nav className="fixed bg-white dark:bg-neutral-900 h-16 w-full top-0 text-black dark:text-white ">
			<div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
				<Logo collapsed={false} />
				{/* SEARCH BAR */}
				{showSearchBar && (
					<div
						className={`transition-all rounded-2xl max-w-full mx-4 hidden sm:flex w-[80%] sm:mx-8"
              }`}
					>
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<Input
								type="text"
								placeholder="Search for ideas..."
								className="h-10 w-full rounded-full pl-10 pr-4 bg-white/10 text-white border-white/20 focus-visible:ring-red-500"
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
							/>
						</div>
					</div>
				)}

				{/* RIGHT ACTIONS */}
				<div className="flex items-center gap-2">
					<Menu className="lg:ml-12" onClick={toggleSidebar} />
				</div>
			</div>
		</nav>
	);
}
