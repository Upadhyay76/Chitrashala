"use client";

import Link from "next/link";
import { Grid } from "lucide-react";

interface LogoProps {
	collapsed: boolean;
}

export function Logo({ collapsed }: LogoProps) {
	return (
		<Link href="/home" className="flex items-center space-x-2">
			<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500">
				<Grid className="h-5 w-5 text-white" />
			</div>
			<h1
				className={`text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 
            bg-clip-text text-transparent transition-opacity duration-300 
            ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
			>
				Chitrashala
			</h1>
		</Link>
	);
}
