import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import authService from "@/services/auth";
import { STORAGE_KEYS } from "@/constants";
import { logger } from "@/lib/logger";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function UnifiedLoginForm() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithGoogleAutoDetect,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);
  const googleScriptLoaded = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated) {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          navigate(
            user.userType === "company"
              ? "/company-dashboard"
              : "/user-dashboard",
            { replace: true }
          );
        } catch {
          navigate("/user-dashboard", { replace: true });
        }
      } else {
        navigate("/user-dashboard", { replace: true });
      }
      return;
    }

    // Check for remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const shouldRemember = localStorage.getItem("rememberMe") === "true";
    if (shouldRemember && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Use auto-detect login
      const response = await authService.loginAutoDetect(email, password);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
      }

      // Store tokens and user profile
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      localStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(response.user)
      );

      toast.success("Login successful! Redirecting...");

      // Reload page to update AuthContext, then redirect
      window.location.href =
        response.user.userType === "company"
          ? "/company-dashboard"
          : "/user-dashboard";
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      setErrors({
        general: "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load Google Sign-In script
  useEffect(() => {
    if (!mounted || googleScriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleScriptLoaded.current = true;
    };
    script.onerror = () => {
      logger.error("Failed to load Google Sign-In script");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [mounted]);

  const handleGoogleLogin = async () => {
    if (isLoading || authLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      // For mock mode: Simulate Google login with a default email
      // In production, this would use Google OAuth and extract email from credential
      const mockGoogleEmail = `google.user@example.com`;
      const mockName = "Google User";

      await loginWithGoogleAutoDetect(mockGoogleEmail, mockName);

      toast.success("Login successful! Redirecting...");

      // Get user type from localStorage to determine redirect
      const userStr = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          window.location.href =
            user.userType === "company"
              ? "/company-dashboard"
              : "/user-dashboard";
        } catch {
          window.location.href = "/user-dashboard";
        }
      } else {
        window.location.href = "/user-dashboard";
      }
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      setErrors({
        general: "Google login failed. Please try again.",
      });
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled
            />
          </div>
          <Button className="w-full" disabled>
            Sign In
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email/Password Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        {errors.general && (
          <Alert variant="destructive">
            <SafeIcon name="AlertCircle" size={16} />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            disabled={isLoading}
            className={errors.email ? "border-destructive" : ""}
            autoComplete="email"
            required
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              disabled={isLoading}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              autoComplete="current-password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <SafeIcon
                name={showPassword ? "EyeOff" : "Eye"}
                size={18}
                className="text-muted-foreground"
              />
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || authLoading}
        >
          {isLoading || authLoading ? (
            <>
              <SafeIcon
                name="Loader2"
                size={16}
                className="mr-2 animate-spin"
              />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading || authLoading}
      >
        {isLoading || authLoading ? (
          <>
            <SafeIcon name="Loader2" size={16} className="mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <SafeIcon name="Chrome" size={16} className="mr-2" />
            Sign in with Google
          </>
        )}
      </Button>

      {/* Sign Up Link */}
      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/signup" className="text-primary font-medium hover:underline">
          Sign up here
        </Link>
      </div>
    </div>
  );
}
