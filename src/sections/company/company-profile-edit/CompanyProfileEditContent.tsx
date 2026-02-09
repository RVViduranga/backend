import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import { useCompany } from "@/hooks/use-company-context";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_MB } from "@/constants/app";

export default function CompanyProfileEditContent() {
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useCompany();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    headquarters: "",
    establishedYear: 0,
    employeeCountRange: "",
    logoUrl: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }

    // Validate file size
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        logoUrl: result, // Store as data URL for preview
      }));
      toast.success("Logo selected successfully");
    };
    reader.readAsDataURL(file);
  };

  // Handle logo button click
  const handleLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        description: profile.description || "",
        website: profile.website || "",
        // Handle both field names for backward compatibility
        headquarters: profile.headquarters || profile.location || "",
        establishedYear: profile.establishedYear || 0,
        employeeCountRange: profile.employeeCountRange || "",
        logoUrl: profile.logoUrl || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(formData);
      toast.success("Company profile updated successfully!");
      navigate("/company-dashboard");
    } catch (error) {
      toast.error("Failed to update company profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-1 p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Company Profile</h1>
          <p className="text-muted-foreground">
            Update your company information to attract the best talent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>Upload your company logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={formData.logoUrl || "/placeholder-company.png"}
                  alt={formData.name || "Company logo"}
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleLogoButtonClick}
                  >
                    <SafeIcon name="Upload" size={16} className="mr-2" />
                    Change Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 200x200px, PNG or JPG (max {MAX_IMAGE_SIZE_MB}MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Company Description *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your company, mission, and values..."
                />
                <p className="text-xs text-muted-foreground">
                  A compelling description helps attract qualified candidates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How candidates can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters *</Label>
                  <Input
                    id="headquarters"
                    required
                    value={formData.headquarters}
                    onChange={(e) =>
                      setFormData({ ...formData, headquarters: e.target.value })
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Additional information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        establishedYear: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCountRange">
                    Employee Count Range
                  </Label>
                  <Input
                    id="employeeCountRange"
                    value={formData.employeeCountRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeCountRange: e.target.value,
                      })
                    }
                    placeholder="e.g., 50-100 employees"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/company-dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
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
                  <SafeIcon name="Save" size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Tips Card */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <SafeIcon
                  name="Lightbulb"
                  size={18}
                  className="text-blue-600"
                />
              </div>
              Tips for Better Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Company Description</p>
                <p className="text-sm text-muted-foreground">
                  Write a compelling description that highlights your company
                  culture, mission, and what makes you unique. This helps
                  attract the right candidates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Company Logo</p>
                <p className="text-sm text-muted-foreground">
                  Use a high-quality logo that represents your brand. A
                  professional logo increases trust and recognition.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <SafeIcon
                name="CheckCircle2"
                size={18}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-medium text-sm mb-1">Complete Information</p>
                <p className="text-sm text-muted-foreground">
                  Fill in all fields to provide candidates with a complete
                  picture of your company. More information leads to
                  better-matched applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
