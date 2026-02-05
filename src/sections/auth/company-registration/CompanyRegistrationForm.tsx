import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import type { CompanyRegistrationModel } from "@/models/auth";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Education",
  "Hospitality",
  "Real Estate",
  "Consulting",
  "Media & Entertainment",
  "Transportation",
  "Energy",
  "Other",
];

interface FormErrors {
  companyName?: string;
  industry?: string;
  website?: string;
  address?: string; // ✅ Added
  phone?: string; // ✅ Added
  location?: string; // ✅ Added
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();
  const { registerCompany, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<CompanyRegistrationModel>({
    companyName: "",
    industry: "",
    website: "",
    address: "", // ✅ Added
    phone: "", // ✅ Added
    location: "", // ✅ Added
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/company-dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone: string): boolean => {
    // Basic phone validation: allows digits, spaces, dashes, parentheses, plus sign
    const phoneRegex = /^[\d\s\-()+]+$/;
    const digitsOnly = phone.replace(/\D/g, "");
    return phoneRegex.test(phone) && digitsOnly.length >= 8;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CompanyRegistrationModel) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev: CompanyRegistrationModel) => ({
      ...prev,
      industry: value,
    }));
    if (errors.industry) {
      setErrors((prev) => ({
        ...prev,
        industry: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Use registerCompany for full company registration with all fields
      await registerCompany({
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        address: formData.address,
        phone: formData.phone,
        location: formData.location,
        email: formData.email,
        password: formData.password,
      });
      
      toast.success("Registration successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/company-dashboard", { replace: true });
      }, 500);
    } catch (error: any) {
      // Extract error message from API response or use default
      let errorMessage = "Registration failed. Please try again.";
      
      if (error?.response?.data?.message) {
        // Backend returned an error message
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Error object has a message
        errorMessage = error.message;
      } else if (error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
        // Network error - backend not running
        errorMessage = "Cannot connect to server. Please ensure the backend server is running.";
      }
      
      console.error("Company registration error:", error);
      toast.error(errorMessage);
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <SafeIcon name="Building2" size={28} color="white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Register Your Company</CardTitle>
            <CardDescription className="text-base">
              Create an account to start posting job vacancies and finding top
              talent
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errors.general && (
              <Alert variant="destructive" className="mb-6">
                <SafeIcon name="AlertCircle" size={16} className="mr-2" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-base font-medium">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-base font-medium">
                  Industry *
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger
                    id="industry"
                    disabled={isLoading}
                    className={errors.industry ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.industry}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base font-medium">
                  Company Website *
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.website ? "border-destructive" : ""}
                />
                {errors.website && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.website}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-medium">
                  Company Address *
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main Street, City"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+94 11 234 5678"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-medium">
                  Location *
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Colombo, Sri Lanka"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Company Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.password}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-medium"
                >
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <SafeIcon
                  name="Info"
                  size={18}
                  className="text-muted-foreground mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-muted-foreground">
                  By registering, you agree to our{" "}
                  <Link
                    to="/terms-of-service"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <SafeIcon
                      name="Loader2"
                      size={18}
                      className="mr-2 animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <SafeIcon name="UserPlus" size={18} className="mr-2" />
                    Create Company Account
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/company-login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Log in here
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Looking for a job?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Job seeker login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <SafeIcon name="Zap" size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Quick Setup</h3>
            <p className="text-xs text-muted-foreground">
              Get started in minutes
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <SafeIcon name="Users" size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Find Talent</h3>
            <p className="text-xs text-muted-foreground">
              Access thousands of candidates
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <SafeIcon name="Shield" size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Secure & Safe</h3>
            <p className="text-xs text-muted-foreground">
              Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
