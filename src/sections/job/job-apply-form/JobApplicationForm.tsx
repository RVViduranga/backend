import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/safe-icon";
import { formatDate } from "@/utils/date";
import JobApplicationBreadcrumb from "./JobApplicationBreadcrumb";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { useCandidateApplicationContext } from "@/hooks/use-candidate-application-context";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { useUser } from "@/hooks/use-user-context";
import { Loader2 } from "lucide-react";
import type { JobApplicationData } from "@/services/job";
import { ALLOWED_CV_MIME_TYPES } from "@/constants/app";

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  coverLetter: string;
  resumeFile: File | null;
}

export default function JobApplicationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applyForJob: submitApplication } = useCandidateApplicationContext();
  const { job, isLoading, isError, error } = useJobQuery({ jobId: id });
  const { profile } = useUser();

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    coverLetter: "",
    resumeFile: null,
  });

  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs for scrolling to errors
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: Record<string, React.RefObject<HTMLElement>> = {
    fullName: fullNameRef,
    email: emailRef,
    phone: phoneRef,
    location: locationRef,
    resumeFile: resumeRef,
    coverLetter: coverLetterRef,
  };

  // Phone validation regex (supports various formats)
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.resumeFile) {
      newErrors.resumeFile = "Please upload your resume";
    }
    if (formData.coverLetter.length > 1000) {
      newErrors.coverLetter = "Cover letter must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.fullName || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
        location: prev.location || profile.location || "",
      }));
    }
  }, [profile]);

  // Scroll to first error field
  useEffect(() => {
    if (Object.keys(errors).length > 0 && !isSubmitting) {
      const firstErrorField = Object.keys(errors)[0];
      const fieldRef = fieldRefs[firstErrorField];
      if (firstErrorField && fieldRef?.current) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          fieldRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Focus the input if it's an input or textarea element
          if (
            fieldRef.current instanceof HTMLInputElement ||
            fieldRef.current instanceof HTMLTextAreaElement
          ) {
            fieldRef.current.focus();
          }
        }, 100);
      }
    }
  }, [errors, isSubmitting]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_CV_MIME_TYPES.includes(file.type as typeof ALLOWED_CV_MIME_TYPES[number])) {
        setErrors((prev) => ({
          ...prev,
          resumeFile: "Please upload a PDF or Word document",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resumeFile: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
      }));
      setResumeFileName(file.name);
      setErrors((prev) => ({
        ...prev,
        resumeFile: "",
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
    }));
    setResumeFileName("");
    setUploadProgress(0);
    // Reset file input
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!id || !job) {
      toast.error("Job information is missing. Please try again.");
      return;
    }

    if (!formData.resumeFile) {
      toast.error("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      // Submit application via context (which handles service call and state refresh)
      const applicationData: JobApplicationData = {
        jobId: id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        resumeFile: formData.resumeFile,
        location: formData.location || undefined,
      };

      const response = await submitApplication(applicationData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status === "success") {
        toast.success("Application submitted successfully!");
        // Navigate to confirmation page
        setTimeout(() => {
          navigate("/application-confirmation", {
            state: { jobId: id, jobTitle: job.title },
          });
        }, 500);
      } else {
        throw new Error(response.message || "Application submission failed");
      }
    } catch (error) {
      logger.error("Application submission error:", error);
      toast.error("Failed to submit application. Please try again.");
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit application. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const coverLetterCharCount = formData.coverLetter.length;
  const isNearLimit = coverLetterCharCount >= 900;
  const isAtLimit = coverLetterCharCount >= 1000;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-12">
          <SafeIcon
            name="AlertCircle"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Job not found</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || "The job you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <JobApplicationBreadcrumb />

      {/* Back Button - Mobile */}
      <Link
        to={`/jobs/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors lg:hidden"
      >
        <SafeIcon name="ArrowLeft" size={16} aria-hidden="true" />
        Back to Job Details
      </Link>

      {/* Job Context Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <SafeIcon name="Building2" size={18} aria-hidden="true" />
                {job.company.name}
              </span>
              <span className="flex items-center gap-2">
                <SafeIcon name="MapPin" size={18} aria-hidden="true" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <SafeIcon name="Briefcase" size={18} aria-hidden="true" />
                {job.jobType}
              </span>
            </div>
          </div>
          <Button variant="outline" asChild className="hidden lg:inline-flex">
            <Link to={`/jobs/${id}`}>
              <SafeIcon
                name="ArrowLeft"
                size={16}
                className="mr-2"
                aria-hidden="true"
              />
              Back to Job Details
            </Link>
          </Button>
        </div>
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Application</CardTitle>
          <CardDescription>
            Fill in your details below to apply for this position. All fields
            marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive">
                <SafeIcon name="AlertCircle" size={16} aria-hidden="true" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <SafeIcon name="User" size={20} aria-hidden="true" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    ref={fullNameRef}
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    ref={phoneRef}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    ref={locationRef}
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Colombo"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <SafeIcon name="FileText" size={20} aria-hidden="true" />
                Cover Letter
              </h3>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                  ref={coverLetterRef}
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={6}
                  className="resize-none"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      isNearLimit
                        ? "text-destructive font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {coverLetterCharCount}/1000 characters
                    {isNearLimit && !isAtLimit && " (approaching limit)"}
                  </p>
                  {errors.coverLetter && (
                    <p className="text-sm text-destructive">
                      {errors.coverLetter}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className="space-y-4" ref={resumeRef}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <SafeIcon name="Upload" size={20} aria-hidden="true" />
                Resume/CV
              </h3>

              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume *</Label>
                {resumeFileName ? (
                  // File Selected State
                  <div className="border-2 border-border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <SafeIcon
                          name="FileText"
                          size={24}
                          className="text-primary flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {resumeFileName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.resumeFile
                              ? `(${(
                                  formData.resumeFile.size /
                                  1024 /
                                  1024
                                ).toFixed(2)} MB)`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        className="flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <SafeIcon
                          name="X"
                          size={16}
                          className="mr-2"
                          aria-hidden="true"
                        />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  // File Upload Area
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer block">
                      <div className="flex flex-col items-center gap-2">
                        <SafeIcon
                          name="FileUp"
                          size={32}
                          className="text-muted-foreground"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-semibold text-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF or Word document (max 5MB)
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
                {errors.resumeFile && (
                  <p className="text-sm text-destructive">
                    {errors.resumeFile}
                  </p>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadProgress === 100 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                    <SafeIcon
                      name="CheckCircle2"
                      size={18}
                      aria-hidden="true"
                    />
                    Resume uploaded successfully
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                asChild
              >
                <Link to={`/jobs/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <SafeIcon
                      name="Loader2"
                      size={18}
                      className="mr-2 animate-spin"
                      aria-hidden="true"
                    />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <SafeIcon
                      name="Send"
                      size={18}
                      className="mr-2"
                      aria-hidden="true"
                    />
                    Submit Application
                  </>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground space-y-2">
              <p className="flex items-start gap-2">
                <SafeIcon
                  name="Info"
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>
                  After submission, you may be asked to complete your profile or
                  log in to track your application.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <SafeIcon
                  name="Lock"
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Your information is secure and will only be used for this
                  application.
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <SafeIcon
                name="Clock"
                size={20}
                className="text-primary mt-1"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Application Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {(job.closingDate || (job as any).applicationDeadline)
                    ? formatDate(job.closingDate || (job as any).applicationDeadline)
                    : "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <SafeIcon
                name="Zap"
                size={20}
                className="text-primary mt-1"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Quick Apply</p>
                <p className="text-sm text-muted-foreground">
                  Takes about 2 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <SafeIcon
                name="Shield"
                size={20}
                className="text-primary mt-1"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Your Privacy</p>
                <p className="text-sm text-muted-foreground">
                  Data is encrypted & secure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
