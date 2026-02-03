import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import SafeIcon from "@/components/common/safe-icon";
import PhotoRequirements from "./PhotoRequirements";
import ImagePreview from "./ImagePreview";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/app";

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export default function ProfilePhotoUploadForm() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  });
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
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

  // Simulate upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState({ status: "uploading", progress: 0 });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      setUploadState({ status: "uploading", progress: Math.floor(progress) });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadState({ status: "success", progress: 100 });
    }, 2000);
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

  // Handle continue
  const handleContinue = () => {
    if (uploadState.status === "success") {
      navigate("/profile-media-management");
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Photo</CardTitle>
          <CardDescription>
            Choose a clear, professional photo that shows your face clearly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {uploadState.status === "error" && (
            <Alert variant="destructive">
              <SafeIcon name="AlertCircle" size={16} />
              <AlertDescription>{uploadState.error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {uploadState.status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <SafeIcon
                name="CheckCircle2"
                size={16}
                className="text-green-600"
              />
              <AlertDescription className="text-green-800">
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
                  <p className="font-semibold mb-1">
                    Drag and drop your photo here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
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
                    <span className="font-semibold">
                      {uploadState.progress}%
                    </span>
                  </div>
                  <Progress value={uploadState.progress} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {uploadState.status !== "uploading" &&
                  uploadState.status !== "success" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleRemoveFile}
                        className="flex-1"
                      >
                        <SafeIcon name="X" size={16} className="mr-2" />
                        Remove
                      </Button>
                      <Button onClick={handleUpload} className="flex-1">
                        <SafeIcon name="Upload" size={16} className="mr-2" />
                        Upload Photo
                      </Button>
                    </>
                  )}
                {uploadState.status === "success" && (
                  <Button onClick={handleContinue} className="w-full">
                    <SafeIcon name="Check" size={16} className="mr-2" />
                    Continue
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements Card */}
      <PhotoRequirements />

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link to="/profile-media-management">
            <SafeIcon name="ChevronLeft" size={16} className="mr-2" />
            Back
          </Link>
        </Button>
        {uploadState.status === "success" && (
          <Button onClick={handleContinue} className="flex-1">
            Continue
            <SafeIcon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
