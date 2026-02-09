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
import ProjectsWorkSamplesForm from "./ProjectsWorkSamplesForm";
import ProjectsWorkSamplesEditForm from "./ProjectsWorkSamplesEditForm";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user-context";
import { userService } from "@/services/user";
import { logger } from "@/lib/logger";
import { Loader2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/date";

interface ProjectItem {
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
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  category?: string;
}

interface GroupedProjectItem {
  id?: string; // Project ID (optional, added when needed for editing)
  title: string;
  description: string;
  category?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  projectLink?: string; // External link URL (for GitHub, Behance, etc.)
  files: Array<{
    id: string;
    fileName: string;
    fileSize?: string;
    fileType?: string;
    url: string;
    thumbnail?: string;
    uploadedDate: string;
  }>;
  uploadedDate: string; // Most recent upload date (original date string from backend)
  uploadedDateFormatted: string; // Formatted display date
}

export default function ProjectsWorkSamplesContent() {
  const { isLoading } = useUser();
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [groupedProjects, setGroupedProjects] = useState<GroupedProjectItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<ProjectItem | null>(null);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<GroupedProjectItem | null>(null);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    // If it's already a formatted relative date (like "2 days ago"), return it as is
    if (dateString.includes("ago") || dateString === "Today") {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Load projects from service
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        // Use new projects endpoint
        const projects = await userService.getProjects();
        
        // Transform projects to component format
        const transformed: ProjectItem[] = projects.flatMap((project: any) => {
          const items: ProjectItem[] = [];
          
          // Add project link as a link item if it exists
          if (project.projectLink) {
            items.push({
              id: `${project.id}_link`,
              title: project.title,
              description: project.description || "",
              type: "link",
              url: project.projectLink,
              uploadedDate: project.uploadedDate,
              platform: project.platform || "Other",
              isFeatured: project.isFeatured || false,
              category: project.category || "",
            });
          }
          
          // Add all files as file items
          if (project.files && project.files.length > 0) {
            project.files.forEach((file: any) => {
              items.push({
                id: file.id,
                title: project.title,
                description: project.description || "",
                type: "file",
                fileName: file.fileName,
                fileSize: `${file.sizeKB} KB`,
                fileType: file.fileType,
                url: file.url,
                uploadedDate: file.uploadDate,
                thumbnail: file.fileType === "Project Image" || file.fileType === "Portfolio Image" ? file.url : undefined,
                platform: project.platform || "File Upload",
                isFeatured: project.isFeatured || false,
                category: project.category || "",
              });
            });
          }
          
          return items;
        });
        
        setProjectItems(transformed);
        setGroupedProjects(groupProjects(transformed));
      } catch (error) {
        logger.error("Error loading projects:", error);
        toast.error("Failed to load project items.");
      } finally {
        setIsLoadingProjects(false);
      }
    };
    loadProjects();
  }, []);

  const groupProjects = (items: ProjectItem[]): GroupedProjectItem[] => {
    const grouped = items.reduce((acc, item) => {
      const title = item.title;
      if (!acc[title]) {
        acc[title] = {
          title,
          description: item.description,
          category: item.category,
          platform: item.platform,
          isFeatured: item.isFeatured,
          projectLink: item.type === "link" ? item.url : undefined,
          files: [],
          uploadedDate: item.uploadedDate, // Original date string
          uploadedDateFormatted: formatRelativeDate(item.uploadedDate), // Formatted for display
        };
      }
      
      // If this is a link, update the project link
      if (item.type === "link") {
        acc[title].projectLink = item.url;
      } else if (item.type === "file" && item.url) {
        // Add file to the project
        acc[title].files.push({
          id: item.id,
          fileName: item.fileName || item.title,
          fileSize: item.fileSize,
          fileType: item.fileType,
          url: item.url,
          thumbnail: item.thumbnail,
          uploadedDate: item.uploadedDate, // Original date string
        });
      }
      
      // Update description if not set
      if (!acc[title].description && item.description) {
        acc[title].description = item.description;
      }
      
      // Update to most recent date (compare original date strings)
      try {
        const itemDate = new Date(item.uploadedDate);
        const currentDate = new Date(acc[title].uploadedDate);
        if (!isNaN(itemDate.getTime()) && !isNaN(currentDate.getTime()) && itemDate > currentDate) {
          acc[title].uploadedDate = item.uploadedDate;
          acc[title].uploadedDateFormatted = formatRelativeDate(item.uploadedDate);
        }
      } catch (error) {
        // If date parsing fails, keep the existing date
      }
      
      return acc;
    }, {} as Record<string, GroupedProjectItem>);

    return Object.values(grouped);
  };

  const handleUploadSuccess = async (newItem: ProjectItem) => {
    // Reload projects from service
    try {
      const projects = await userService.getProjects();
      
      const transformed: ProjectItem[] = projects.flatMap((project: any) => {
        const items: ProjectItem[] = [];
        
        if (project.projectLink) {
          items.push({
            id: `${project.id}_link`,
            title: project.title,
            description: project.description || "",
            type: "link",
            url: project.projectLink,
            uploadedDate: project.uploadedDate,
            platform: project.platform || "Other",
            isFeatured: project.isFeatured || false,
            category: project.category || "",
          });
        }
        
        if (project.files && project.files.length > 0) {
          project.files.forEach((file: any) => {
            items.push({
              id: file.id,
              title: project.title,
              description: project.description || "",
              type: "file",
              fileName: file.fileName,
              fileSize: `${file.sizeKB} KB`,
              fileType: file.fileType,
              url: file.url,
              uploadedDate: file.uploadDate,
              thumbnail: file.fileType === "Project Image" || file.fileType === "Portfolio Image" ? file.url : undefined,
              platform: project.platform || "File Upload",
              isFeatured: project.isFeatured || false,
              category: project.category || "",
            });
          });
        }
        
        return items;
      });
      
      setProjectItems(transformed);
      setGroupedProjects(groupProjects(transformed));
      setUploadDialogOpen(false);
      setSelectedItemForEdit(null);
    } catch (error) {
      logger.error("Error reloading projects:", error);
    }
  };

  const handleEditClick = async (project: GroupedProjectItem) => {
    try {
      // Get all projects from backend to find the matching one
      const projects = await userService.getProjects();
      const fullProject = projects.find((p: any) => p.title === project.title);
      
      if (fullProject) {
        // Transform to the format expected by edit form
        const projectData = {
          id: fullProject.id,
          title: fullProject.title,
          description: fullProject.description || '',
          category: fullProject.category || '',
          platform: fullProject.platform || 'File Upload',
          isFeatured: fullProject.isFeatured || false,
          projectLink: fullProject.projectLink || '',
          files: (fullProject.files || []).map((file: any) => ({
            id: file.id,
            fileName: file.fileName,
            fileType: file.fileType,
            url: file.url,
            thumbnail: file.fileType === "Project Image" || file.fileType === "Portfolio Image" ? file.url : undefined,
            uploadedDate: file.uploadDate,
          })),
        };
        setSelectedProjectForEdit(projectData as any);
        setEditDialogOpen(true);
      } else {
        toast.error("Project not found");
      }
    } catch (error) {
      logger.error("Error loading project for edit:", error);
      toast.error("Failed to load project details");
    }
  };

  const handleEditSuccess = async () => {
    try {
      const projects = await userService.getProjects();
      
      const transformed: ProjectItem[] = projects.flatMap((project: any) => {
        const items: ProjectItem[] = [];
        
        if (project.projectLink) {
          items.push({
            id: `${project.id}_link`,
            title: project.title,
            description: project.description || "",
            type: "link",
            url: project.projectLink,
            uploadedDate: project.uploadedDate,
            platform: project.platform || "Other",
            isFeatured: project.isFeatured || false,
            category: project.category || "",
          });
        }
        
        if (project.files && project.files.length > 0) {
          project.files.forEach((file: any) => {
            items.push({
              id: file.id,
              title: project.title,
              description: project.description || "",
              type: "file",
              fileName: file.fileName,
              fileSize: `${file.sizeKB} KB`,
              fileType: file.fileType,
              url: file.url,
              uploadedDate: file.uploadDate,
              thumbnail: file.fileType === "Project Image" || file.fileType === "Portfolio Image" ? file.url : undefined,
              platform: project.platform || "File Upload",
              isFeatured: project.isFeatured || false,
              category: project.category || "",
            });
          });
        }
        
        return items;
      });
      
      setProjectItems(transformed);
      setGroupedProjects(groupProjects(transformed));
      setEditDialogOpen(false);
      setSelectedItemForEdit(null);
    } catch (error) {
      logger.error("Error reloading projects:", error);
    }
  };

  const handleDeleteClick = (projectTitle: string) => {
    // Find all items with this title to delete
    const itemsToDelete = projectItems.filter((item) => item.title === projectTitle);
    if (itemsToDelete.length > 0) {
      setSelectedItemId(itemsToDelete[0].id); // Store first ID for reference
      setDeleteDialogOpen(true);
      // Store the title to delete all items
      setSelectedItemForDelete(projectTitle);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedItemForDelete) {
      try {
        // Find the project by title (get the actual project ID from grouped projects)
        const groupedProject = groupedProjects.find(
          (p) => p.title === selectedItemForDelete
        );
        
        if (!groupedProject) {
          toast.error("Project not found");
          setDeleteDialogOpen(false);
          setSelectedItemForDelete(null);
          setSelectedItemId(null);
          return;
        }

        // Get projects to find the actual project ID
        const projects = await userService.getProjects();
        const project = projects.find((p: any) => p.title === selectedItemForDelete);
        
        if (!project) {
          toast.error("Project not found");
          setDeleteDialogOpen(false);
          setSelectedItemForDelete(null);
          setSelectedItemId(null);
          return;
        }

        const projectId = project.id;
        
        // Delete the project
        await userService.deleteProject(projectId);
        
        // Reload projects from service
        try {
          const projects = await userService.getProjects();
          
          const transformed: ProjectItem[] = projects.flatMap((project: any) => {
            const items: ProjectItem[] = [];
            
            if (project.projectLink) {
              items.push({
                id: `${project.id}_link`,
                title: project.title,
                description: project.description || "",
                type: "link",
                url: project.projectLink,
                uploadedDate: project.uploadedDate,
                platform: project.platform || "Other",
                isFeatured: project.isFeatured || false,
                category: project.category || "",
              });
            }
            
            if (project.files && project.files.length > 0) {
              project.files.forEach((file: any) => {
                items.push({
                  id: file.id,
                  title: project.title,
                  description: project.description || "",
                  type: "file",
                  fileName: file.fileName,
                  fileSize: `${file.sizeKB} KB`,
                  fileType: file.fileType,
                  url: file.url,
                  uploadedDate: file.uploadDate,
                  thumbnail: file.fileType === "Project Image" || file.fileType === "Portfolio Image" ? file.url : undefined,
                  platform: project.platform || "File Upload",
                  isFeatured: project.isFeatured || false,
                  category: project.category || "",
                });
              });
            }
            
            return items;
          });
          
          setProjectItems(transformed);
          setGroupedProjects(groupProjects(transformed));
        } catch (reloadError) {
          logger.error("Error reloading projects after delete:", reloadError);
          // If reload fails, remove from local state
          const updated = projectItems.filter(
            (item) => item.title !== selectedItemForDelete
          );
          setProjectItems(updated);
          setGroupedProjects(groupProjects(updated));
        }
        
        setDeleteDialogOpen(false);
        setSelectedItemId(null);
        setSelectedItemForDelete(null);
        toast.success(
          `Project "${selectedItemForDelete}" deleted successfully`
        );
      } catch (error: any) {
        logger.error("Error deleting project:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete project. Please try again.";
        toast.error(errorMessage);
        setDeleteDialogOpen(false);
        setSelectedItemForDelete(null);
        setSelectedItemId(null);
      }
    }
  };

  if (isLoading || isLoadingProjects) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects & Work Samples</h1>
          <p className="text-muted-foreground">
            Showcase your projects and work samples by uploading files or linking to your work on GitHub, Behance, Dribbble, or your personal website.
          </p>
        </div>
        {groupedProjects.length > 0 && (
          <Button onClick={() => setUploadDialogOpen(true)}>
            <SafeIcon name="Upload" size={18} className="mr-2" />
            Add Another Project
          </Button>
        )}
      </div>

      {/* All Projects & Work Samples Grid */}
      {groupedProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SafeIcon
              name="Briefcase"
              size={48}
              className="text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              No Projects & Work Samples Yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Start showcasing your work by uploading project samples, design files, or linking to your work on GitHub, Behance, Dribbble, or your personal website.
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <SafeIcon name="Upload" size={18} className="mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedProjects.map((project) => (
            <Card key={project.title} className="hover:shadow-lg transition-all border flex flex-col">
              {/* Image Gallery - Takes up most of the card */}
              {project.files.length > 0 ? (
                <div className="relative aspect-square overflow-hidden">
                  <div className="grid grid-cols-2 h-full gap-0.5">
                    {project.files.slice(0, 4).map((file, idx) => {
                      const isImage = file.thumbnail && (file.fileType === "Project Image" || file.fileType === "Portfolio Image" || file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                      const isPDF = file.fileName?.toLowerCase().endsWith('.pdf') || file.url.toLowerCase().includes('.pdf');
                      const fileExtension = file.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
                      
                      return (
                        <div 
                          key={file.id} 
                          className="relative bg-muted cursor-pointer group overflow-hidden"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          {isImage ? (
                            <img
                              src={file.thumbnail}
                              alt={file.fileName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-2">
                              {isPDF ? (
                                <>
                                  <div className="flex-1 flex items-center justify-center">
                                    <SafeIcon name="FileText" size={32} className="text-red-600 mb-1" />
                                  </div>
                                  <div className="w-full text-center">
                                    <p className="text-[8px] font-semibold text-foreground truncate px-1">
                                      {file.fileName}
                                    </p>
                                    <p className="text-[7px] text-muted-foreground mt-0.5">PDF</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex-1 flex items-center justify-center">
                                    <SafeIcon name="File" size={32} className="text-blue-600 mb-1" />
                                  </div>
                                  <div className="w-full text-center">
                                    <p className="text-[8px] font-semibold text-foreground truncate px-1">
                                      {file.fileName}
                                    </p>
                                    <p className="text-[7px] text-muted-foreground mt-0.5">{fileExtension}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <SafeIcon name="Eye" size={16} className="text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {project.files.length > 4 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{project.files.length - 4} more
                    </div>
                  )}
                  {/* Edit/Delete buttons overlay */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => handleEditClick(project)}
                    >
                      <SafeIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(project.title)}
                    >
                      <SafeIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-square bg-muted flex items-center justify-center">
                  <SafeIcon name="Briefcase" size={48} className="text-muted-foreground" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => handleEditClick(project)}
                    >
                      <SafeIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(project.title)}
                    >
                      <SafeIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <CardHeader className="pb-3 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-base font-semibold truncate">{project.title}</CardTitle>
                      {project.isFeatured && (
                        <Badge className="bg-yellow-500 text-white text-xs flex-shrink-0">
                          <SafeIcon name="Star" size={8} className="mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs mb-2">
                      {project.platform && project.platform !== "File Upload" && (
                        <Badge variant="outline" className="text-xs">
                          {project.platform}
                        </Badge>
                      )}
                      {project.category && (
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {project.description && (
                  <div className="mt-auto">
                    <p className={`text-sm text-muted-foreground leading-relaxed ${expandedDescriptions.has(project.title) ? '' : 'line-clamp-2'}`}>
                      {project.description}
                    </p>
                    {project.description.length > 100 && (
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedDescriptions);
                          if (newExpanded.has(project.title)) {
                            newExpanded.delete(project.title);
                          } else {
                            newExpanded.add(project.title);
                          }
                          setExpandedDescriptions(newExpanded);
                        }}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        {expandedDescriptions.has(project.title) ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                )}
              </CardHeader>

              {/* Action Buttons */}
              {project.projectLink && (
                <div className="px-4 pb-4 pt-0 border-t">
                  <Button variant="default" size="sm" asChild className="w-full">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SafeIcon name="ExternalLink" size={14} className="mr-1.5" />
                      Visit Project
                    </a>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <Card className="mt-8 bg-gradient-to-br from-purple-50/80 to-pink-50/50 border-purple-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <SafeIcon name="Lightbulb" size={18} className="text-purple-600" />
            </div>
            Tips for Better Projects & Work Samples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Showcase Your Best Work</p>
              <p className="text-sm text-muted-foreground">
                Include your most impressive projects, case studies, or work
                samples that demonstrate your skills and expertise
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Mix Files and Links</p>
              <p className="text-sm text-muted-foreground">
                Upload project files or add links to your online projects and work samples,
                GitHub, Behance, or other professional platforms
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Provide Context</p>
              <p className="text-sm text-muted-foreground">
                Add descriptions to explain what each project
                demonstrates and the technologies or skills used
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">Keep It Organized</p>
              <p className="text-sm text-muted-foreground">
                Organize your projects by category, technology, or
                industry to make it easy for employers to find relevant work
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon
              name="CheckCircle2"
              size={18}
              className="text-purple-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium text-sm mb-1">File Size Matters</p>
              <p className="text-sm text-muted-foreground">
                Keep files under 10MB for faster uploads and better
                compatibility across different devices
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setSelectedProjectForEdit(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project & Work Sample</DialogTitle>
            <DialogDescription>
              Update the details, add or remove files for your project.
            </DialogDescription>
          </DialogHeader>
          {selectedProjectForEdit && selectedProjectForEdit.id && (
            <ProjectsWorkSamplesEditForm
              project={{
                id: selectedProjectForEdit.id,
                title: selectedProjectForEdit.title,
                description: selectedProjectForEdit.description,
                category: selectedProjectForEdit.category,
                platform: selectedProjectForEdit.platform,
                isFeatured: selectedProjectForEdit.isFeatured,
                projectLink: selectedProjectForEdit.projectLink,
                files: selectedProjectForEdit.files.map(file => ({
                  id: file.id,
                  fileName: file.fileName,
                  fileType: file.fileType,
                  url: file.url,
                  thumbnail: file.thumbnail,
                  uploadedDate: file.uploadedDate,
                })),
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedProjectForEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        setUploadDialogOpen(open);
        if (!open) {
          // Only clear if we're not adding to existing project
          if (!selectedItemForEdit?.title || selectedItemForEdit.id) {
            setSelectedItemForEdit(null);
          }
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItemForEdit?.title && !selectedItemForEdit.id 
                ? `Add Files to "${selectedItemForEdit.title}"` 
                : "Add Project & Work Sample"}
            </DialogTitle>
            <DialogDescription>
              {selectedItemForEdit?.title && !selectedItemForEdit.id
                ? "Upload additional files to this project"
                : "Upload work samples or add links to your projects on GitHub, Behance, Dribbble, or your personal website"
              }
            </DialogDescription>
          </DialogHeader>
          <ProjectsWorkSamplesForm
            onSuccess={handleUploadSuccess}
            onCancel={() => {
              setUploadDialogOpen(false);
              setSelectedItemForEdit(null);
            }}
            existingProjectTitle={selectedItemForEdit?.title && !selectedItemForEdit.id ? selectedItemForEdit.title : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project & Work Sample</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project or work sample? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedItemId(null);
                setSelectedItemForDelete(null);
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
