// components/home/image-grid.tsx
import React from "react";
import Image from "next/image"; // Use next/image for optimization
import type { ImageItem } from "~/types";
import { Button } from "~/components/ui/button";

interface ImageGridProps {
	images: ImageItem[];
}

export function ImageGrid({ images }: ImageGridProps) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-12">
			<div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
				{images.map((img) => (
					<div
						key={img.id}
						className="group relative cursor-pointer overflow-hidden break-inside-avoid rounded-2xl bg-card transition-all hover:scale-[1.02]"
					>
						<Image
							src={img.url}
							alt={img.alt}
							width={400} // Provide appropriate width/height for next/image
							height={Math.floor(Math.random() * (600 - 300 + 1)) + 300} // Example random height
							className="h-auto w-full object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
							<div className="absolute bottom-0 left-0 right-0 p-4">
								<h3 className="font-semibold text-white">{img.title}</h3>
							</div>
							<Button className="absolute right-4 top-4 bg-red-500 text-sm font-medium text-white hover:bg-red-600">
								Save
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
