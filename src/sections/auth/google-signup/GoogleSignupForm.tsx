import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/safe-icon";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

export default function GoogleSignupForm() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithGoogle,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/user-dashboard", { replace: true });
      return;
    }

    // Initialize Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isAuthenticated, navigate]);

  const handleGoogleSignup = async () => {
    if (isLoading || authLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await loginWithGoogle("user");
      toast.success(
        "Account created successfully! Redirecting to profile setup..."
      );
      setTimeout(() => {
        navigate("/user-profile-setup", { replace: true });
      }, 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to sign up with Google. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleEmailSignup = () => {
    navigate("/email-signup");
  };

  const handleBackToSignupOptions = () => {
    navigate("/signup");
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <Button disabled className="w-full" size="lg">
          <SafeIcon name="Loader2" size={18} className="mr-2 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Sign-In Button */}
      <div className="space-y-3">
        <Button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          size="lg"
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <SafeIcon
                name="Loader2"
                size={18}
                className="mr-2 animate-spin"
              />
              Signing up...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>
      </div>

      {/* Email Signup Alternative */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Prefer to sign up with email?
        </p>
        <Button
          onClick={handleEmailSignup}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <SafeIcon name="Mail" size={18} className="mr-2" />
          Sign up with Email
        </Button>
      </div>

      {/* Already have account */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Back Button */}
      <Button
        onClick={handleBackToSignupOptions}
        variant="ghost"
        size="sm"
        className="w-full"
      >
        <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
        Back to Sign Up Options
      </Button>
    </div>
  );
}
