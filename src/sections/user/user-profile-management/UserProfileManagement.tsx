import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import ProfileOverviewCard from "./ProfileOverviewCard";
import { useUser } from "@/hooks/use-user-context";
import { useAuth } from "@/hooks/use-auth-context";
import { useProfileCompletion } from "@/hooks/use-profile-completion";
import { Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { userService } from "@/services/user";

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  buttonText: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export default function UserProfileManagement() {
  const { profile, isLoading: profileLoading } = useUser();
  const { user } = useAuth();
  const profileCompletion = useProfileCompletion();
  const [cvCount, setCvCount] = useState<number>(0);
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [projectsCount, setProjectsCount] = useState<number>(0);

  // Load CV count
  useEffect(() => {
    const loadCVCount = async () => {
      try {
        const cvs = await userService.getCVs();
        setCvCount(cvs.length);
      } catch (error) {
        // If error, fallback to profile.cvUploaded
        setCvCount(profile?.cvUploaded ? 1 : 0);
      }
    };
    loadCVCount();
  }, [profile?.cvUploaded]);

  // Load photo count
  useEffect(() => {
    const loadPhotoCount = async () => {
      try {
        const photos = await userService.getProfilePhotos();
        setPhotoCount(photos.length);
      } catch (error) {
        // If error, fallback to profile.avatarUrl
        setPhotoCount(profile?.avatarUrl ? 1 : 0);
      }
    };
    loadPhotoCount();
  }, [profile?.avatarUrl]);

  // Load projects count
  useEffect(() => {
    const loadProjectsCount = async () => {
      try {
        const projects = await userService.getProjects();
        setProjectsCount(projects.length);
      } catch (error) {
        // If error, set to 0
        setProjectsCount(0);
      }
    };
    loadProjectsCount();
  }, []);

  const profileSections: ProfileSection[] = useMemo(
    () => [
      {
        id: "cv",
        title: "CV Management",
        description:
          "Upload, manage, and organize your resumes for job applications.",
        icon: "FileText",
        href: "/cv-management",
        buttonText: "Manage CVs",
        stats: [
          { label: "CVs Uploaded", value: cvCount },
        ],
      },
      {
        id: "media",
        title: "Profile Media",
        description:
          "Upload and manage your profile photos to enhance your profile.",
        icon: "Image",
        href: "/profile-media-management",
        buttonText: "Manage Photos",
        stats: [
          {
            label: "Photos Uploaded",
            value: photoCount,
          },
        ],
      },
      {
        id: "projects",
        title: "Projects & Work Samples",
        description:
          "Upload work samples or add links to your projects on GitHub, Behance, Dribbble, or your personal website.",
        icon: "Briefcase",
        href: "/projects-work-samples",
        buttonText: "Manage Projects & Work Samples",
        stats: [
          {
            label: "Projects & Work Samples",
            value: projectsCount,
          },
        ],
      },
    ],
    [profile, profileCompletion, cvCount, photoCount, projectsCount]
  );

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.fullName || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayHeadline = profile?.headline || "";
  const displayLocation = profile?.location || "";

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gradient-to-b from-background to-muted/20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg shadow-primary/10">
              <SafeIcon name="UserCog" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Profile Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage all aspects of your professional profile to enhance your job applications
              </p>
            </div>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-6 flex-1">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-4 border-background shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeIcon
                      name="User"
                      size={48}
                      className="text-primary/60"
                    />
                  )}
                </div>

                {/* Profile Info */}
                <div className="space-y-3 flex-1">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">{displayName}</CardTitle>
                    {displayHeadline && (
                      <p className="text-muted-foreground text-base">
                        {displayHeadline}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {displayEmail && (
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
                        <SafeIcon name="Mail" size={16} className="text-primary" />
                        <span className="text-muted-foreground">{displayEmail}</span>
                      </span>
                    )}
                    {displayLocation && (
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
                        <SafeIcon name="MapPin" size={16} className="text-primary" />
                        <span className="text-muted-foreground">{displayLocation}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full lg:w-auto border-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Link to="/user-dashboard">
                  <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SafeIcon name="CheckCircle2" size={18} className="text-primary" />
                  <span className="font-semibold text-sm">Profile Completion</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {profileCompletion}%
                </span>
              </div>
              <div className="relative w-full bg-secondary/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 shadow-lg shadow-primary/30 relative overflow-hidden"
                  style={{ width: `${profileCompletion}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              {profileCompletion < 100 && (
                <p className="text-xs text-muted-foreground">
                  Complete your profile to increase your visibility to employers
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Management Sections Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Manage Your Profile</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Organize and update your professional information
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileSections.map((section, index) => (
              <div
                key={section.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProfileOverviewCard section={section} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
