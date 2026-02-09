import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SafeIcon from "@/components/common/safe-icon";
import UploadProgressIndicator from "./UploadProgressIndicator";
import {
  ALLOWED_CV_FORMATS,
  ALLOWED_CV_MIME_TYPES,
  MAX_CV_SIZE_MB,
} from "@/constants/app";
import { userService } from "@/services/user";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

// Convert format array to uppercase for display
const SUPPORTED_FORMATS = ALLOWED_CV_FORMATS.map((f) => f.toUpperCase());

export default function CVUploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!ALLOWED_CV_MIME_TYPES.includes(file.type as typeof ALLOWED_CV_MIME_TYPES[number])) {
      return {
        valid: false,
        error: `Invalid file format. Supported formats: ${SUPPORTED_FORMATS.join(
          ", "
        )}`,
      };
    }

    // Check file size
    const maxSizeBytes = MAX_CV_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${MAX_CV_SIZE_MB}MB limit. Your file is ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`,
      };
    }

    return { valid: true };
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      // Call the service to upload CV
      const cvName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension for name
      const newCV = await userService.uploadCV(file, cvName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add file to uploaded files list
      const newFile: UploadedFile = {
        id: newCV.id,
        name: newCV.fileName,
        size: file.size,
        uploadedAt: "just now",
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setSuccess(`${file.name} uploaded successfully!`);
      toast.success("CV uploaded successfully!");
      setIsUploading(false);
      setUploadProgress(0);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      logger.error("Error uploading CV:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload CV. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New CV</CardTitle>
          <CardDescription>
            Drag and drop your resume here or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInputChange}
              disabled={isUploading}
              className="hidden"
              aria-label="Upload CV file"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full focus:outline-none"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <SafeIcon name="Upload" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isUploading ? "Uploading..." : "Drop your CV here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select from your computer
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Upload Progress */}
          {isUploading && <UploadProgressIndicator progress={uploadProgress} />}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <SafeIcon name="AlertCircle" size={16} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <SafeIcon
                name="CheckCircle2"
                size={16}
                className="text-green-600"
              />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* File Requirements */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm">File Requirements:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" size={14} className="text-green-600" />
                Supported formats: {SUPPORTED_FORMATS.join(", ")}
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" size={14} className="text-green-600" />
                Maximum file size: 5MB
              </li>
              <li className="flex items-center gap-2">
                <SafeIcon name="Check" size={14} className="text-green-600" />
                Clear, readable text recommended
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Your CVs ({uploadedFiles.length})
            </CardTitle>
            <CardDescription>
              Manage your uploaded resumes. You can use any of these for job
              applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <SafeIcon
                        name="FileText"
                        size={20}
                        className="text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • Uploaded {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/cv-view">View</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <SafeIcon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between">
        <Button variant="outline" asChild>
          <Link to="/cv-management">Back to CV Management</Link>
        </Button>
        <Button asChild>
          <Link to="/user-profile-management">Continue to Profile</Link>
        </Button>
      </div>
    </div>
  );
}
