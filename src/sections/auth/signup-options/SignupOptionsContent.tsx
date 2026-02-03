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

export default function SignupOptionsContent() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <SafeIcon name="Briefcase" size={24} color="white" />
            </div>
            <span className="font-bold text-2xl">JobCenter</span>
          </div>

          {/* Signup Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Choose how you'd like to sign up and start your job search
                journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Signup Option */}
              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base"
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

              {/* Google Signup Option */}
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

              {/* Divider */}
              <Separator className="my-2" />

              {/* Login Link */}
              <div className="text-center">
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

              {/* Company Signup Link */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Are you a company?
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/company-registration">Register as Employer</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

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

      {/* Right Side - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-8">
        <div className="max-w-md text-center text-primary-foreground space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <SafeIcon name="Users" size={48} />
          </div>
          <h2 className="text-3xl font-bold">Join Our Community</h2>
          <p className="text-lg text-primary-foreground/90">
            Connect with thousands of job seekers and find opportunities that
            match your skills and aspirations.
          </p>

          {/* Benefits */}
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <SafeIcon name="CheckCircle2" size={16} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Access Exclusive Jobs</p>
                <p className="text-sm text-primary-foreground/80">
                  Browse thousands of job listings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <SafeIcon name="CheckCircle2" size={16} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Build Your Profile</p>
                <p className="text-sm text-primary-foreground/80">
                  Showcase your skills and experience
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                <SafeIcon name="CheckCircle2" size={16} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Get Matched</p>
                <p className="text-sm text-primary-foreground/80">
                  Receive personalized job recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-primary-foreground/20">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-xs text-primary-foreground/80">
                Active Jobs
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-xs text-primary-foreground/80">
                Companies
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-xs text-primary-foreground/80">
                Job Seekers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
