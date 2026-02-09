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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SafeIcon from "@/components/common/safe-icon";
import MediaUploadSection from "./MediaUploadSection";
import ProfilePhotoUploadDialogForm from "./ProfilePhotoUploadDialogForm";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { userService } from "@/services/user";
import { useUser } from "@/hooks/use-user-context";
import { Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "photo" | "portfolio";
  uploadDate: string;
  size: string;
  isPrimary?: boolean;
  thumbnail?: string;
}

export default function ProfileMediaManagement() {
  const { refreshProfile } = useUser();
  const [profilePhotos, setProfilePhotos] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "photo" | "portfolio";
    name: string;
  } | null>(null);

  // Load profile photos from service
  useEffect(() => {
    async function loadMedia() {
      setIsLoading(true);
      try {
        const photos = await userService.getProfilePhotos();
        const transformed: MediaItem[] = photos.map((photo) => ({
          id: photo.id,
          name: photo.name,
          type: "photo",
          uploadDate: photo.uploadDate,
          size: photo.size,
          isPrimary: photo.isPrimary,
          thumbnail: photo.url,
        }));
        setProfilePhotos(transformed);
      } catch (error) {
        logger.error("Error loading media:", error);
        toast.error("Failed to load media files");
        setProfilePhotos([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMedia();
  }, []);

  const handleDeleteClick = (
    id: string,
    type: "photo" | "portfolio",
    name: string
  ) => {
    setItemToDelete({ id, type, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "photo") {
        await userService.deleteProfilePhoto(itemToDelete.id);
        // Refresh profile to update avatarUrl if primary was deleted
        await refreshProfile();
        // Reload profile photos to get updated data
        const photos = await userService.getProfilePhotos();
        const transformed: MediaItem[] = photos.map((photo) => ({
          id: photo.id,
          name: photo.name,
          type: "photo",
          uploadDate: photo.uploadDate,
          size: photo.size,
          isPrimary: photo.isPrimary,
          thumbnail: photo.url,
        }));
        setProfilePhotos(transformed);
        toast.success("Photo deleted successfully");
      }
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
      logger.error("Error deleting item:", error);
    }
  };

  const handleDeletePhoto = (id: string) => {
    const photo = profilePhotos.find((p) => p.id === id);
    if (photo) {
      handleDeleteClick(id, "photo", photo.name);
    }
  };


  const handleSetPrimary = async (id: string) => {
    try {
      await userService.setPrimaryProfilePhoto(id);
      // Refresh profile to update avatarUrl
      await refreshProfile();
      // Reload profile photos to get updated data
      const photos = await userService.getProfilePhotos();
      const transformed: MediaItem[] = photos.map((photo) => ({
        id: photo.id,
        name: photo.name,
        type: "photo",
        uploadDate: photo.uploadDate,
        size: photo.size,
        isPrimary: photo.isPrimary,
        thumbnail: photo.url,
      }));
      setProfilePhotos(transformed);
      toast.success("Profile photo set as primary");
    } catch (error) {
      toast.error("Failed to set primary photo");
      logger.error("Error setting primary photo:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Profile Media Management
          </h1>
          <p className="text-muted-foreground">
            Upload and manage your professional profile photos to enhance your job applications.
          </p>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profile Photos</CardTitle>
              <CardDescription>
                Manage your profile photos
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profilePhotos.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-end">
                    <Button onClick={() => setUploadDialogOpen(true)}>
                      <SafeIcon name="Upload" size={18} className="mr-2" />
                      Upload Another Photo
                    </Button>
                  </div>
                  <MediaUploadSection
                    items={profilePhotos}
                    type="photo"
                    onDelete={handleDeletePhoto}
                    onDeleteClick={handleDeleteClick}
                    onSetPrimary={handleSetPrimary}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <SafeIcon
                      name="Image"
                      size={40}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No profile photos uploaded yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm mx-auto">
                    Upload professional photos to enhance your job
                    applications. You can set one as your primary profile
                    photo.
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <SafeIcon name="Upload" size={18} className="mr-2" />
                    Upload Your First Photo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <SafeIcon
                  name="Lightbulb"
                  size={18}
                  className="text-amber-600"
                />
              </div>
              Tips for Better Profile Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Professional Headshot</p>
                <p className="text-sm text-muted-foreground">
                  Use a professional headshot with good lighting and a clean background. Avoid casual or group photos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Appropriate Attire</p>
                <p className="text-sm text-muted-foreground">
                  Dress professionally in business or business-casual attire that matches your industry standards
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Good Quality</p>
                <p className="text-sm text-muted-foreground">
                  Use a high-resolution photo with clear focus. Blurry or pixelated photos create a poor first impression
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">File Size</p>
                <p className="text-sm text-muted-foreground">
                  Keep photos under 5MB for faster uploads and better performance across different devices
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

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Profile Photo</DialogTitle>
              <DialogDescription>
                Choose a clear, professional photo that shows your face clearly.
                Supported formats: JPG, PNG, WebP. Max size: 5MB.
              </DialogDescription>
            </DialogHeader>
            <ProfilePhotoUploadDialogForm
              setAsPrimary={false}
              onSuccess={async () => {
                // Refresh profile first to get updated avatarUrl
                await refreshProfile();
                // Reload profile photos - wait a bit for backend to save
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                  const photos = await userService.getProfilePhotos();
                  const transformed: MediaItem[] = photos.map((photo) => ({
                    id: photo.id,
                    name: photo.name,
                    type: "photo",
                    uploadDate: photo.uploadDate,
                    size: photo.size,
                    isPrimary: photo.isPrimary,
                    thumbnail: photo.url,
                  }));
                  setProfilePhotos(transformed);
                } catch (error) {
                  logger.error("Error loading profile photos:", error);
                }
                setUploadDialogOpen(false);
              }}
              onCancel={() => setUploadDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Photo?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{itemToDelete?.name}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
