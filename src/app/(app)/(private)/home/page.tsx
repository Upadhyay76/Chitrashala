import { api } from "~/trpc/server";
import PostCard from "./_home-feed";

export default async function FeedPage() {
  const { posts } = await api.post.getPosts();

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black p-6 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard href={post.id} key={post.id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </main>
  );
}
