import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SafeIcon from "@/components/common/safe-icon";
import AuthLayout from "@/components/common/auth-layout";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { Checkbox } from "@/components/ui/checkbox";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function EmailLoginForm() {
  const navigate = useNavigate();
  const {
    login,
    loginWithGoogle,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/user-dashboard", { replace: true });
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

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password, "user");

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/user-dashboard", { replace: true });
      }, 500);
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      setErrors({
        general: "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading || authLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      await loginWithGoogle("user");
      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/user-dashboard", { replace: true });
      }, 500);
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      setErrors({
        general: "Google login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthLayout
      title="Log In with Email"
      description="Enter your email and password to access your account"
      showBranding={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Alert */}
        {errors.general && (
          <Alert variant="destructive">
            <SafeIcon name="AlertCircle" size={16} />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
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
            disabled={isLoading || authLoading}
            className={errors.email ? "border-destructive" : ""}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline"
              disabled={isLoading || authLoading}
            >
              Forgot password?
            </button>
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
              disabled={isLoading || authLoading}
              className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading || authLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <SafeIcon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading || authLoading}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || authLoading}
        >
          {isLoading || authLoading ? (
            <>
              <SafeIcon
                name="Loader2"
                size={18}
                className="mr-2 animate-spin"
              />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading || authLoading}
          onClick={handleGoogleLogin}
        >
          {isLoading || authLoading ? (
            <>
              <SafeIcon
                name="Loader2"
                size={18}
                className="mr-2 animate-spin"
              />
              Signing in...
            </>
          ) : (
            <>
              <SafeIcon name="Chrome" size={18} className="mr-2" />
              Google
            </>
          )}
        </Button>

        {/* Footer Links */}
        <div className="space-y-3 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          <p className="text-muted-foreground">
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Back to login options
            </Link>
          </p>
          <p className="text-muted-foreground">
            <Link
              to="/company-login"
              className="text-primary hover:underline font-medium"
            >
              For employers
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
