"use client";

import {
	Home,
	Upload,
	Compass,
	Info,
	Contact,
	LogIn,
	LayoutDashboard,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/navigation";
import SignOutButton from "./signout-button";
import { ThemeToggle2 } from "./theme-toggle2";

interface SidebarProps {
	sidebarOpen: boolean;
	currentPage: string;
	setCurrentPage: (page: string) => void;
	isLoggedIn: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
	sidebarOpen,
	currentPage,
	setCurrentPage,
	isLoggedIn,
}) => {
	const router = useRouter();

	const handlePageChange = (page: string) => {
		setCurrentPage(page); // update UI state
		router.push(`/${page}`); // redirect to route
	};
	const collapsed = !sidebarOpen;
	const navItems = [
		{ id: "home", icon: Home, label: "Home" },
		{ id: "explore", icon: Compass, label: "Explore" },
		{ id: "upload", icon: Upload, label: "Upload" },
		{ id: "dashboard", icon: LayoutDashboard, label: "dashboard" },
	] as const;

	const navItems2 = [
		{ id: "about", icon: Info, label: "About" },
		{ id: "contact", icon: Contact, label: "Contact" },
	] as const;
	return (
		<aside
			className={`hidden lg:block fixed h-[calc(100vh-4rem)] bg-[#f1f1f1] dark:bg-neutral-900 transition-all duration-300 z-40
      ${sidebarOpen ? "w-[18.5rem]" : "w-20"} overflow-hidden`}
		>
			<div className="flex h-full flex-col px-3 py-6">
				<nav className="flex-1 space-y-2">
					{navItems.map(({ id, icon: Icon, label }) => (
						<Button
							key={id}
							onClick={() => handlePageChange(id)}
							variant="ghost"
							className={`w-full justify-start rounded-xl py-3 text-base gap-3
                ${
									currentPage === id
										? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
										: "text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-neutral-800"
								}`}
						>
							<Icon size={20} />

							{/* Label fades out on collapse */}
							<span
								className={`font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-full"}`}
							>
								{label}
							</span>
						</Button>
					))}
				</nav>

				{/* Footer */}
				<div className="mt-auto pt-6 flex flex-col gap-4">
					<nav className="flex justify-around">
						{navItems2.map(({ id, icon: Icon, label }) => (
							<Button
								key={id}
								onClick={() => handlePageChange(id)}
								variant="ghost"
								className=""
							>
								{/* Label fades out on collapse */}
								<span
									className={`font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-full"}`}
								>
									{label}
								</span>
							</Button>
						))}
					</nav>
					<Separator
						className={`bg-rose-200 dark:bg-neutral-700 mb-4 transition-opacity duration-300 
            ${collapsed ? "opacity-0" : "opacity-100"}`}
					/>

					<ThemeToggle2 />
					{/* User Section */}
					<div className="flex items-center gap-3 mb-4">
						<Avatar className="h-10 w-10">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
								U
							</AvatarFallback>
						</Avatar>

						<div
							className={`flex-1 min-w-0 transition-all duration-300 
              ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
						>
							<p className="font-medium text-gray-900 dark:text-gray-100 truncate">
								User Name
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
								user@email.com
							</p>
						</div>
					</div>

					{/* Logout */}

					{isLoggedIn ? (
						<>
							<SignOutButton />
						</>
					) : (
						<Button
							onClick={() => router.push("/login")}
							className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all hover:scale-105 hover:shadow-lg"
						>
							<LogIn className="h-4 w-4" />
							<span>Login</span>
						</Button>
					)}
				</div>
			</div>
		</aside>
	);
};
