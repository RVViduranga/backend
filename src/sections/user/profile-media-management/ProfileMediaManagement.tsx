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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import userService from "@/services/user";
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
  const [profilePhotos, setProfilePhotos] = useState<MediaItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("photos");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "photo" | "portfolio";
    name: string;
  } | null>(null);

  // Load portfolio items from service
  useEffect(() => {
    async function loadMedia() {
      setIsLoading(true);
      try {
        // Load portfolio items from service
        const portfolio = await userService.getPortfolio();
        
        // Convert PortfolioItem[] to MediaItem[]
        const portfolioMedia: MediaItem[] = portfolio.map((item) => ({
          id: item.id,
          name: item.name,
          type: "portfolio" as const,
          uploadDate: item.uploadDate,
          size: item.size,
          thumbnail: item.url, // Use url as thumbnail
        }));
        
        setPortfolioItems(portfolioMedia);
        setProfilePhotos([]);
      } catch (error) {
        logger.error("Error loading media:", error);
        toast.error("Failed to load media files");
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
        setProfilePhotos(
          profilePhotos.filter((photo) => photo.id !== itemToDelete.id)
        );
        toast.success("Photo deleted successfully");
      } else {
        // Delete portfolio item via service
        await userService.deletePortfolio(itemToDelete.id);
        setPortfolioItems(
          portfolioItems.filter((item) => item.id !== itemToDelete.id)
        );
        toast.success("Portfolio item deleted successfully");
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

  const handleDeletePortfolio = (id: string) => {
    const item = portfolioItems.find((i) => i.id === id);
    if (item) {
      handleDeleteClick(id, "portfolio", item.name);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      setProfilePhotos(
        profilePhotos.map((photo) => ({
          ...photo,
          isPrimary: photo.id === id,
        }))
      );
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Profile Media Management
            </h1>
            <p className="text-muted-foreground">
              Upload and manage your professional photos and portfolio items to
              enhance your job applications.
            </p>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/user-profile-management">
              <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Media Management</CardTitle>
                <CardDescription>
                  Manage your profile photos and portfolio items
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {activeTab === "photos" ? (
                  <Button asChild>
                    <Link to="/profile-photo-upload">
                      <SafeIcon name="Plus" size={16} className="mr-2" />
                      Upload Photo
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/portfolio-upload">
                      <SafeIcon name="Plus" size={16} className="mr-2" />
                      Upload Portfolio
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="photos" className="flex items-center gap-2">
                  <SafeIcon name="Image" size={16} />
                  Profile Photos ({profilePhotos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="flex items-center gap-2"
                >
                  <SafeIcon name="FileText" size={16} />
                  Portfolio ({portfolioItems.length})
                </TabsTrigger>
              </TabsList>

              {/* Profile Photos Tab */}
              <TabsContent value="photos" className="space-y-6">
                {profilePhotos.length > 0 ? (
                  <MediaUploadSection
                    items={profilePhotos}
                    type="photo"
                    onDelete={handleDeletePhoto}
                    onDeleteClick={handleDeleteClick}
                    onSetPrimary={handleSetPrimary}
                  />
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
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload professional photos to enhance your job
                      applications. You can set one as your primary profile
                      photo.
                    </p>
                    <Button asChild>
                      <Link to="/profile-photo-upload">
                        <SafeIcon name="Upload" size={16} className="mr-2" />
                        Upload Your First Photo
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-6">
                {portfolioItems.length > 0 ? (
                  <MediaUploadSection
                    items={portfolioItems}
                    type="portfolio"
                    onDelete={handleDeletePortfolio}
                    onDeleteClick={handleDeleteClick}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <SafeIcon
                        name="FileText"
                        size={40}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No portfolio items uploaded yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload portfolio documents, project samples, or links to
                      showcase your work and skills to employers.
                    </p>
                    <Button asChild>
                      <Link to="/portfolio-upload">
                        <SafeIcon name="Upload" size={16} className="mr-2" />
                        Upload Your First Portfolio Item
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <SafeIcon
                  name="Lightbulb"
                  size={18}
                  className="text-amber-600"
                />
              </div>
              Tips for Better Applications
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
                <p className="font-medium text-sm mb-1">Profile Photos</p>
                <p className="text-sm text-muted-foreground">
                  Use a professional headshot with good lighting and a clean
                  background. Avoid casual or group photos.
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
                <p className="font-medium text-sm mb-1">Portfolio Items</p>
                <p className="text-sm text-muted-foreground">
                  Include your best work samples, case studies, or project
                  documentation that demonstrates your skills and experience.
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
                  Keep files under 10MB for faster uploads and better
                  performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete{" "}
                {itemToDelete?.type === "photo" ? "Photo" : "Portfolio Item"}?
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
