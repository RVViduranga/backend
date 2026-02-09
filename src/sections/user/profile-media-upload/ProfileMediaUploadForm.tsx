import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafeIcon from "@/components/common/safe-icon";
import FileUploadArea from "./FileUploadArea";
import UploadProgressItem from "./UploadProgressItem";
import UploadSummary from "./UploadSummary";

interface UploadedFile {
  id: string;
  name: string;
  type: "cv" | "cover_letter";
  size: number;
  uploadedAt: string;
  status: "completed" | "uploading" | "error";
  progress?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  type: "cv" | "cover_letter";
  progress: number;
  status: "uploading" | "completed" | "error";
}

export default function ProfileMediaUploadForm() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "John_Doe_Resume.pdf",
      type: "cv",
      size: 245000,
      uploadedAt: "2 days ago",
      status: "completed",
    },
    {
      id: "2",
      name: "Cover_Letter_Tech.pdf",
      type: "cover_letter",
      size: 125000,
      uploadedAt: "1 day ago",
      status: "completed",
    },
  ]);

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [activeTab, setActiveTab] = useState("cv");
  const [successMessage, setSuccessMessage] = useState("");

  // Simulate file upload progress
  useEffect(() => {
    if (uploadingFiles.length === 0) return;

    const interval = setInterval(() => {
      setUploadingFiles((prev) =>
        prev.map((file) => {
          if (file.status === "uploading") {
            const newProgress = Math.min(
              file.progress + Math.random() * 30,
              100
            );
            if (newProgress >= 100) {
              // Move to completed
              setTimeout(() => {
                setUploadedFiles((prevFiles) => [
                  ...prevFiles,
                  {
                    id: file.id,
                    name: file.name,
                    type: file.type,
                    size: Math.floor(Math.random() * 500000) + 50000,
                    uploadedAt: "just now",
                    status: "completed",
                  },
                ]);
                setSuccessMessage(`${file.name} uploaded successfully!`);
                setTimeout(() => setSuccessMessage(""), 3000);
              }, 500);
              return { ...file, progress: 100, status: "completed" };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [uploadingFiles]);

  const handleFileUpload = (
    files: File[],
    type: "cv" | "cover_letter"
  ) => {
    const newUploadingFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleRetryUpload = (fileId: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, progress: 0, status: "uploading" as const }
          : f
      )
    );
  };

  const cvFiles = uploadedFiles.filter((f) => f.type === "cv");
  const coverLetterFiles = uploadedFiles.filter(
    (f) => f.type === "cover_letter"
  );

  const totalProgress =
    uploadingFiles.length > 0
      ? Math.round(
          uploadingFiles.reduce((sum, f) => sum + f.progress, 0) /
            uploadingFiles.length
        )
      : 0;

  const allFilesUploaded = uploadingFiles.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Your Documents</h1>
        <p className="text-muted-foreground text-base">
          Add your CV and cover letter to strengthen your application
        </p>
      </div>

      {/* Progress Indicator - Only show when uploading */}
      {uploadingFiles.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100">
                <SafeIcon name="Upload" size={18} className="text-blue-600" />
              </div>
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                <span className="text-lg font-bold text-blue-600">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-2.5" />
              <p className="text-xs text-muted-foreground">
                Uploading {uploadingFiles.length} file{uploadingFiles.length > 1 ? 's' : ''}...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <SafeIcon name="CheckCircle" size={18} className="text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="cv" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <SafeIcon name="FileText" size={16} />
            <span className="hidden sm:inline">CV/Resume</span>
            <span className="sm:hidden">CV</span>
            {cvFiles.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                {cvFiles.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cover_letter" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <SafeIcon name="Mail" size={16} />
            <span className="hidden sm:inline">Cover Letter</span>
            <span className="sm:hidden">Letter</span>
            {coverLetterFiles.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                {coverLetterFiles.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* CV Tab */}
        <TabsContent value="cv" className="space-y-6">
          <FileUploadArea
            type="cv"
            title="Upload Your CV/Resume"
            description="Upload your resume in PDF, DOC, or DOCX format (Max 5MB)"
            acceptedFormats=".pdf,.doc,.docx"
            onFileUpload={(files) => handleFileUpload(files, "cv")}
          />
          {cvFiles.length > 0 && (
            <UploadSummary
              files={cvFiles}
              onRemove={handleRemoveFile}
              title="Your CVs"
            />
          )}
        </TabsContent>

        {/* Cover Letter Tab */}
        <TabsContent value="cover_letter" className="space-y-6">
          <FileUploadArea
            type="cover_letter"
            title="Upload Your Cover Letter"
            description="Upload your cover letter in PDF, DOC, or DOCX format (Max 3MB)"
            acceptedFormats=".pdf,.doc,.docx"
            onFileUpload={(files) => handleFileUpload(files, "cover_letter")}
          />
          {coverLetterFiles.length > 0 && (
            <UploadSummary
              files={coverLetterFiles}
              onRemove={handleRemoveFile}
              title="Your Cover Letters"
            />
          )}
        </TabsContent>

      </Tabs>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100">
                <SafeIcon name="Clock" size={16} className="text-blue-600" />
              </div>
              Currently Uploading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadingFiles.map((file) => (
              <UploadProgressItem
                key={file.id}
                file={file}
                onRetry={() => handleRetryUpload(file.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-4 border-t">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/user-profile-setup">
            <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Profile Setup
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/profile-media-management">
              <SafeIcon name="Settings" size={16} className="mr-2" />
              View Media
            </Link>
          </Button>

          <Button
            disabled={
              !allFilesUploaded ||
              (uploadedFiles.length === 0 && uploadingFiles.length === 0)
            }
            asChild
            className="w-full sm:w-auto"
          >
            <Link to="/user-dashboard">
              <SafeIcon name="CheckCircle" size={16} className="mr-2" />
              Continue to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100">
              <SafeIcon name="Lightbulb" size={16} className="text-amber-600" />
            </div>
            Tips for Better Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2.5">
            <li className="flex items-start gap-2">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Use a professional CV format with clear sections and consistent formatting</span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Customize your cover letter for each job application to highlight relevant experience</span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Add your projects and work samples separately in the Projects section</span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon name="CheckCircle2" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Keep file sizes under the maximum limits for faster uploads and better compatibility</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
