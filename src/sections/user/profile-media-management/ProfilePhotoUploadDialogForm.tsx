import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import SafeIcon from "@/components/common/safe-icon";
import ImagePreview from "../profile-photo-upload/ImagePreview";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/app";
import userService from "@/services/user";
import { useUser } from "@/hooks/use-user-context";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface ProfilePhotoUploadDialogFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  setAsPrimary?: boolean; // Optional: whether to set uploaded photo as primary (default: false)
}

export default function ProfilePhotoUploadDialogForm({
  onSuccess,
  onCancel,
  setAsPrimary = false, // Default to false - don't auto-set as primary
}: ProfilePhotoUploadDialogFormProps) {
  const { refreshProfile } = useUser();
  const { isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;

    if (
      !ALLOWED_IMAGE_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
      )
    ) {
      return "Please upload a JPG, PNG, or WebP image";
    }

    if (file.size > maxSize) {
      return `File size must be less than ${MAX_IMAGE_SIZE_MB}MB`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadState({ status: "error", progress: 0, error });
      return;
    }

    setSelectedFile(file);
    setUploadState({ status: "idle", progress: 0 });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Upload avatar to backend
  const handleUpload = async () => {
    if (!selectedFile) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      setUploadState({
        status: "error",
        progress: 0,
        error:
          "You must be logged in to upload a profile photo. Please log in and try again.",
      });
      toast.error("You must be logged in to upload a profile photo.");
      return;
    }

    setUploadState({ status: "uploading", progress: 0 });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, progress: prev.progress + Math.random() * 30 };
      });
    }, 200);

    try {
      // Use the setAsPrimary prop if provided, otherwise check if it's the first photo
      let shouldSetAsPrimary = setAsPrimary;
      
      // If setAsPrimary prop is not explicitly set, check if it's the first photo
      if (!setAsPrimary) {
        try {
          const existingPhotos = await userService.getProfilePhotos();
          // Only set as primary if no photos exist (first photo)
          shouldSetAsPrimary = existingPhotos.length === 0;
        } catch (error) {
          // If we can't check, don't set as primary
          shouldSetAsPrimary = false;
        }
      }
      
      // Upload file to backend as profile photo (to mediaFiles array)
      const result = await userService.uploadProfilePhoto(selectedFile, shouldSetAsPrimary);

      clearInterval(progressInterval);
      setUploadState({ status: "success", progress: 100 });

      // Refresh profile to get updated mediaFiles and avatarUrl
      await refreshProfile();
      
      // Force a small delay to ensure backend has saved everything
      await new Promise(resolve => setTimeout(resolve, 300));

      toast.success("Profile photo uploaded successfully!");
      onSuccess();
    } catch (error: any) {
      clearInterval(progressInterval);
      logger.error("Error uploading avatar:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload photo. Please try again.";
      setUploadState({
        status: "error",
        progress: 0,
        error: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  // Handle remove file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadState({ status: "idle", progress: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {uploadState.status === "error" && (
        <Alert variant="destructive" className="py-2">
          <SafeIcon name="AlertCircle" size={16} />
          <AlertDescription className="text-sm">{uploadState.error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {uploadState.status === "success" && (
        <Alert className="border-green-200 bg-green-50 py-2">
          <SafeIcon name="CheckCircle2" size={16} className="text-green-600" />
          <AlertDescription className="text-sm text-green-800">
            Profile photo uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* File Input Area */}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <SafeIcon
                name="Upload"
                size={32}
                className="text-muted-foreground"
              />
            </div>
            <div>
              <p className="font-semibold mb-1">Drag and drop your photo here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP • Max 5MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <ImagePreview
            preview={preview}
            fileName={selectedFile?.name || "photo.jpg"}
            onRemove={handleRemoveFile}
          />

          {/* Upload Progress */}
          {uploadState.status === "uploading" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-semibold">{uploadState.progress}%</span>
              </div>
              <Progress value={uploadState.progress} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {uploadState.status !== "uploading" &&
              uploadState.status !== "success" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveFile}
                    className="flex-1"
                    size="sm"
                  >
                    <SafeIcon name="X" size={16} className="mr-2" />
                    Remove
                  </Button>
                  <Button onClick={handleUpload} className="flex-1" size="sm">
                    <SafeIcon name="Upload" size={16} className="mr-2" />
                    Upload Photo
                  </Button>
                </>
              )}
            {uploadState.status === "success" && (
              <Button onClick={onSuccess} className="w-full" size="sm">
                <SafeIcon name="Check" size={16} className="mr-2" />
                Done
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {uploadState.status !== "success" && (
        <div className="flex gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={uploadState.status === "uploading"}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
