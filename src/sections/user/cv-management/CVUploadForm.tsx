import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import SafeIcon from "@/components/common/safe-icon";
import type { UserCV } from "@/services/user";
import {
  ALLOWED_CV_MIME_TYPES,
  MAX_CV_SIZE_MB,
} from "@/constants/app";

interface CVUploadFormProps {
  onSuccess: (cv: UserCV) => void;
  onCancel: () => void;
}

export default function CVUploadForm({
  onSuccess,
  onCancel,
}: CVUploadFormProps) {
  const [cvName, setCVName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_CV_MIME_TYPES.includes(file.type as typeof ALLOWED_CV_MIME_TYPES[number])) {
        setError("Please upload a PDF or Word document");
        return;
      }

      // Validate file size
      const maxSizeBytes = MAX_CV_SIZE_MB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError(`File size must be less than ${MAX_CV_SIZE_MB}MB`);
        return;
      }

      setSelectedFile(file);
      setError("");

      // Auto-fill CV name if empty
      if (!cvName) {
        setCVName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvName.trim()) {
      setError("Please enter a CV name");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create mock CV object
      const newCV: UserCV = {
        id: Date.now().toString(),
        name: cvName,
        fileName: selectedFile.name,
        uploadedDate: new Date().toISOString().split("T")[0],
        fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        isPrimary: false,
        format: selectedFile.name.split(".").pop()?.toUpperCase() || "PDF",
        downloadUrl: URL.createObjectURL(selectedFile),
      };

      onSuccess(newCV);

      // Reset form
      setCVName("");
      setSelectedFile(null);
      setDescription("");
      setUploadProgress(0);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CV Name */}
      <div className="space-y-2">
        <Label htmlFor="cv-name">CV Name *</Label>
        <Input
          id="cv-name"
          placeholder="e.g., Senior Developer Resume"
          value={cvName}
          onChange={(e) => setCVName(e.target.value)}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          Give your CV a descriptive name to easily identify it later
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="cv-file">Upload CV File *</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            id="cv-file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="cv-file" className="cursor-pointer block">
            {selectedFile ? (
              <div className="space-y-2">
                <SafeIcon
                  name="CheckCircle"
                  size={32}
                  className="mx-auto text-green-600"
                />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <SafeIcon
                  name="Upload"
                  size={32}
                  className="mx-auto text-muted-foreground"
                />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, or DOCX (Max 5MB)
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="cv-description">Description (Optional)</Label>
        <Textarea
          id="cv-description"
          placeholder="e.g., Tailored for senior developer positions with focus on backend technologies"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
          rows={3}
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Uploading...</p>
            <p className="text-sm text-muted-foreground">
              {Math.round(uploadProgress)}%
            </p>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <SafeIcon
            name="AlertCircle"
            size={18}
            className="text-destructive mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isUploading || !selectedFile || !cvName.trim()}
        >
          {isUploading ? (
            <>
              <SafeIcon
                name="Loader2"
                size={16}
                className="mr-2 animate-spin"
              />
              Uploading...
            </>
          ) : (
            <>
              <SafeIcon name="Upload" size={16} className="mr-2" />
              Upload CV
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
