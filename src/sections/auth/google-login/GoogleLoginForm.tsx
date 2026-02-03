import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/safe-icon";
import { logger } from "@/lib/logger";

interface GoogleLoginFormProps {
  userType?: "job_seeker" | "company";
}

interface GoogleCredentialResponse {
  credential: string;
}

export default function GoogleLoginForm({
  userType = "job_seeker",
}: GoogleLoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize Google Sign-In script
    const initGoogleSignIn = () => {
      if (typeof window !== "undefined" && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id:
              process.env.PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
            callback: handleGoogleSignIn,
          });
        } catch (err) {
          logger.error("Failed to initialize Google Sign-In:", err);
          setError("Failed to initialize Google Sign-In. Please try again.");
        }
      }
    };

    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleSignIn;
    script.onerror = () => {
      setError("Failed to load Google Sign-In. Please check your connection.");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = async (response: GoogleCredentialResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!response.credential) {
        throw new Error("No credential received from Google");
      }

      // Send token to backend for verification
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.credential,
          userType: userType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await res.json();

      // Store auth token if provided
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect based on user type and profile completion
      if (data.profileComplete) {
        navigate(
          userType === "company" ? "/company-dashboard" : "/user-dashboard"
        );
      } else {
        navigate("/user-profile-setup");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during sign-in";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    if (typeof window !== "undefined" && window.google) {
      try {
        const buttonElement = document.getElementById("google-signin-button");
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            type: "standard",
            size: "large",
            text: "signin_with",
            locale: "en_US",
          });
        }
      } catch (err) {
        logger.error("Failed to render Google button:", err);
        setError("Failed to load Google Sign-In button");
      }
    }
  };

  useEffect(() => {
    if (mounted) {
      handleGoogleButtonClick();
    }
  }, [mounted]);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <SafeIcon name="AlertCircle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign-In Button Container */}
      <div className="flex justify-center">
        <div id="google-signin-button" className="w-full" />
      </div>

      {/* Fallback Button */}
      <Button
        onClick={() => {
          if (typeof window !== "undefined" && window.google) {
            window.google.accounts.id.prompt();
          }
        }}
        disabled={isLoading}
        variant="outline"
        className="w-full h-12"
      >
        {isLoading ? (
          <>
            <SafeIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <SafeIcon name="Chrome" className="mr-2 h-4 w-4" />
            Sign in with Google
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email Login Link */}
      <Button variant="outline" className="w-full" asChild>
        <Link to="/email-login">
          <SafeIcon name="Mail" className="mr-2 h-4 w-4" />
          Sign in with Email
        </Link>
      </Button>

      {/* Back Link */}
      <div className="text-center">
        <Button variant="ghost" asChild>
          <Link to="/login" className="text-sm">
            <SafeIcon name="ArrowLeft" className="mr-1 h-3 w-3" />
            Back to Login Options
          </Link>
        </Button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-center text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link
          to="/terms-of-service"
          className="underline hover:text-foreground"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

// Type augmentation for Google Sign-In
interface GoogleSignInConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonConfig {
  type?: string;
  size?: string;
  text?: string;
  locale?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleSignInConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}
