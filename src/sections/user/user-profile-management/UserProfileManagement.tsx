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
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { formatRelativeDate } from "@/utils/date";

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

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let completedFields = 0;
    const totalFields = 6; // fullName, email, phone, location, experience, education

    if (profile.fullName) completedFields++;
    if (profile.email) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.location) completedFields++;
    if (profile.experience && profile.experience.length > 0) completedFields++;
    if (profile.education && profile.education.length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }, [profile]);

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
          { label: "CVs Uploaded", value: profile?.cvUploaded ? 1 : 0 },
          {
            label: "Primary CV",
            value: profile?.cvUploaded ? "Uploaded" : "Not uploaded",
          },
        ],
      },
      {
        id: "media",
        title: "Profile Media",
        description:
          "Upload profile photos, portfolio items, and other media to enhance your profile.",
        icon: "Image",
        href: "/profile-media-management",
        buttonText: "Manage Media",
        stats: [
          {
            label: "Profile Photo",
            value: profile?.avatarUrl ? "Uploaded" : "Not uploaded",
          },
          { label: "Portfolio Items", value: "View details" },
        ],
      },
      {
        id: "details",
        title: "Personal Details",
        description:
          "Update your personal information, contact details, experience, and education.",
        icon: "User",
        href: "/personal-details-edit",
        buttonText: "Edit Details",
        stats: [
          { label: "Profile Completion", value: `${profileCompletion}%` },
          {
            label: "Experience Items",
            value: profile?.experience?.length || 0,
          },
          { label: "Education Items", value: profile?.education?.length || 0 },
        ],
      },
    ],
    [profile, profileCompletion]
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
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage all aspects of your professional profile to enhance your job
            applications.
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                {displayHeadline && (
                  <CardDescription className="text-base">
                    {displayHeadline}
                  </CardDescription>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground pt-2">
                  {displayEmail && (
                    <span className="flex items-center gap-1">
                      <SafeIcon name="Mail" size={16} />
                      {displayEmail}
                    </span>
                  )}
                  {displayLocation && (
                    <span className="flex items-center gap-1">
                      <SafeIcon name="MapPin" size={16} />
                      {displayLocation}
                    </span>
                  )}
                </div>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/user-dashboard">
                  <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Profile Completion</span>
                <span className="text-muted-foreground">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileSections.map((section) => (
            <ProfileOverviewCard key={section.id} section={section} />
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to keep your profile up to date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/cv-upload">
                  <SafeIcon name="Upload" size={16} className="mr-2" />
                  Upload CV
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/profile-photo-upload">
                  <SafeIcon name="Camera" size={16} className="mr-2" />
                  Update Photo
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/portfolio-upload">
                  <SafeIcon name="Briefcase" size={16} className="mr-2" />
                  Add Portfolio
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/contact-info-edit">
                  <SafeIcon name="Phone" size={16} className="mr-2" />
                  Update Contact
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SafeIcon name="HelpCircle" size={20} />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A complete profile increases your chances of getting hired. Make
              sure to:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <SafeIcon
                  name="CheckCircle2"
                  size={16}
                  className="mt-0.5 text-success flex-shrink-0"
                />
                <span>Upload a professional profile photo</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon
                  name="CheckCircle2"
                  size={16}
                  className="mt-0.5 text-success flex-shrink-0"
                />
                <span>Keep your CV updated with latest experience</span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon
                  name="CheckCircle2"
                  size={16}
                  className="mt-0.5 text-success flex-shrink-0"
                />
                <span>
                  Complete all personal details and contact information
                </span>
              </li>
              <li className="flex items-start gap-2">
                <SafeIcon
                  name="CheckCircle2"
                  size={16}
                  className="mt-0.5 text-success flex-shrink-0"
                />
                <span>Add portfolio items to showcase your work</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
