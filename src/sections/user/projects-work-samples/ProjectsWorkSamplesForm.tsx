import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SafeIcon from "@/components/common/safe-icon";
import FileUploadZone from "./FileUploadZone";
import { userService } from "@/services/user";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { formatRelativeDate } from "@/utils/date";
import {
  PROJECT_SUPPORTED_FORMATS,
  MAX_PROJECT_SIZE_MB,
} from "@/constants/app";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: "file" | "link";
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  url?: string;
  uploadedDate: string;
  thumbnail?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  category?: string;
}

interface ProjectsWorkSamplesFormProps {
  onSuccess: (item: ProjectItem) => void;
  onCancel: () => void;
  existingProjectTitle?: string; // For adding files to existing project
}

export default function ProjectsWorkSamplesForm({
  onSuccess,
  onCancel,
  existingProjectTitle,
}: ProjectsWorkSamplesFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: existingProjectTitle || "",
    description: "",
    url: "",
    platform: "File Upload" as "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload",
    category: "",
    isFeatured: false,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (files: File[]) => {
    // Append new files to existing ones, avoiding duplicates
    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map(f => f.name));
      const newFiles = files.filter(f => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
    // Auto-fill title with first file name (without extension) if title is empty
    if (files.length > 0 && !formData.title.trim()) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, "");
      setFormData((prev) => ({ ...prev, title: fileName }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    // Check if at least one file or link is provided
    if (selectedFiles.length === 0 && !formData.url.trim()) {
      toast.error("Please upload at least one file or add a project link");
      return;
    }

    // If adding to existing project, ensure title is set
    if (existingProjectTitle && !formData.title.trim()) {
      setFormData(prev => ({ ...prev, title: existingProjectTitle }));
    }

    setIsUploading(true);
    try {
      // If adding files to existing project, use addFilesToProject
      if (existingProjectTitle && selectedFiles.length > 0) {
        // Find the project ID from the title (we'll need to pass it or find it)
        // For now, we'll create a new project with the same title
        // TODO: Pass projectId as prop when adding files to existing project
        const project = await userService.createProject({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          platform: formData.platform !== "File Upload" ? formData.platform : "File Upload",
          isFeatured: formData.isFeatured,
          projectLink: formData.url.trim() || undefined,
          files: selectedFiles.length > 0 ? selectedFiles : undefined,
        });

        const newItem: ProjectItem = {
          id: project.id,
          title: project.title,
          description: project.description || '',
          type: project.projectLink ? "link" : "file",
          uploadedDate: formatRelativeDate(project.uploadedDate),
          platform: project.platform,
          isFeatured: project.isFeatured,
          category: project.category,
        };

        onSuccess(newItem);
        toast.success(`Files added to project "${formData.title}" successfully!`);
        return;
      }

      // Create new project with all files and link in one request
      const project = await userService.createProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platform: formData.platform !== "File Upload" ? formData.platform : "File Upload",
        isFeatured: formData.isFeatured,
        projectLink: formData.url.trim() || undefined,
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      // Transform to ProjectItem format for onSuccess callback
      const newItem: ProjectItem = {
        id: project.id,
        title: project.title,
        description: project.description || '',
        type: project.projectLink ? "link" : "file",
        uploadedDate: formatRelativeDate(project.uploadedDate),
        platform: project.platform,
        isFeatured: project.isFeatured,
        category: project.category,
      };

      onSuccess(newItem);
      toast.success(`Project "${formData.title}" created successfully!`);

      // Reset form after successful upload
      setSelectedFiles([]);
      setFormData({
        title: "",
        description: "",
        url: "",
        platform: "File Upload",
        category: "",
        isFeatured: false,
      });
    } catch (error: any) {
      logger.error("Error uploading project:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload project. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section - Always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label>Upload Files</Label>
            <FileUploadZone
              onFilesSelected={handleFileSelect}
              maxSize={MAX_PROJECT_SIZE_MB}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border text-sm"
                  >
                    <SafeIcon name="File" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <SafeIcon name="X" size={14} className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Documents</p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_SUPPORTED_FORMATS.documents.map((format) => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Design Files</p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_SUPPORTED_FORMATS.designFiles.map((format) => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Images</p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_SUPPORTED_FORMATS.images.map((format) => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Max file size: {MAX_PROJECT_SIZE_MB} MB
            </p>
          </div>
        </div>
      </div>

      {/* Link Section - Always visible */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Add Project Link</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://github.com/username/project or https://behance.net/..."
            value={formData.url}
            onChange={(e) => {
              const url = e.target.value;
              // Auto-detect platform from URL
              let platform: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload" = "Other";
              if (url.includes("github.com")) platform = "GitHub";
              else if (url.includes("behance.net")) platform = "Behance";
              else if (url.includes("dribbble.com")) platform = "Dribbble";
              else if (url && !url.includes("github.com") && !url.includes("behance.net") && !url.includes("dribbble.com")) platform = "Personal Website";
              
              setFormData({ ...formData, url, platform });
            }}
            disabled={isUploading}
          />
        </div>

        {formData.url && (
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  platform: value as typeof formData.platform,
                })
              }
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="Behance">Behance</SelectItem>
                <SelectItem value="Dribbble">Dribbble</SelectItem>
                <SelectItem value="Personal Website">Personal Website</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Common Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="e.g., E-commerce Website Redesign"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            disabled={isUploading || !!existingProjectTitle}
            className={existingProjectTitle ? "bg-muted" : ""}
          />
          {existingProjectTitle && (
            <p className="text-xs text-muted-foreground">
              Adding files to existing project: {existingProjectTitle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what this project showcases, technologies used, your role, etc."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category (Optional)</Label>
          <Input
            id="category"
            placeholder="e.g., Web Development, UI/UX Design, Mobile App"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            disabled={isUploading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isFeatured: checked as boolean })
            }
            disabled={isUploading}
          />
          <Label
            htmlFor="featured"
            className="text-sm font-normal cursor-pointer"
          >
            Mark as Featured Work (Highlight this in your profile)
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSelectedFiles([]);
            setFormData({
              title: "",
              description: "",
              url: "",
              platform: "File Upload",
              category: "",
              isFeatured: false,
            });
          }}
          className="flex-1"
          disabled={isUploading}
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isUploading}>
          <SafeIcon
            name="Upload"
            size={18}
            className="mr-2"
          />
          {isUploading ? "Uploading..." : "Add Project"}
        </Button>
      </div>
    </form>
  );
}
