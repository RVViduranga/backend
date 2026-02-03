import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useUser } from "@/hooks/use-user-context";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";
import authService from "@/services/auth";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function UserSettingsContent() {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading, updateProfile } = useUser();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    location: "",
    emailNotifications: true,
    applicationAlerts: true,
    jobRecommendations: true,
    weeklyDigest: false,
    marketingEmails: false,
    profileVisibility: "public" as "public" | "private",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load profile data from context
  useEffect(() => {
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!settings.phone?.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        phone: settings.phone,
        location: settings.location,
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      logger.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
      }));
    }
  };

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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={settings.location}
                    onChange={(e) =>
                      setSettings({ ...settings, location: e.target.value })
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="application-alerts">Application Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when employers view or respond to your
                    applications
                  </p>
                </div>
                <Switch
                  id="application-alerts"
                  checked={settings.applicationAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, applicationAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="job-recommendations">
                    Job Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized job recommendations
                  </p>
                </div>
                <Switch
                  id="job-recommendations"
                  checked={settings.jobRecommendations}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, jobRecommendations: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of new job opportunities
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, weeklyDigest: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and services
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, marketingEmails: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <RadioGroup
                  value={settings.profileVisibility}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      profileVisibility: value as "public" | "private",
                    })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal cursor-pointer">
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="font-normal cursor-pointer">
                      Private
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  {settings.profileVisibility === "public"
                    ? "Your profile is visible to all employers"
                    : "Your profile is only visible when you apply for jobs"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Change Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Update your account password for better security
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

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
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

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to delete your account? This
                action cannot be undone. This will permanently delete your
                account and all of your data, including:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Your profile information</li>
                  <li>All job applications</li>
                  <li>Saved jobs and preferences</li>
                  <li>Uploaded CVs and documents</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    // Call auth service to delete account
                    await authService.deleteAccount();
                    
                    // Clear local storage/session
                    logout();
                    
                    // Redirect to home page
                    navigate("/");
                    
                    toast.success("Account deleted successfully");
                  } catch (error) {
                    logger.error("Error deleting account:", error);
                    toast.error("Failed to delete account. Please try again.");
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteDialog(false);
                  }
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <SafeIcon
                      name="Loader2"
                      size={16}
                      className="mr-2 animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
