// app/_components/mobile-nav.tsx
'use client';

import Link from 'next/link';
import { Menu, Grid, LogIn, LogOut, Search } from 'lucide-react';
import { useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { ThemeToggle } from './theme-toggle';
import { Logo } from '~/components/logo';
import { useRouter } from 'next/navigation';
import SignOutButton from './signout-button';

interface MobileNavProps {
  isLoggedIn: boolean;
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>
              <Logo onClick={() => setIsOpen(false)} />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for Pinspire.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for ideas..."
                className="h-10 w-full rounded-full pl-10 pr-4 focus-visible:ring-red-500"
              />
            </div>
            <Link
              href="/about"
              className="text-lg font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/explore"
              className="text-lg font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-lg font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Create
            </Link>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Dark Mode</span>
              <ThemeToggle />
            </div>
            {isLoggedIn ? (
              <SignOutButton />
            ) : (
              <Button
                onClick={() => {
                  router.push("/login")
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
