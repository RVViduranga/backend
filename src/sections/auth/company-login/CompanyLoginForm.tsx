import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";

export default function CompanyLoginForm() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/company-dashboard", { replace: true });
      return;
    }
    
    // Check for remembered email
    const rememberedEmail = localStorage.getItem("rememberedCompanyEmail");
    const shouldRemember = localStorage.getItem("rememberCompanyMe") === "true";
    if (shouldRemember && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
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
      await login(email, password, "company");
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberCompanyMe", "true");
        localStorage.setItem("rememberedCompanyEmail", email);
      } else {
        localStorage.removeItem("rememberCompanyMe");
        localStorage.removeItem("rememberedCompanyEmail");
      }

      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/company-dashboard", { replace: true });
      }, 500);
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      setErrors({
        email: "Login failed. Please check your credentials.",
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
      await loginWithGoogle("company");
      toast.success("Google login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/company-dashboard", { replace: true });
      }, 500);
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      setErrors({
        email: "Google login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="company@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            disabled={isLoading || authLoading}
            className={errors.email ? "border-destructive" : ""}
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
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
            disabled={isLoading || authLoading}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

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

        <Button type="submit" className="w-full" disabled={isLoading || authLoading} size="lg">
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

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading || authLoading}
        size="lg"
      >
        {isLoading || authLoading ? (
          <>
            <SafeIcon name="Loader2" size={18} className="mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <SafeIcon name="Chrome" size={18} className="mr-2" />
            Sign in with Google
          </>
        )}
      </Button>

      {/* Footer Links */}
      <div className="space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have a company account?{" "}
          <Link
            to="/company-registration"
            className="text-primary font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
        <p className="text-muted-foreground">
          Looking for a job?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign in as a job seeker
          </Link>
        </p>
      </div>
    </div>
  );
}
