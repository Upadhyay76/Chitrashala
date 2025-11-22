"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Share2, MoreHorizontal, Download, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

export default function PostCard({ post, href }: { post: any; href: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group break-inside-avoid mb-4 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 transition-all duration-300 cursor-pointer relative hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={"/post/" + href}>
        {/* Media Content */}
        <div className="relative overflow-hidden rounded-3xl">
          {post.type === "image" && (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {post.type === "video" && (
            <video
              src={post.mediaUrl}
              title={post.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              autoPlay={true}
              muted
              loop
              playsInline
            />
          )}

          {/* Gradient Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Top Actions - Visible on Hover */}
          <div
            className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
          >
            <Button
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                // Handle share
              }}
              className="h-10 w-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                // Handle more options
              }}
              className="h-10 w-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom Info - Visible on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            {/* Title & Description */}
            <div className="mb-3">
              <h3 className="font-bold text-white text-base line-clamp-2 drop-shadow-lg mb-1">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-white/90 text-sm line-clamp-1 drop-shadow-lg">
                  {post.description}
                </p>
              )}
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center justify-between">
              <Link
                href={`/profile/${post.user?.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={post.user?.avatarImage || post.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs font-bold">
                    {post.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-semibold drop-shadow-lg">
                  {post.user?.name}
                </span>
              </Link>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle save
                }}
                className="h-10 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold shadow-xl transition-all duration-200 hover:scale-105"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Badges - Always Visible */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {post.accessType === "paid" && post.price && (
              <div className="px-3 py-1.5 rounded-full bg-rose-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                ${post.price}
              </div>
            )}
            {post.isDownloadable && (
              <div className="px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg flex items-center gap-1">
                <Download className="h-3 w-3" />
                Download
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Tags - Below Image (Always Visible) */}
      {post.tags && post.tags.length > 0 && !isHovered && (
        <div className="p-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats - Bottom of Card (Always Visible) */}
      <div className="px-3 pb-3 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            0
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            0
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
        </span>
      </div>
    </div>
  );
}
