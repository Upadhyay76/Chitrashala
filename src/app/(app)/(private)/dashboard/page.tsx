"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  X,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Heart,
  MessageSquare,
  MoreVertical,
  Save,
  XCircle,
  Tag as TagIcon
} from "lucide-react";

export default function DashboardPage() {
  const utils = api.useUtils();
  const { data, isLoading } = api.post.getUserPosts.useQuery();
  const editMutation = api.post.editPost.useMutation({
    onSuccess: () => utils.post.getUserPosts.invalidate(),
  });

  const [editId, setEditId] = useState<string | null>(null);
  type Visibility = "public" | "private";

  const [form, setForm] = useState<{
    title: string;
    description: string;
    visibility: Visibility;
    tags: string[];
    newTag: string;
  }>({
    title: "",
    description: "",
    visibility: "public",
    tags: [],
    newTag: "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (!data?.posts?.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full mx-4 border-2 border-dashed border-gray-300 dark:border-neutral-700">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-10 h-10 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Start creating your first post to see it here!</p>
            </div>
            <Button className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              Create Post
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      visibility: p.visibility,
      tags: [...(p.tags ?? [])], // clone array
      newTag: "",
    });
  };

  const handleAddTag = () => {
    if (form.newTag.trim() && !form.tags.includes(form.newTag.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, form.newTag.trim()],
        newTag: "",
      });
    }
  };

  // const handleRemoveTag = (tag: string) => {
  //   setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  // };

  const handleRemoveTag = (tag: string) => {
    console.log(tag, "_______________________________-")
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async () => {
    if (!editId) return;
    await editMutation.mutateAsync({
      id: editId,
      title: form.title,
      description: form.description,
      visibility: form.visibility,
      tags: form.tags,
    });
    setEditId(null);
  };

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Your Posts
          </h1>
          <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
            {data.posts.length} {data.posts.length === 1 ? 'Post' : 'Posts'}
          </Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Manage and edit your creative content</p>
      </div>

      {/* Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map((p) => (
          <Card
            key={p.id}
            className="group overflow-hidden border-2 border-gray-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-3xl bg-white dark:bg-neutral-900"
          >
            {editId === p.id ? (
              <CardContent className="space-y-5 p-6">
                {/* Edit Mode Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Edit Post</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Update your content</p>
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Edit2 size={14} />
                    Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter post title..."
                    className="rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your post..."
                    className="rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                  />
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <TagIcon size={14} />
                    Tags
                  </label>

                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                      {form.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center gap-1.5 px-3 py-1.5 hover:from-rose-600 hover:to-pink-600 transition-all duration-200"
                        >
                          <span className="select-none pointer-events-none">#{tag}</span>

                          <X
                            size={14}
                            className="cursor-pointer hover:scale-125 transition-transform ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={form.newTag}
                      onChange={(e) => setForm({ ...form, newTag: e.target.value })}
                      placeholder="Add a tag..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl px-4 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                </div>

                {/* Visibility Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {form.visibility === "public" ? <Eye size={14} /> : <EyeOff size={14} />}
                    Visibility
                  </label>
                  <Select
                    value={form.visibility}
                    onValueChange={(v: "public" | "private") =>
                      setForm({ ...form, visibility: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-2 focus:border-rose-500 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="public" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <Eye size={16} className="text-green-500" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <EyeOff size={16} className="text-gray-500" />
                          <span>Private</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditId(null)}
                    className="rounded-xl border-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <XCircle size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                {/* Media Section */}
                <div className="relative overflow-hidden">
                  {p.type === "image" ? (
                    <img
                      src={p.mediaUrl}
                      alt={p.title}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={p.mediaUrl}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                      controls
                    />
                  )}

                  {/* Visibility Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${p.visibility === "public"
                      ? "bg-green-500/90 hover:bg-green-600"
                      : "bg-gray-500/90 hover:bg-gray-600"
                      } text-white backdrop-blur-sm shadow-lg flex items-center gap-1.5 px-3 py-1.5`}>
                      {p.visibility === "public" ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.visibility === "public" ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {p.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {p.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {p.description}
                    </p>
                  )}

                  {/* Tags */}
                  {p.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors rounded-full px-3 py-1"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {p.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400 rounded-full px-3 py-1"
                        >
                          +{p.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-700 to-transparent" />

                  {/* Stats Section (Optional - you can add real data later) */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        0
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        0
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={() => handleEdit(p)}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit Post
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
