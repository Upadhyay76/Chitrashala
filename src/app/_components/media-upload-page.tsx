import {
  Upload,
  Image,
  Video,
  X,
  DollarSign,
  Lock,
  Globe,
  Download,
  MessageCircle,
  Heart,
  Tag as TagIcon,
  Eye,
  FileText,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface FormData {
  title: string;
  description: string;
  mediaFile: File | null;
  thumbnailFile: File | null;
  visibility: "public" | "private";
  accessType: "free" | "paid";
  price: string;
  isDownloadable: boolean;
  tags: string[];
}

interface MediaUploadPageProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  uploadType: "image" | "video";
  setUploadType: (type: "image" | "video") => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  previewUrl: string | null;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
  ) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  addTag: () => void;
  removeTag: (tagToRemove: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const MediaUploadPage: React.FC<MediaUploadPageProps> = ({
  formData,
  setFormData,
  uploadType,
  setUploadType,
  tagInput,
  setTagInput,
  previewUrl,
  handleFileChange,
  handleInputChange,
  addTag,
  removeTag,
  handleSubmit,
  onCancel,
}) => {
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 mb-10">
      {/* Upload Form */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-auto lg:border-r-2 border-rose-100 dark:border-neutral-800">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Create New Post
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share your creative work with the world</p>
            </div>
          </div>
        </div>

        {/* Upload Type Toggle */}
        <div className="flex gap-3 mb-8 p-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-md w-fit">
          <Button
            type="button"
            onClick={() => setUploadType("image")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${uploadType === "image"
              ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
              : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
              }`}
          >
            <Image size={20} />
            Image
            {uploadType === "image" && <Check size={16} />}
          </Button>
          <Button
            type="button"
            onClick={() => setUploadType("video")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${uploadType === "video"
              ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
              : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
              }`}
          >
            <Video size={20} />
            Video
            {uploadType === "video" && <Check size={16} />}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="mediaFile" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Upload size={18} className="text-rose-500" />
              {uploadType === "image" ? "Upload Image" : "Upload Video"}
              <Badge className="bg-rose-500 text-white ml-1">Required</Badge>
            </Label>
            <Input
              type="file"
              accept={uploadType === "image" ? "image/*" : "video/*"}
              onChange={(e) => handleFileChange(e, "mediaFile")}
              className="hidden"
              id="mediaFile"
            />
            <Label
              htmlFor="mediaFile"
              className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${formData.mediaFile
                ? "border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20"
                : "border-rose-300 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-neutral-800 dark:to-neutral-800 hover:border-rose-400 hover:bg-gradient-to-br hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30"
                } hover:shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                  {formData.mediaFile ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {formData.mediaFile ? formData.mediaFile.name : `Click to upload ${uploadType}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.mediaFile ? "Click to change file" : "or drag and drop"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-4">
                  Max size: 100MB • Supports {uploadType === "image" ? "JPG, PNG, GIF, WEBP" : "MP4, MOV, AVI, WEBM"}
                </p>
              </div>
            </Label>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText size={18} className="text-rose-500" />
              Title
              <Badge className="bg-rose-500 text-white ml-1">Required</Badge>
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your post an engaging title..."
              required
              className="h-12 rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageCircle size={18} className="text-rose-500" />
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell people about your post... What inspired you? What makes it special?"
              rows={5}
              className="resize-none rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>{formData.description.length}</span> characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TagIcon size={18} className="text-rose-500" />
              Tags
            </Label>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-800 rounded-xl border-2 border-rose-200 dark:border-neutral-700">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:from-rose-600 hover:to-pink-600 transition-all duration-200 cursor-pointer group"
                  >
                    #{tag}
                    <X
                      size={14}
                      onClick={() => removeTag(tag)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    />
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tags (e.g., nature, photography, sunset)..."
                className="flex-1 h-12 rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="button"
                onClick={addTag}
                className="h-12 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Eye size={18} className="text-rose-500" />
              Visibility
              <Badge className="bg-rose-500 text-white ml-1">Required</Badge>
            </Label>
            <RadioGroup
              name="visibility"
              value={formData.visibility}
              onValueChange={(value: "public" | "private") =>
                setFormData({ ...formData, visibility: value })
              }
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="r1"
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${formData.visibility === "public"
                  ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 shadow-lg"
                  : "border-gray-300 dark:border-neutral-700 hover:border-rose-300 dark:hover:border-rose-700"
                  }`}
              >
                <RadioGroupItem value="public" id="r1" className="sr-only" />
                <Globe size={32} className={`mb-3 ${formData.visibility === "public" ? "text-rose-500" : "text-gray-400"}`} />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Public</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Everyone can see this</span>
              </Label>

              <Label
                htmlFor="r2"
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${formData.visibility === "private"
                  ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 shadow-lg"
                  : "border-gray-300 dark:border-neutral-700 hover:border-rose-300 dark:hover:border-rose-700"
                  }`}
              >
                <RadioGroupItem value="private" id="r2" className="sr-only" />
                <Lock size={32} className={`mb-3 ${formData.visibility === "private" ? "text-rose-500" : "text-gray-400"}`} />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Private</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Only you can see this</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Access Type */}
          <div className="space-y-3">
            <Label htmlFor="accessType" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <DollarSign size={18} className="text-rose-500" />
              Access Type
              <Badge className="bg-rose-500 text-white ml-1">Required</Badge>
            </Label>
            <Select
              value={formData.accessType}
              onValueChange={(value: "free" | "paid") =>
                setFormData({ ...formData, accessType: value })
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-2 focus:border-rose-500 focus:ring-0 focus:ring-offset-0 text-base">
                <SelectValue placeholder="Select access type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="free" className="rounded-lg text-base">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Free Access</span>
                  </div>
                </SelectItem>
                <SelectItem value="paid" className="rounded-lg text-base">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-rose-500" />
                    <span>Paid Content</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price (if paid) */}
          {formData.accessType === "paid" && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-800 rounded-2xl border-2 border-rose-200 dark:border-neutral-700">
              <Label htmlFor="price" className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <DollarSign size={18} className="text-rose-500" />
                Price
                <Badge className="bg-rose-500 text-white ml-1">Required</Badge>
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="price"
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="5.99"
                  className="h-12 w-full pl-12 pr-16 rounded-xl border-2 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">USD</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Set a fair price for your content</p>
            </div>
          )}

          {/* Downloadable */}
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-200">
            <Checkbox
              id="isDownloadable"
              checked={formData.isDownloadable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isDownloadable: !!checked })
              }
              className="h-6 w-6 border-2 border-rose-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500 data-[state=checked]:border-rose-500 focus-visible:ring-rose-500"
            />
            <div className="flex-1">
              <label
                htmlFor="isDownloadable"
                className="text-base font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2"
              >
                <Download size={18} className="text-rose-500" />
                Allow downloads
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Let people download your content</p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-14 border-2 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 text-base"
            >
              <X size={20} className="mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base"
            >
              <Sparkles size={20} className="mr-2" />
              Publish Post
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-[450px] bg-gradient-to-br from-white via-rose-50/30 to-pink-50/50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-6 sm:p-8 overflow-y-auto border-l-2 border-rose-100 dark:border-neutral-800">
        <div className="sticky top-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Live Preview</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">See how your post will look</p>
            </div>
          </div>

          <Card className="rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:shadow-rose-200/50 dark:hover:shadow-rose-900/30 transition-all duration-300">
            {previewUrl ? (
              <div className="relative group">
                {uploadType === "image" ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="w-full h-auto object-cover"
                    controls
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                <div className="h-20 w-20 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-4">
                  {uploadType === "image" ? <Image className="w-10 h-10" /> : <Video className="w-10 h-10" />}
                </div>
                <p className="text-sm font-medium">No media selected</p>
                <p className="text-xs mt-1">Upload a file to see preview</p>
              </div>
            )}

            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {formData.title || "Untitled Post"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {formData.description || "No description provided yet. Add a description to help people understand your post."}
                </p>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-neutral-800">
                <div className="flex gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 px-0 hover:bg-transparent"
                  >
                    <Heart size={20} />
                    <span className="text-sm font-semibold">0</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 px-0 hover:bg-transparent"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-semibold">0</span>
                  </Button>
                </div>
                {formData.isDownloadable && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                    <Download size={14} />
                    Downloadable
                  </Badge>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-neutral-800">
                <Badge className={`${formData.visibility === "public"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  } flex items-center gap-1`}>
                  {formData.visibility === "public" ? <Globe size={14} /> : <Lock size={14} />}
                  {formData.visibility === "public" ? "Public" : "Private"}
                </Badge>

                <Badge className={`${formData.accessType === "free"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                  } flex items-center gap-1`}>
                  {formData.accessType === "paid" && <DollarSign size={14} />}
                  {formData.accessType === "free" ? "Free" : `$${formData.price || "0.00"}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
