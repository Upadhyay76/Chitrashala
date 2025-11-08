import { Grid } from 'lucide-react'; // Example icon for features

import { MainNav } from '~/app/_components/main-nav';
import { MobileNav } from '~/app/_components/mobile-nav';
import { Footer } from '~/app/_components/footer';
import { HeroSection } from '~/components/home/hero-section';
import { ImageGrid } from '~/components/home/image-grid';
import { FeaturesSection } from '~/components/home/features-section';
import type { ImageItem, FeatureItem } from '~/types';
import { Logo } from '~/components/logo';
import { redirect } from 'next/navigation';
import { getSession } from '~/server/better-auth/server';

const IMAGES: ImageItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', title: 'Modern Living Room', alt: 'Modern Living Room Interior' },
  { id: 2, url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400', title: 'Cozy Bedroom', alt: 'Cozy Bedroom with warm lighting' },
  { id: 3, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', title: 'Kitchen Ideas', alt: 'Stylish kitchen with island' },
  { id: 4, url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400', title: 'Minimalist Design', alt: 'Minimalist room design' },
  { id: 5, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', title: 'Outdoor Space', alt: 'Relaxing outdoor patio' },
  { id: 6, url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', title: 'Home Office', alt: 'Productive home office setup' },
  { id: 7, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', title: 'Bathroom Decor', alt: 'Elegant bathroom decor' },
  { id: 8, url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400', title: 'Dining Room', alt: 'Spacious dining room' },
];

const FEATURES: FeatureItem[] = [
  { title: 'Discover', description: 'Find inspiration for your next project', icon: Grid },
  { title: 'Create', description: 'Turn your ideas into beautiful boards', icon: Grid },
  { title: 'Share', description: 'Collaborate with friends and family', icon: Grid },
];

export default async function PinterestHomepage() {
  const session = await getSession();

  if (session) redirect("/home");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Navigation for Desktop */}
      <div className="hidden md:block">
        <MainNav isLoggedIn={false} />
      </div>
      {/* Mobile Navigation for Mobile */}
      <div className="block md:hidden">
        <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-lg">
          {/* Use the Logo component here */}
          <Logo />
          <MobileNav isLoggedIn={false} />
        </div>
      </div>

      <main className="flex-1">
        <HeroSection />
        <ImageGrid images={IMAGES} />
        <FeaturesSection features={FEATURES} />
      </main>

      <Footer />
    </div>
  );
}
