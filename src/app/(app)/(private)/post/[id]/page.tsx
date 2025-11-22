import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  Bookmark,
  MoreVertical,
  Eye,
  DollarSign,
  Calendar,
  Tag as TagIcon,
  ArrowLeft,
  Globe,
  Lock
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import PostCard from "../../home/_home-feed";

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const post = await api.post.getPostById({ id });

  if (!post) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-rose-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Post not found</h2>
          <p className="text-gray-500 dark:text-gray-400">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/home">
            <Button className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <ArrowLeft className="mr-2" size={18} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch recommended posts (same user or similar tags)
  const { posts: allPosts } = await api.post.getPosts();
  const recommendedPosts = allPosts
    .filter(p => p.id !== post.id && (p.userId === post.userId || p.tags?.some(tag => post.tags?.includes(tag))))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Link href="/home">
          <Button
            variant="ghost"
            className="mb-4 hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-full"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Feed
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Card */}
            <Card className="overflow-hidden border-2 border-gray-200 dark:border-neutral-800 rounded-3xl shadow-xl">
              <div className="relative">
                {post.type === "image" ? (
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <video
                    src={post.mediaUrl}
                    controls
                    className="w-full h-auto"
                  />
                )}

                {/* Overlay Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className={`${post.visibility === "public"
                    ? "bg-green-500/90 hover:bg-green-600"
                    : "bg-gray-500/90 hover:bg-gray-600"
                    } text-white backdrop-blur-sm shadow-lg flex items-center gap-1.5 px-3 py-2`}>
                    {post.visibility === "public" ? <Globe size={14} /> : <Lock size={14} />}
                    {post.visibility === "public" ? "Public" : "Private"}
                  </Badge>

                  {post.accessType === "paid" && post.price && (
                    <Badge className="bg-rose-500/90 hover:bg-rose-600 text-white backdrop-blur-sm shadow-lg flex items-center gap-1.5 px-3 py-2">
                      <DollarSign size={14} />
                      ${post.price}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Title & Actions */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {post.title}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-full shrink-0"
                  >
                    <MoreVertical size={20} />
                  </Button>
                </div>

                {/* Description */}
                {post.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {post.description}
                  </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 dark:from-rose-900/30 dark:to-pink-900/30 dark:text-rose-400 hover:from-rose-200 hover:to-pink-200 dark:hover:from-rose-900/50 dark:hover:to-pink-900/50 transition-colors rounded-full px-4 py-2 text-sm font-semibold cursor-pointer"
                      >
                        <TagIcon size={14} className="mr-1" />
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-700 to-transparent" />

                {/* Engagement Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-full px-4 py-2 transition-all duration-200"
                    >
                      <Heart size={22} />
                      <span className="text-base font-semibold">0</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-full px-4 py-2 transition-all duration-200"
                    >
                      <MessageCircle size={22} />
                      <span className="text-base font-semibold">0</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-full px-4 py-2 transition-all duration-200"
                    >
                      <Eye size={22} />
                      <span className="text-base font-semibold">0</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isDownloadable && (
                      <Button
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <Download size={18} className="mr-2" />
                        Download
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-full"
                    >
                      <Share2 size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-full"
                    >
                      <Bookmark size={20} />
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-700 to-transparent" />

                {/* Author Info */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-2 ring-rose-200 dark:ring-rose-900/30 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900">
                      <AvatarImage src={post.user?.avatarImage || post.user?.image || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold text-lg">
                        {post.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${post.user?.id}`}>
                        <p className="font-bold text-gray-900 dark:text-gray-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">
                          {post.user?.name}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          : "—"}
                      </div>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-2 border-gray-200 dark:border-neutral-800 rounded-3xl shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <MessageCircle size={24} className="text-rose-500" />
                  Comments
                </h2>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Info Card */}
            <Card className="border-2 border-gray-200 dark:border-neutral-800 rounded-3xl shadow-lg sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Post Details
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Eye size={16} />
                      Type
                    </span>
                    <Badge className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 dark:from-rose-900/30 dark:to-pink-900/30 dark:text-rose-400 capitalize">
                      {post.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      {post.visibility === "public" ? <Globe size={16} /> : <Lock size={16} />}
                      Visibility
                    </span>
                    <Badge className={`${post.visibility === "public"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      } capitalize`}>
                      {post.visibility}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <DollarSign size={16} />
                      Access
                    </span>
                    <Badge className={`${post.accessType === "free"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      } capitalize`}>
                      {post.accessType === "free" ? "Free" : `$${post.price}`}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Download size={16} />
                      Download
                    </span>
                    <Badge className={`${post.isDownloadable
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                      {post.isDownloadable ? "Allowed" : "Not Allowed"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-700 to-transparent" />

                <Button className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Heart size={18} className="mr-2" />
                  Save to Board
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Posts Section */}
        {recommendedPosts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                More from {post.user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover similar content you might enjoy
              </p>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {recommendedPosts.map((recommendedPost) => (
                <PostCard
                  key={recommendedPost.id}
                  href={recommendedPost.id}
                  post={recommendedPost}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
