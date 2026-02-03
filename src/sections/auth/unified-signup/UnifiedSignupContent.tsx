import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/safe-icon";

export default function UnifiedSignupContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
            <SafeIcon name="Briefcase" size={28} color="white" />
          </div>
          <span className="font-bold text-3xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            JobCenter
          </span>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Create Your Account
          </h1>
          <p className="text-muted-foreground text-lg">
            Join thousands of job seekers and employers
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Seeker Section */}
          <Card className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <SafeIcon name="User" size={32} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Job Seeker</CardTitle>
              <CardDescription className="text-base pt-2">
                Create your account to find your dream job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Signup */}
              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Link
                  to="/email-signup"
                  className="flex items-center justify-center gap-2"
                >
                  <SafeIcon name="Mail" size={20} />
                  Sign Up with Email
                </Link>
              </Button>

              {/* Divider */}
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              {/* Google Signup */}
              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base"
                variant="outline"
              >
                <Link
                  to="/google-signup"
                  className="flex items-center justify-center gap-2"
                >
                  <SafeIcon name="Chrome" size={20} />
                  Sign Up with Google
                </Link>
              </Button>

              {/* Benefits */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Browse thousands of job listings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Get matched with top employers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Track your applications</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer Section */}
          <Card className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <SafeIcon name="Building2" size={32} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Employer</CardTitle>
              <CardDescription className="text-base pt-2">
                Post jobs and find top talent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Company Registration */}
              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Link
                  to="/company-registration"
                  className="flex items-center justify-center gap-2"
                >
                  <SafeIcon name="Building2" size={20} />
                  Register Your Company
                </Link>
              </Button>

              {/* Benefits */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Post unlimited job listings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Access qualified candidates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SafeIcon
                    name="CheckCircle2"
                    size={16}
                    className="text-primary"
                  />
                  <span>Manage applications easily</span>
                </div>
              </div>

              {/* Already have account */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Already registered?
                </p>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">Log In to Employer Portal</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our{" "}
          <Link to="/terms-of-service" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

