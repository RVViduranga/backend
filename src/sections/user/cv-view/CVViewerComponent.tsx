import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SafeIcon from "@/components/common/safe-icon";
import CVViewerPreview from "./CVViewerPreview";
import CVMetadataDisplay from "./CVMetadataDisplay";
import CVListSidebar from "./CVListSidebar";
import { useUser } from "@/hooks/use-user-context";
import { Loader2 } from "lucide-react";
import userService from "@/services/user";

interface CV {
  id: string;
  name: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  format: string;
  isPrimary: boolean;
  previewUrl: string;
}

export default function CVViewerComponent() {
  const { isLoading } = useUser();
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [cvList, setCVList] = useState<CV[]>([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(true);

  // Load CVs from service
  useEffect(() => {
    const loadCVs = async () => {
      try {
        setIsLoadingCVs(true);
        const cvs = await userService.getCVs();
        // Transform service CV format to component format
        const transformed: CV[] = cvs.map((cv) => ({
          id: cv.id,
          name: cv.name,
          fileName: cv.fileName,
          uploadDate: cv.uploadedDate,
          fileSize: cv.fileSize,
          format:
            cv.format || cv.fileName.split(".").pop()?.toUpperCase() || "PDF",
          isPrimary: cv.isPrimary,
          previewUrl: cv.downloadUrl,
        }));
        setCVList(transformed);
        if (transformed.length > 0) {
          setSelectedCV(transformed[0]);
        }
      } catch (error) {
        // Handle error - for now just log
      } finally {
        setIsLoadingCVs(false);
      }
    };
    loadCVs();
  }, []);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSetPrimary = (cvId: string) => {
    setCVList(
      cvList.map((cv) => ({
        ...cv,
        isPrimary: cv.id === cvId,
      }))
    );
    setSelectedCV(cvList.find((cv) => cv.id === cvId) || selectedCV);
  };

  const handleDeleteCV = async () => {
    if (!selectedCV) return;
    setIsDeleting(true);
    try {
      const updatedList = cvList.filter((cv) => cv.id !== selectedCV.id);
      setCVList(updatedList);
      if (updatedList.length > 0) {
        setSelectedCV(updatedList[0]);
      } else {
        setSelectedCV(null);
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadCV = () => {
    if (!selectedCV) return;
    const link = document.createElement("a");
    link.href = selectedCV.previewUrl;
    link.download = selectedCV.fileName;
    link.click();
  };

  if (isLoading || isLoadingCVs) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (cvList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <SafeIcon
            name="FileText"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">No CVs uploaded</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first CV to get started.
          </p>
          <Button asChild>
            <Link to="/cv-management">Go to CV Management</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedCV) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            to="/cv-management"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <SafeIcon name="ChevronLeft" size={18} />
            CV Management
          </Link>
        </div>
        <h1 className="text-3xl font-bold">View CV</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage your uploaded resumes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* CV List Sidebar */}
        <div className="lg:col-span-1">
          <CVListSidebar
            cvs={cvList}
            selectedCV={selectedCV}
            onSelectCV={setSelectedCV}
            onSetPrimary={handleSetPrimary}
          />
        </div>

        {/* Main CV Viewer */}
        <div className="lg:col-span-3 space-y-6">
          {/* CV Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedCV.name}</CardTitle>
                  <CardDescription>{selectedCV.fileName}</CardDescription>
                </div>
                {selectedCV.isPrimary && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <SafeIcon name="Check" size={14} className="mr-1" />
                    Primary
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CVViewerPreview
                previewUrl={selectedCV.previewUrl}
                fileName={selectedCV.fileName}
              />
            </CardContent>
          </Card>

          {/* CV Metadata */}
          <CVMetadataDisplay cv={selectedCV} />

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadCV}
                >
                  <SafeIcon name="Download" size={18} className="mr-2" />
                  Download
                </Button>

                {!selectedCV.isPrimary && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSetPrimary(selectedCV.id)}
                  >
                    <SafeIcon name="Star" size={18} className="mr-2" />
                    Set as Primary
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isDeleting}
                    >
                      <SafeIcon name="Trash2" size={18} className="mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete CV</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{selectedCV.name}"?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteCV}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Separator />

              <Button variant="outline" className="w-full" asChild>
                <Link to="/cv-management">
                  <SafeIcon name="ChevronLeft" size={18} className="mr-2" />
                  Back to CV Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
