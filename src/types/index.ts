// types/index.ts
export interface ImageItem {
	id: number;
	url: string;
	title: string;
	alt: string; // Added alt for accessibility
}

export interface FeatureItem {
	title: string;
	description: string;
	icon: React.ElementType; // Use React.ElementType for Lucide icons
}
