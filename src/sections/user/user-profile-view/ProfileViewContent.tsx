import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { useUser } from "@/hooks/use-user-context";
import { userService, type UserCV } from "@/services/user";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/date";
import { logger } from "@/lib/logger";

export default function ProfileViewContent() {
  const { profile, isLoading } = useUser();
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [primaryCV, setPrimaryCV] = useState<UserCV | null>(null);
  const [isLoadingCV, setIsLoadingCV] = useState(true);

  // Load primary CV - Must be called before any early returns
  useEffect(() => {
    const loadPrimaryCV = async () => {
      try {
        setIsLoadingCV(true);
        const cvs = await userService.getCVs();
        const primary = cvs.find(cv => cv.isPrimary);
        setPrimaryCV(primary || null);
      } catch (error) {
        logger.error("Error loading primary CV:", error);
        setPrimaryCV(null);
      } finally {
        setIsLoadingCV(false);
      }
    };
    loadPrimaryCV();
  }, []);

  // Load featured projects - Must be called before any early returns
  useEffect(() => {
    const loadFeaturedProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const projects = await userService.getProjects();
        const featured = projects.filter((project: any) => project.isFeatured === true);
        setFeaturedProjects(featured);
      } catch (error) {
        logger.error("Error loading featured projects:", error);
        setFeaturedProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    loadFeaturedProjects();
  }, []);

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  // Early returns AFTER all hooks are called
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SafeIcon name="UserX" size={48} className="text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Profile Found</h2>
        <p className="text-muted-foreground">
          Please complete your profile setup to view your profile.
        </p>
        <Button asChild>
          <Link to="/user-profile-setup">Complete Profile Setup</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-background via-background to-muted/20">
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
              <SafeIcon name="User" size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1.5 text-sm font-normal">
                View your complete professional profile
              </p>
            </div>
          </div>
        </div>

        {/* Profile Header Card - Professional */}
        <Card className="mb-8 border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar - Professional */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeIcon
                      name="User"
                      size={56}
                      className="text-muted-foreground"
                    />
                  )}
                </div>
              </div>

              {/* Profile Info - Professional */}
              <div className="flex-1 min-w-0">
                <div className="space-y-2 mb-4">
                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                    {profile.fullName || "No Name"}
                  </h2>
                  {profile.headline && (
                    <p className="text-base text-muted-foreground font-normal leading-relaxed">
                      {profile.headline}
                    </p>
                  )}
                </div>
                
                {/* Contact Information - Clean Text Links */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <SafeIcon name="Mail" size={16} className="text-muted-foreground/70" />
                      <a 
                        href={`mailto:${profile.email}`}
                        className="hover:text-foreground hover:underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <SafeIcon name="Phone" size={16} className="text-muted-foreground/70" />
                      <a 
                        href={`tel:${profile.phone}`}
                        className="hover:text-foreground hover:underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <SafeIcon name="MapPin" size={16} className="text-muted-foreground/70" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About / Bio Section */}
            {profile?.headline && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <SafeIcon name="User" size={20} className="text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
                    {profile.headline}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Experience Section - Timeline Style */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <SafeIcon name="Briefcase" size={20} className="text-primary" />
                  Work Experience
                </CardTitle>
                <CardDescription>Your professional work history</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline Line */}
                        {index < profile.experience!.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent"></div>
                        )}
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center">
                          <SafeIcon name="Briefcase" size={10} className="text-primary-foreground" />
                        </div>
                        
                        <div className="bg-muted/50 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{exp.title || "Job Title"}</h3>
                              <p className="text-primary font-semibold mb-2">{exp.company || "Company"}</p>
                              {exp.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                  <SafeIcon name="MapPin" size={14} />
                                  {exp.location}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {exp.startDate && formatDateDisplay(exp.startDate)}
                              {exp.startDate && (exp.endDate || !exp.endDate) && " - "}
                              {exp.endDate ? formatDateDisplay(exp.endDate) : "Present"}
                            </Badge>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-foreground leading-relaxed mt-3 whitespace-pre-line">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <SafeIcon name="Briefcase" size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No work experience added yet</p>
                    <p className="text-sm mt-1">Add your work history to showcase your professional journey</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education Section - Timeline Style */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <SafeIcon name="GraduationCap" size={20} className="text-primary" />
                  Education
                </CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline Line */}
                        {index < profile.education!.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent"></div>
                        )}
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center">
                          <SafeIcon name="GraduationCap" size={10} className="text-primary-foreground" />
                        </div>
                        
                        <div className="bg-muted/50 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{edu.degree || "Degree"}</h3>
                              <p className="text-primary font-semibold mb-2">{edu.institution || "Institution"}</p>
                              {edu.fieldOfStudy && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {edu.fieldOfStudy}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {edu.startDate && formatDateDisplay(edu.startDate)}
                              {edu.startDate && (edu.endDate || !edu.endDate) && " - "}
                              {edu.endDate ? formatDateDisplay(edu.endDate) : "Present"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <SafeIcon name="GraduationCap" size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No education information added yet</p>
                    <p className="text-sm mt-1">Add your educational qualifications to complete your profile</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Projects Section */}
            {!isLoadingProjects && featuredProjects.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <SafeIcon name="Star" size={20} className="text-yellow-500" />
                    Featured Projects
                  </CardTitle>
                  <CardDescription>Showcasing your best work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all bg-muted/30"
                      >
                        {/* Project Image/Preview */}
                        {project.files && project.files.length > 0 && (
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                            {project.files[0].fileType === "Project Image" || 
                             project.files[0].url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={project.files[0].url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <SafeIcon name="File" size={32} className="text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500 text-white">
                                <SafeIcon name="Star" size={10} className="mr-1" />
                                Featured
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        {/* Project Info */}
                        <div>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
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
                          {project.projectLink && (
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <SafeIcon name="ExternalLink" size={14} className="mr-2" />
                                View Project
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/projects-work-samples">
                        View All Projects
                        <SafeIcon name="ArrowRight" size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Personal Details Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SafeIcon name="User" size={18} className="text-primary" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Full Name
                    </p>
                    <p className="text-base font-medium">{profile.fullName || "Not specified"}</p>
                  </div>
                  {profile.dateOfBirth && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Date of Birth
                      </p>
                      <p className="text-base font-medium">{formatDateDisplay(profile.dateOfBirth)}</p>
                    </div>
                  )}
                  {profile.nationality && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Nationality
                      </p>
                      <p className="text-base font-medium">{profile.nationality}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Primary CV Section */}
            {!isLoadingCV && primaryCV && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SafeIcon name="FileText" size={18} className="text-primary" />
                    Resume / CV
                  </CardTitle>
                  <CardDescription>Your primary CV document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{primaryCV.name}</h3>
                      <Badge variant="default" className="bg-primary text-xs">
                        Primary
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <SafeIcon name="File" size={14} />
                        {primaryCV.format || "PDF"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <SafeIcon name="Calendar" size={14} />
                        {formatDateDisplay(primaryCV.uploadedDate)}
                      </span>
                      {primaryCV.fileSize && (
                        <span className="flex items-center gap-1.5">
                          <SafeIcon name="HardDrive" size={14} />
                          {primaryCV.fileSize}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a
                          href={primaryCV.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <SafeIcon name="Download" size={16} className="mr-2" />
                          Download
                        </a>
                      </Button>
                      <Button variant="default" size="sm" className="w-full" asChild>
                        <Link to={`/cv-view?id=${primaryCV.id}`}>
                          <SafeIcon name="Eye" size={16} className="mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Card */}
            <Card className="shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SafeIcon name="Zap" size={18} className="text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/user-profile-setup">
                    <SafeIcon name="Edit" size={16} className="mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/cv-management">
                    <SafeIcon name="FileText" size={16} className="mr-2" />
                    Manage CVs
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/projects-work-samples">
                    <SafeIcon name="Briefcase" size={16} className="mr-2" />
                    View Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-start pt-8 mt-8 border-t">
          <Button variant="outline" asChild>
            <Link to="/user-dashboard">
              <SafeIcon name="ArrowLeft" size={18} className="mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
