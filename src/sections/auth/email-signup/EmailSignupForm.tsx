import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { emailSignupSchema, type EmailSignupInput } from "@/lib/validation";

export default function EmailSignupForm() {
  const navigate = useNavigate();
  const { registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<EmailSignupInput>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      fullName: "", // ✅ Backend uses fullName
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const { handleSubmit, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user-dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: EmailSignupInput) => {
    try {
      // Use registerUser for full user registration - backend expects fullName
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully! Redirecting to profile setup...");
      setTimeout(() => {
        navigate("/user-profile-setup", { replace: true });
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
      
      console.error("Registration error:", error);
      toast.error(errorMessage);
      form.setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Error Alert */}
        {errors.root && (
          <Alert variant="destructive">
            <SafeIcon name="AlertCircle" className="h-4 w-4" />
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  disabled={isSubmitting || authLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  disabled={isSubmitting || authLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    disabled={isSubmitting || authLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || authLoading}
                  >
                    <SafeIcon
                      name={showPassword ? "EyeOff" : "Eye"}
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    disabled={isSubmitting || authLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting || authLoading}
                  >
                    <SafeIcon
                      name={showConfirmPassword ? "EyeOff" : "Eye"}
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms Checkbox */}
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting || authLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  I agree to the{" "}
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
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || authLoading}
        >
          {isSubmitting || authLoading ? (
            <>
              <SafeIcon name="Loader2" size={18} className="mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
