import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafeIcon from "@/components/common/safe-icon";
import PersonalDetailsForm from "./PersonalDetailsForm";
import ContactInfoSection from "./ContactInfoSection";
import ExperienceEducationSection from "./ExperienceEducationSection";
import { useUser } from "@/hooks/use-user-context";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import type { UserProfileModel } from "@/models/user-profile";

// Transform user profile to match component's expected structure
function getInitialUserData(profile: UserProfileModel) {
  return {
    id: "",
    firstName: profile.fullName.split(" ")[0] || "",
    lastName: profile.fullName.split(" ").slice(1).join(" ") || "",
    email: profile.email,
    phone: profile.phone,
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: profile.location,
    state: "",
    zipCode: "",
    country: "",
    bio: profile.headline,
    contactInfo: {
      email: profile.email,
      phone: profile.phone,
      alternatePhone: "",
      linkedIn: "",
      portfolio: "",
    },
    experience: (profile.experience || []).map((exp, idx) => ({
      id: `exp-${idx + 1}`,
      company: exp.company,
      position: exp.title,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "present",
      description: exp.description,
    })),
    education: (profile.education || []).map((edu, idx) => ({
      id: `edu-${idx + 1}`,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.fieldOfStudy,
      graduationYear: edu.endDate,
    })),
  };
}

export default function PersonalDetailsContent() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(() =>
    profile
      ? getInitialUserData(profile)
      : {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          nationality: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          bio: "",
          contactInfo: {
            email: "",
            phone: "",
            alternatePhone: "",
            linkedIn: "",
            portfolio: "",
          },
          experience: [],
          education: [],
        }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePersonalDetails = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    bio: string;
  }) => {
    setIsSaving(true);
    try {
      // Transform form data to backend-aligned format
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const location = formData.city || "";
      
      // Prepare updates for UserProfileModel
      const updates: Partial<UserProfileModel> = {
        fullName,
        email: formData.email,
        phone: formData.phone,
        location,
        headline: formData.bio || "",
      };

      // Call service to update profile
      await updateProfile(updates);
      
      // Update local state for UI consistency
      setUserData((prev) => ({
        ...prev,
        ...formData,
      }));
      
      toast.success("Personal details updated successfully!");
    } catch (error) {
      logger.error("Error saving personal details:", error);
      toast.error("Failed to save personal details. Please try again.");
      throw error; // Re-throw to let form handle it
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SafeIcon name="User" size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Personal Details</h1>
            <p className="text-muted-foreground">
              Manage your personal and contact information
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <SafeIcon name="FileText" size={16} />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <SafeIcon name="Phone" size={16} />
            <span className="hidden sm:inline">Contact Info</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <SafeIcon name="Briefcase" size={16} />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalDetailsForm
                initialData={userData}
                onSave={handleSavePersonalDetails}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <SafeIcon name="Phone" size={20} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your email, phone, and social profiles
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact-info-edit">
                    Edit Contact Info
                    <SafeIcon name="ArrowRight" size={16} className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <SafeIcon name="Briefcase" size={20} />
                  Experience & Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add or update your work experience and education
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/experience-education-edit">
                    Edit Experience/Education
                    <SafeIcon name="ArrowRight" size={16} className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact">
          <ContactInfoSection
            contactInfo={userData.contactInfo}
            onNavigate={() => navigate("/contact-info-edit")}
          />
        </TabsContent>

        {/* Experience & Education Tab */}
        <TabsContent value="experience">
          <ExperienceEducationSection
            experience={userData.experience}
            education={userData.education}
            onNavigate={() => navigate("/experience-education-edit")}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button variant="outline" asChild>
          <Link to="/user-profile-management">
            <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Profile Management
          </Link>
        </Button>
        <Button asChild>
          <Link to="/user-dashboard">
            Go to Dashboard
            <SafeIcon name="ArrowRight" size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
