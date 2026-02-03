import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import SafeIcon from "@/components/common/safe-icon";
import ChangePasswordDialog from "@/sections/user/user-settings/ChangePasswordDialog";
import { toast } from "sonner";
import { useCompany } from "@/hooks/use-company-context";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";

export default function CompanySettingsContent() {
  const { profile, isLoading, refreshProfile, updateProfile } = useCompany();
  const [settings, setSettings] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    headquarters: "",
    description: "",
    employeeCount: "",
    emailNotifications: true,
    applicationAlerts: true,
    weeklyDigest: false,
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load company profile data
  useEffect(() => {
    if (!profile) {
      refreshProfile();
    }
  }, [profile, refreshProfile]);

  // Update settings when profile loads
  useEffect(() => {
    if (profile) {
      setSettings({
        companyName: profile.name || "",
        email: "", // Company email not in profile model
        phone: "", // Company phone not in profile model
        website: profile.website || "",
        headquarters: profile.headquarters || "",
        description: profile.description || "",
        employeeCount: profile.employeeCountRange || "",
        emailNotifications: true,
        applicationAlerts: true,
        weeklyDigest: false,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Transform form data to backend-aligned format
      const updates = {
        name: settings.companyName,
        address: settings.headquarters, // Map headquarters to address
        website: settings.website,
        description: settings.description,
        employeeCountRange: settings.employeeCount,
        // Note: email and phone are not in CompanyDetailModel
        // They are UI-only fields for now, can be added to backend schema later
      };

      // Call service to update profile
      await updateProfile(updates);
      
      toast.success("Settings saved successfully!");
    } catch (error) {
      logger.error("Error saving company settings:", error);
      toast.error("Failed to save settings. Please try again.");
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
          <h1 className="text-3xl font-bold mb-2">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage your company profile and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) =>
                      setSettings({ ...settings, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) =>
                      setSettings({ ...settings, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input
                    id="headquarters"
                    value={settings.headquarters}
                    onChange={(e) =>
                      setSettings({ ...settings, headquarters: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    value={settings.employeeCount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        employeeCount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={settings.description}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="applicationAlerts">Application Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new applications are submitted
                  </p>
                </div>
                <Switch
                  id="applicationAlerts"
                  checked={settings.applicationAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, applicationAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of activity
                  </p>
                </div>
                <Switch
                  id="weeklyDigest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, weeklyDigest: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Change Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <SafeIcon name="Lock" size={16} className="mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              <SafeIcon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </form>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </div>
    </div>
  );
}
