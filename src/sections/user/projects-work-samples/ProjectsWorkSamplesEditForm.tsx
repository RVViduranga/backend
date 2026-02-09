import { useState, useEffect } from "react";
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
import {
  PROJECT_SUPPORTED_FORMATS,
  MAX_PROJECT_SIZE_MB,
} from "@/constants/app";

interface ProjectFile {
  id: string;
  fileName: string;
  fileType?: string;
  url: string;
  thumbnail?: string;
  uploadedDate: string;
}

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  projectLink?: string;
  files: ProjectFile[];
}

interface ProjectsWorkSamplesEditFormProps {
  project: ProjectData;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectsWorkSamplesEditForm({
  project,
  onSuccess,
  onCancel,
}: ProjectsWorkSamplesEditFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
    url: project.projectLink || "",
    platform: project.platform || "File Upload",
    category: project.category || "",
    isFeatured: project.isFeatured || false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setFormData({
      title: project.title,
      description: project.description || "",
      url: project.projectLink || "",
      platform: project.platform || "File Upload",
      category: project.category || "",
      isFeatured: project.isFeatured || false,
    });
    setSelectedFiles([]);
  }, [project]);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map(f => f.name));
      const newFiles = files.filter(f => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = async (fileId: string) => {
    try {
      await userService.deleteFileFromProject(project.id, fileId);
      toast.success("File deleted successfully");
      onSuccess(); // Reload projects
    } catch (error: any) {
      logger.error("Error deleting file:", error);
      toast.error(error?.response?.data?.message || "Failed to delete file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    setIsUpdating(true);
    try {
      // First, update project metadata
      await userService.updateProject(project.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platform: formData.platform !== "File Upload" ? formData.platform : "File Upload",
        isFeatured: formData.isFeatured,
        projectLink: formData.url.trim() || undefined,
      });

      // Then, add new files if any
      if (selectedFiles.length > 0) {
        await userService.addFilesToProject(project.id, selectedFiles);
      }

      toast.success(`Project "${formData.title}" updated successfully`);
      onSuccess();
    } catch (error: any) {
      logger.error("Error updating project:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update project. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Common Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Project Title *</Label>
          <Input
            id="edit-title"
            placeholder="e.g., E-commerce Website Redesign"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            placeholder="Describe what this project showcases, technologies used, your role, etc."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Input
            id="edit-category"
            placeholder="e.g., Web Development, UI/UX Design, Mobile App"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-url">Project Link</Label>
          <Input
            id="edit-url"
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
            disabled={isUpdating}
          />
        </div>

        {formData.url && (
          <div className="space-y-2">
            <Label htmlFor="edit-platform">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  platform: value as typeof formData.platform,
                })
              }
              disabled={isUpdating}
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
                <SelectItem value="File Upload">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="edit-featured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isFeatured: checked as boolean })
            }
            disabled={isUpdating}
          />
          <Label
            htmlFor="edit-featured"
            className="text-sm font-normal cursor-pointer"
          >
            Mark as Featured Work (Highlight this in your profile)
          </Label>
        </div>
      </div>

      {/* Existing Files Section */}
      {project.files && project.files.length > 0 && (
        <div className="space-y-3">
          <Label>Existing Files ({project.files.length})</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {project.files.map((file) => (
              <div
                key={file.id}
                className="relative group border rounded-lg overflow-hidden bg-muted/50"
              >
                {(file.thumbnail || (file.fileType === "Project Image" || file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) ? (
                  <div className="aspect-square relative">
                    <img
                      src={file.thumbnail || file.url}
                      alt={file.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveExistingFile(file.id)}
                        disabled={isUpdating}
                      >
                        <SafeIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center p-2">
                    <SafeIcon name="File" size={24} className="text-muted-foreground mb-1" />
                    <p className="text-xs text-center text-muted-foreground truncate w-full px-1">
                      {file.fileName}
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 mt-1"
                      onClick={() => handleRemoveExistingFile(file.id)}
                      disabled={isUpdating}
                    >
                      <SafeIcon name="Trash2" size={12} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Files Section */}
      <div className="space-y-4">
        <Label>Add More Files</Label>
        <FileUploadZone
          onFilesSelected={handleFileSelect}
          maxSize={MAX_PROJECT_SIZE_MB}
        />

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>New Files to Upload ({selectedFiles.length})</Label>
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
                    disabled={isUpdating}
                  >
                    <SafeIcon name="X" size={14} className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isUpdating}>
          <SafeIcon name="Save" size={18} className="mr-2" />
          {isUpdating ? "Updating..." : "Update Project"}
        </Button>
      </div>
    </form>
  );
}
