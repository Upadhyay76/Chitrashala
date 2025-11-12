"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle2() {
	const { setTheme } = useTheme();

	return (
		<>
			<span
				className="bg-gray-300 dark:bg-gray-100/20 p-4 rounded-2xl gap-4 hidden dark:flex "
				onClick={() => setTheme("light")}
			>
				<Moon />
				Dark
			</span>

			<span
				className="bg-gray-300 dark:bg-gray-100/20 p-4 rounded-2xl flex gap-4 dark:hidden text-black"
				onClick={() => setTheme("dark")}
			>
				<Sun />
				Light
			</span>
		</>
	);
}
