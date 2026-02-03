import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import PersonalDetailsSection from "./PersonalDetailsSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import { useUser } from "@/hooks/use-user-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";
import type {
  UserProfileModel,
  EducationModel,
  ExperienceModel,
} from "@/models/user-profile";

export default function ProfileForm() {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState("personal");

  // Initialize with empty profile, will be populated from context
  const [profileData, setProfileData] = useState<UserProfileModel>(() => ({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    avatarUrl: "",
    cvUploaded: false,
    experience: [],
    education: [],
  }));
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data from context
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  const handlePersonalDetailsChange = (updates: Partial<UserProfileModel>) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
  };

  const handleEducationChange = (education: EducationModel[]) => {
    setProfileData((prev) => ({ ...prev, education }));
  };

  const handleExperienceChange = (experience: ExperienceModel[]) => {
    setProfileData((prev) => ({ ...prev, experience }));
  };

  const handleSaveAndContinue = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(profileData);
      toast.success("Profile saved successfully!");
      // Navigate to media upload or dashboard
      setTimeout(() => {
        navigate("/profile-media-upload");
      }, 500);
    } catch (error) {
      // PRODUCTION: Use logger for production-safe error logging
      logger.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
      setIsSaving(false);
    }
  };

  const handleManageProfile = () => {
    navigate("/user-profile-management");
  };

  const handleBackToDashboard = () => {
    navigate("/user-dashboard");
  };

  const isFormValid =
    profileData.fullName && profileData.email && profileData.phone;

  if (profileLoading) {
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
        <div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Add your professional details to help employers find you and improve
            your job applications.
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-sm">Profile Information</p>
                  <p className="text-xs text-muted-foreground">
                    Complete your basic details
                  </p>
                </div>
              </div>
              <SafeIcon
                name="CheckCircle2"
                size={20}
                className="text-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
            <CardDescription>
              Update your professional information to help employers understand
              your background and qualifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2"
                >
                  <SafeIcon name="User" size={16} />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2"
                >
                  <SafeIcon name="GraduationCap" size={16} />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2"
                >
                  <SafeIcon name="Briefcase" size={16} />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal" className="space-y-4">
                  <PersonalDetailsSection
                    data={profileData}
                    onChange={handlePersonalDetailsChange}
                  />
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <EducationSection
                    education={profileData.education}
                    onChange={handleEducationChange}
                  />
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <ExperienceSection
                    experience={profileData.experience}
                    onChange={handleExperienceChange}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="w-full sm:w-auto"
            >
              <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={handleManageProfile}
              className="w-full sm:w-auto"
            >
              <SafeIcon name="Settings" size={16} className="mr-2" />
              Manage Profile
            </Button>
          </div>
          <Button
            onClick={handleSaveAndContinue}
            disabled={!isFormValid || isSaving}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <SafeIcon
                  name="Loader2"
                  size={16}
                  className="mr-2 animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                Save and Continue
                <SafeIcon name="ArrowRight" size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>

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
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A complete profile increases your chances of getting hired. Add
              your education and work experience to stand out to employers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
