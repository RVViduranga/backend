import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SafeIcon from "@/components/common/safe-icon";
import JobPostBreadcrumb from "./JobPostBreadcrumb";
import { type JobPostInputModel } from "@/models/job-data-forms";
import {
  JOB_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  LOCATION_OPTIONS,
} from "@/constants/job-forms";

export default function JobPostForm() {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formData, setFormData] = useState<JobPostInputModel>({
    title: "",
    description: "",
    requirements: [],
    salaryMin: 0,
    salaryMax: 0,
    location: "",
    jobType: "",
    experienceLevel: "",
    applicationDeadline: "",
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Salary") ? (value ? parseInt(value) : 0) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    if (formData.requirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed";
    }
    if (formData.salaryMin <= 0) {
      newErrors.salaryMin = "Minimum salary must be greater than 0";
    }
    if (formData.salaryMax <= 0) {
      newErrors.salaryMax = "Maximum salary must be greater than 0";
    }
    if (formData.salaryMin > formData.salaryMax) {
      newErrors.salaryMax = "Maximum salary must be greater than minimum";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndReview = () => {
    if (validateForm()) {
      // Store form data in sessionStorage for the review page
      sessionStorage.setItem("jobPostFormData", JSON.stringify(formData));
      navigate("/job-post-review");
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    navigate("/company-dashboard");
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card className="mb-6 bg-gradient-to-r from-primary/5 via-primary/5 to-background border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <span className="font-semibold text-sm">Job Details</span>
              </div>
              <SafeIcon name="ChevronRight" size={18} className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/30 text-muted-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="font-medium text-sm text-muted-foreground">Review</span>
              </div>
              <SafeIcon name="ChevronRight" size={18} className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/30 text-muted-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="font-medium text-sm text-muted-foreground">Publish</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              Step 1 of 3
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Job Posting?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Basic Information Section */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <SafeIcon name="FileText" size={18} className="text-primary" />
            </div>
            Basic Information
          </CardTitle>
          <CardDescription className="mt-1.5">
            Provide the fundamental details about the job position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Senior React Developer"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the role, responsibilities, and what makes this position unique..."
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements Section */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <SafeIcon name="CheckCircle2" size={18} className="text-green-600" />
            </div>
            Requirements
          </CardTitle>
          <CardDescription className="mt-1.5">
            Add the key requirements and qualifications for this position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requirement">Add Requirement *</Label>
            <div className="flex gap-2">
              <Input
                id="requirement"
                placeholder="e.g., 5+ years of React experience"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
                className="px-4"
              >
                <SafeIcon name="Plus" size={18} />
              </Button>
            </div>
          </div>

          {formData.requirements.length > 0 && (
            <div className="space-y-2">
              <Label>Added Requirements ({formData.requirements.length})</Label>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-2 text-sm flex items-center gap-2"
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-1 hover:text-destructive transition-colors"
                      aria-label="Remove requirement"
                    >
                      <SafeIcon name="X" size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {errors.requirements && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <SafeIcon name="AlertCircle" size={14} />
              {errors.requirements}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Salary & Location Section */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <SafeIcon name="DollarSign" size={18} className="text-blue-600" />
            </div>
            Salary & Location
          </CardTitle>
          <CardDescription className="mt-1.5">
            Specify the salary range and work location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary (USD) *</Label>
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                placeholder="50000"
                value={formData.salaryMin || ""}
                onChange={handleInputChange}
                className={errors.salaryMin ? "border-destructive" : ""}
              />
              {errors.salaryMin && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.salaryMin}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary (USD) *</Label>
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                placeholder="120000"
                value={formData.salaryMax || ""}
                onChange={handleInputChange}
                className={errors.salaryMax ? "border-destructive" : ""}
              />
              {errors.salaryMax && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.salaryMax}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => handleSelectChange("location", value)}
            >
              <SelectTrigger
                id="location"
                className={errors.location ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.location}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Details Section */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <SafeIcon name="Briefcase" size={18} className="text-purple-600" />
            </div>
            Job Details
          </CardTitle>
          <CardDescription className="mt-1.5">
            Specify the job type and experience level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => handleSelectChange("jobType", value)}
              >
                <SelectTrigger
                  id="jobType"
                  className={errors.jobType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jobType && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.jobType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  handleSelectChange("experienceLevel", value)
                }
              >
                <SelectTrigger
                  id="experienceLevel"
                  className={errors.experienceLevel ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.experienceLevel}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline *</Label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleInputChange}
              className={errors.applicationDeadline ? "border-destructive" : ""}
            />
            {errors.applicationDeadline && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.applicationDeadline}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helpful Tips Card */}
      <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <SafeIcon name="Lightbulb" size={18} className="text-blue-600" />
            </div>
            Tips for Better Job Postings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <SafeIcon name="CheckCircle2" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm mb-1">Clear Job Title</p>
              <p className="text-sm text-muted-foreground">
                Use specific, descriptive titles that clearly indicate the role and level (e.g., "Senior React Developer" instead of "Developer").
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon name="CheckCircle2" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm mb-1">Detailed Description</p>
              <p className="text-sm text-muted-foreground">
                Include company culture, growth opportunities, and what makes this role unique. Candidates value transparency.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SafeIcon name="CheckCircle2" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm mb-1">Realistic Requirements</p>
              <p className="text-sm text-muted-foreground">
                List essential qualifications only. Overly strict requirements can deter qualified candidates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="outline" onClick={handleCancel} className="px-8 shadow-sm hover:shadow-md transition-shadow">
          <SafeIcon name="X" size={18} className="mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSaveAndReview} className="px-8 shadow-lg hover:shadow-xl transition-shadow">
          <SafeIcon name="ArrowRight" size={18} className="mr-2" />
          Save and Review
        </Button>
      </div>
    </div>
  );
}
