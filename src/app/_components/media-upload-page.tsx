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
import { Card, CardContent } from "~/components/ui/card"; // For preview

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
		<div className="flex flex-col lg:flex-row h-full ">
			{/* Upload Form */}
			<div className="flex-1 py-10 sm:p-6 overflow-auto lg:border-r border-rose-200 ">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6">
					Create New Post
				</h2>

				{/* Upload Type Toggle */}
				<div className="flex gap-4 mb-6">
					<Button
						onClick={() => setUploadType("image")}
						className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${
							uploadType === "image"
								? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
								: "bg-white text-gray-700 border-2 border-rose-200 hover:border-rose-300 hover:bg-rose-50"
						}`}
					>
						<Image size={20} />
						Image
					</Button>
					<Button
						onClick={() => setUploadType("video")}
						className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${
							uploadType === "video"
								? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
								: "bg-white text-gray-700 border-2 border-rose-200 hover:border-rose-300 hover:bg-rose-50"
						}`}
					>
						<Video size={20} />
						Video
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* File Upload */}
					<div>
						<Label htmlFor="mediaFile" className="mb-2">
							{uploadType === "image" ? "Upload Image" : "Upload Video"} *
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
							className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-rose-300 rounded-xl cursor-pointer bg-rose-50 hover:bg-rose-100 transition-colors"
						>
							<Upload className="w-12 h-12 text-rose-400 mb-2" />
							<p className="text-sm text-gray-600">
								Click to upload {uploadType}
							</p>
							<p className="text-xs text-gray-400 mt-1">Max size: 100MB</p>
						</Label>
					</div>

					{/* Title */}
					<div>
						<Label htmlFor="title" className="mb-2">
							Title *
						</Label>
						<Input
							id="title"
							type="text"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="Give your post a title"
							required
							className="focus-visible:ring-rose-500"
						/>
					</div>

					{/* Description */}
					<div>
						<Label htmlFor="description" className="mb-2">
							Description
						</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Tell people about your post..."
							rows={4}
							className="resize-none focus-visible:ring-rose-500"
						/>
					</div>

					{/* Tags */}
					<div>
						<Label className="mb-2">Tags</Label>
						<div className="flex gap-2 mb-2">
							<Input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && (e.preventDefault(), addTag())
								}
								placeholder="Add tags..."
								className="flex-1 focus-visible:ring-rose-500"
							/>
							<Button
								type="button"
								onClick={addTag}
								className="bg-rose-500 hover:bg-rose-600"
							>
								Add
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{formData.tags.map((tag, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
								>
									{tag}
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeTag(tag)}
										className="h-auto p-0 hover:bg-transparent hover:text-rose-900"
									>
										<X size={14} />
									</Button>
								</span>
							))}
						</div>
					</div>

					{/* Visibility */}
					<div>
						<Label className="mb-2">Visibility *</Label>
						<RadioGroup
							name="visibility"
							value={formData.visibility}
							onValueChange={(value: "public" | "private") =>
								setFormData({ ...formData, visibility: value })
							}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="public" id="r1" />
								<Label htmlFor="r1" className="flex items-center gap-2">
									<Globe size={18} className="text-gray-600" />
									Public
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="private" id="r2" />
								<Label htmlFor="r2" className="flex items-center gap-2">
									<Lock size={18} className="text-gray-600" />
									Private
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Access Type */}
					<div>
						<Label htmlFor="accessType" className="mb-2">
							Access Type *
						</Label>
						<Select
							value={formData.accessType}
							onValueChange={(value: "free" | "paid") =>
								setFormData({ ...formData, accessType: value })
							}
						>
							<SelectTrigger className="w-full focus:ring-rose-500">
								<SelectValue placeholder="Select access type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="free">Free</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Price (if paid) */}
					{formData.accessType === "paid" && (
						<div>
							<Label htmlFor="price" className="mb-2">
								Price *
							</Label>
							<div className="relative">
								<DollarSign
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<Input
									id="price"
									type="text"
									name="price"
									value={formData.price}
									onChange={handleInputChange}
									placeholder="5.99 USD"
									className="w-full pl-10 pr-4 py-2 focus-visible:ring-rose-500"
								/>
							</div>
						</div>
					)}

					{/* Downloadable */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="isDownloadable"
							checked={formData.isDownloadable}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, isDownloadable: !!checked })
							}
							className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white focus-visible:ring-rose-500"
						/>
						<label
							htmlFor="isDownloadable"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
						>
							Allow downloads
						</label>
					</div>

					{/* Submit Button */}
					<div className="flex gap-4 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="flex-1 px-6 py-3 border-2 border-rose-300 text-gray-700 rounded-full font-semibold hover:bg-rose-50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="flex-1 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
						>
							Publish
						</Button>
					</div>
				</form>
			</div>

			{/* Preview Panel */}
			<div className="w-full lg:w-96 bg-gradient-to-br from-rose-50 to-pink-50 p-4 sm:p-6 overflow-y-auto">
				<h3 className="text-xl font-bold text-gray-900 mb-4">Preview</h3>
				<Card className="rounded-2xl overflow-hidden shadow-lg border-none">
					{previewUrl ? (
						<div className="relative">
							{uploadType === "image" ? (
								<img
									src={previewUrl}
									alt="Preview"
									className="w-full h-auto object-cover"
								/>
							) : (
								<video
									src={previewUrl}
									className="w-full h-auto object-cover"
									controls
								/>
							)}
						</div>
					) : (
						<div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
							No media selected
						</div>
					)}
					<CardContent className="p-4">
						<h4 className="font-bold text-gray-900 mb-2">
							{formData.title || "Untitled Post"}
						</h4>
						<p className="text-sm text-gray-600 mb-3">
							{formData.description || "No description"}
						</p>
						{formData.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-3">
								{formData.tags.map((tag, idx) => (
									<span
										key={idx}
										className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full"
									>
										#{tag}
									</span>
								))}
							</div>
						)}
						<div className="flex items-center justify-between pt-3 border-t border-gray-200">
							<div className="flex gap-4">
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-1 text-gray-600 hover:text-rose-500 px-0"
								>
									<Heart size={18} />
									<span className="text-sm">0</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-1 text-gray-600 hover:text-rose-500 px-0"
								>
									<MessageCircle size={18} />
									<span className="text-sm">0</span>
								</Button>
							</div>
							{formData.isDownloadable && (
								<Download size={18} className="text-gray-400" />
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
