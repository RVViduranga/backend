import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SafeIcon from "@/components/common/safe-icon";
import CVUploadForm from "./CVUploadForm";
import { toast } from "sonner";
import userService from "@/services/user";
import type { UserCV } from "@/services/user";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";

export default function CVManagementContent() {
  const [cvs, setCVs] = useState<UserCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);

  // Load CVs from service
  useEffect(() => {
    const loadCVs = async () => {
      setIsLoading(true);
      try {
        const loadedCVs = await userService.getCVs();
        setCVs(loadedCVs || []); // Ensure it's always an array
      } catch (error: any) {
        logger.error("Error loading CVs:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to load CVs. Please try again.";
        toast.error(errorMessage);
        // Set empty array on error so UI doesn't break
        setCVs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCVs();
  }, []);

  const handleSetPrimary = async (cvId: string) => {
    try {
      await userService.setPrimaryCV(cvId);
      setCVs(
        cvs.map((cv) => ({
          ...cv,
          isPrimary: cv.id === cvId,
        }))
      );
      toast.success("Primary CV updated successfully");
    } catch (error) {
      logger.error("Error setting primary CV:", error);
      toast.error("Failed to update primary CV. Please try again.");
    }
  };

  const handleDeleteClick = (cvId: string) => {
    setSelectedCVId(cvId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCVId) {
      try {
        await userService.deleteCV(selectedCVId);
        const deletedCV = cvs.find((cv) => cv.id === selectedCVId);
        setCVs(cvs.filter((cv) => cv.id !== selectedCVId));
        setDeleteDialogOpen(false);
        setSelectedCVId(null);
        toast.success(`CV "${deletedCV?.name || "CV"}" deleted successfully`);
      } catch (error) {
        logger.error("Error deleting CV:", error);
        toast.error("Failed to delete CV. Please try again.");
      }
    }
  };

  const handleUploadSuccess = async (newCV: UserCV) => {
    // Close dialog first
    setUploadDialogOpen(false);
    
    // Small delay to ensure backend has saved the CV
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reload CVs from service
    try {
      const loadedCVs = await userService.getCVs();
      setCVs(loadedCVs);
      toast.success(`CV "${newCV.name}" uploaded successfully`);
    } catch (error) {
      logger.error("Error reloading CVs:", error);
      toast.error("CV uploaded but failed to refresh list. Please refresh the page.");
      // Add the new CV to the list manually as fallback
      setCVs(prev => [...prev, newCV]);
    }
  };

  // Map UserCV to display format
  const formatCV = (cv: UserCV) => ({
    ...cv,
    format: cv.fileName.split('.').pop()?.toUpperCase() || 'PDF',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">CV Management</h1>
          <p className="text-muted-foreground">
            Manage your resume documents for job applications. You can upload
            multiple CVs and select which one to use for each application.
          </p>
        </div>
        {cvs.length > 0 && (
          <Button onClick={() => setUploadDialogOpen(true)}>
            <SafeIcon name="Upload" size={18} className="mr-2" />
            Upload Another CV
          </Button>
        )}
      </div>

      {/* CVs List */}
      <div className="space-y-4">
        {cvs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <SafeIcon
                name="FileText"
                size={48}
                className="text-muted-foreground mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">
                No CVs Uploaded Yet
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Upload your first CV to get started with job applications. You
                can upload multiple versions for different positions.
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <SafeIcon name="Upload" size={18} className="mr-2" />
                Upload Your First CV
              </Button>
            </CardContent>
          </Card>
        ) : (
          cvs.map((cv) => {
            const displayCV = formatCV(cv);
            return (
            <Card key={cv.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <SafeIcon
                        name="FileText"
                        size={24}
                        className="text-primary"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{displayCV.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {displayCV.fileName}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  {displayCV.isPrimary && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <SafeIcon name="Check" size={14} className="mr-1" />
                      Primary
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Format</p>
                    <p className="font-medium text-sm">{displayCV.format}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      File Size
                    </p>
                    <p className="font-medium text-sm">{displayCV.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Uploaded
                    </p>
                    <p className="font-medium text-sm">
                      {formatDate(displayCV.uploadedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center gap-2 px-6 py-3 border-t bg-muted/30">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/cv-view?id=${cv.id}`}>
                    <SafeIcon name="Eye" size={16} className="mr-2" />
                    View
                  </Link>
                </Button>
                {!displayCV.isPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary(cv.id)}
                  >
                    <SafeIcon name="Star" size={16} className="mr-2" />
                    Set as Primary
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={displayCV.downloadUrl || `#download-${cv.id}`} download>
                    <SafeIcon name="Download" size={16} className="mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(cv.id)}
                >
                  <SafeIcon name="Trash2" size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          )})
        )}
      </div>

      {/* Tips Section */}
      <Card className="mt-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <SafeIcon name="Lightbulb" size={18} className="text-blue-600" />
            </div>
            Tips for Better CVs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Keep It Updated</p>
              <p className="text-sm text-muted-foreground">
                Regularly update your CV with your latest experience, skills, and achievements
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Tailor for Each Job</p>
              <p className="text-sm text-muted-foreground">
                Create different versions of your CV for different job types or industries to highlight relevant experience
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Professional Formatting</p>
              <p className="text-sm text-muted-foreground">
                Use clear formatting, professional fonts, and consistent styling for better readability
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Keep It Concise</p>
              <p className="text-sm text-muted-foreground">
                Ensure your CV is under 2 pages for most positions to maintain recruiter attention
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Set Primary CV</p>
              <p className="text-sm text-muted-foreground">
                Always set a primary CV that will be used by default in job applications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center gap-2 mt-8 pt-6 border-t">
        <Button variant="outline" asChild>
          <Link to="/user-profile-management">
            <SafeIcon name="ChevronLeft" size={18} className="mr-2" />
            Back to Profile Management
          </Link>
        </Button>
      </div>

      {/* Upload Dialog - Single instance for both empty state and header button */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Your CV</DialogTitle>
            <DialogDescription>
              Upload a new resume or CV. Supported formats: PDF, DOC, DOCX
            </DialogDescription>
          </DialogHeader>
          <CVUploadForm
            onSuccess={handleUploadSuccess}
            onCancel={() => setUploadDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CV</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this CV? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedCVId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
