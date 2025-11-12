// components/home/hero-section.tsx
import React from "react";

export function HeroSection() {
	return (
		<div className="py-16 text-center lg:py-24">
			<h1 className="mb-4 text-5xl font-bold text-foreground md:text-6xl">
				Get your next
			</h1>
			<h2 className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
				home decor idea
			</h2>
			<div className="mt-6 flex justify-center space-x-2">
				<div className="h-2 w-2 rounded-full bg-red-500"></div>
				<div className="h-2 w-2 rounded-full bg-muted"></div>
				<div className="h-2 w-2 rounded-full bg-muted"></div>
			</div>
		</div>
	);
}
