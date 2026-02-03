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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafeIcon from "@/components/common/safe-icon";
import FileUploadZone from "./FileUploadZone";
import PortfolioItemCard from "./PortfolioItemCard";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user-context";
import userService from "@/services/user";
import { Loader2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/date";
import {
  PORTFOLIO_SUPPORTED_FORMATS,
  MAX_PORTFOLIO_SIZE_MB,
} from "@/constants/app";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: "file" | "link";
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  url?: string;
  uploadedDate: string;
  thumbnail?: string;
}

export default function PortfolioUploadContent() {
  const { isLoading } = useUser();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  
  // Load portfolio items from service
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setIsLoadingPortfolio(true);
        const portfolio = await userService.getPortfolio();
        // Transform service portfolio format to component format
        const transformed: PortfolioItem[] = portfolio.map((item) => ({
          id: item.id,
          title: item.name || 'Untitled',
          description: '',
          type: item.url ? 'link' : 'file',
          fileName: item.name,
          fileSize: typeof item.size === 'string' ? item.size : undefined,
          fileType: item.type || item.name?.split('.').pop()?.toUpperCase(),
          url: item.url,
          uploadedDate: formatRelativeDate(item.uploadDate),
          thumbnail: item.url,
        }));
        setPortfolioItems(transformed);
      } catch (error) {
        // Handle error - for now just log
      } finally {
        setIsLoadingPortfolio(false);
      }
    };
    loadPortfolio();
  }, []);
  const [activeTab, setActiveTab] = useState("items");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "file" as "file" | "link",
    url: "",
  });
  if (isLoading || isLoadingPortfolio) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a portfolio title");
      return;
    }

    if (formData.type === "link" && !formData.url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      url: formData.type === "link" ? formData.url : undefined,
      uploadedDate: "just now",
    };

    setPortfolioItems([newItem, ...portfolioItems]);
    setFormData({ title: "", description: "", type: "file", url: "" });
    setActiveTab("items");
    toast.success(`Portfolio item "${newItem.title}" added successfully`);
  };

  const handleDeleteItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const newItem: PortfolioItem = {
        id: Date.now().toString() + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        type: "file",
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type.split("/")[1]?.toUpperCase() || "FILE",
        uploadedDate: "just now",
      };
      setPortfolioItems([newItem, ...portfolioItems]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your portfolio items, project samples, and online
            portfolio links
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/profile-media-management">
            <SafeIcon name="ArrowLeft" size={18} className="mr-2" />
            Back
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">My Portfolio Items</TabsTrigger>
          <TabsTrigger value="add">Add New Item</TabsTrigger>
        </TabsList>

        {/* Portfolio Items Tab */}
        <TabsContent value="items" className="space-y-4">
          {portfolioItems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SafeIcon
                  name="FolderOpen"
                  size={48}
                  className="text-muted-foreground mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">
                  No Portfolio Items Yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                  Start building your portfolio by uploading project samples,
                  design files, or links to your work
                </p>
                <Button onClick={() => setActiveTab("add")}>
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems.map((item) => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Add New Item Tab */}
        <TabsContent value="add" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload File Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Portfolio File</CardTitle>
                  <CardDescription>
                    Upload design files, project samples, or documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadZone onFilesSelected={handleFileUpload} />
                </CardContent>
              </Card>
            </div>

            {/* Supported Formats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {PORTFOLIO_SUPPORTED_FORMATS.documents.map((format) => (
                      <Badge key={format} variant="outline">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Design Files</p>
                  <div className="flex flex-wrap gap-2">
                    {PORTFOLIO_SUPPORTED_FORMATS.designFiles.map((format) => (
                      <Badge key={format} variant="outline">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Images</p>
                  <div className="flex flex-wrap gap-2">
                    {PORTFOLIO_SUPPORTED_FORMATS.images.map((format) => (
                      <Badge key={format} variant="outline">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Max file size: {MAX_PORTFOLIO_SIZE_MB} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Link Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add Portfolio Link</CardTitle>
              <CardDescription>
                Link to your online portfolio, GitHub, Behance, or other
                portfolio platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Portfolio Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., My Design Portfolio"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.currentTarget.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this portfolio item showcases..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.currentTarget.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Portfolio URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/portfolio"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.currentTarget.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  <SafeIcon name="Plus" size={18} className="mr-2" />
                  Add Portfolio Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between pt-6 border-t">
        <Button variant="outline" asChild>
          <Link to="/profile-media-management">
            <SafeIcon name="ArrowLeft" size={18} className="mr-2" />
            Back to Media Management
          </Link>
        </Button>
        <Button asChild>
          <Link to="/user-profile-management">
            <SafeIcon name="Check" size={18} className="mr-2" />
            Done
          </Link>
        </Button>
      </div>
    </div>
  );
}
