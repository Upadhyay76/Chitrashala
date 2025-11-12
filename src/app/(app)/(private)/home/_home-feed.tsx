"use client";
import Link from "next/link";
import { useState } from "react";

export default function PostCard({ post, href }: { post: any, href: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={"post/" + href}
      className="break-inside-avoid rounded-2xl overflow-hidden shadow-md bg-white transition-all duration-200 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {post.type === "image" && (
        <img
          src={post.mediaUrl}
          alt={post.title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      )}

      {post.type === "video" && (
        <video
          src={post.mediaUrl}
          title={post.title}
          className="w-full h-auto object-cover"
          autoPlay={true}
          muted
          loop
          playsInline
        />
      )}

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? "opacity-30" : "opacity-0"
          }`}
      ></div>

      <button
        className={`absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
      >
        Save
      </button>
    </Link>
  );
}
