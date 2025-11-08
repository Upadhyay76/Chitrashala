// app/_components/main-nav.tsx
'use client';

import Link from 'next/link';
import {
  Search,
  Bell,
  MessageCircle,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ThemeToggle } from './theme-toggle'; // Import the ThemeToggle component
import { Logo } from '~/components/logo';
import { useRouter } from "next/navigation";
import SignOutButton from './signout-button';

interface MainNavProps {
  isLoggedIn: boolean;
}

export function MainNav({ isLoggedIn }: MainNavProps) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Nav Links */}
        <div className="flex items-center space-x-8">
          <Logo />

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Create
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden flex-1 lg:mx-8 lg:flex lg:max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for ideas..."
              className="h-10 w-full rounded-full pl-10 pr-4 focus-visible:ring-red-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
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
    </nav>
  );
}
