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

export default function LoginOptionsContent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <SafeIcon name="Briefcase" size={28} color="white" />
              </div>
              <span className="font-bold text-3xl">JobCenter</span>
            </div>
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="text-lg text-muted-foreground">
              Choose how you'd like to continue to your account
            </p>
          </div>

          {/* Login Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Login Option */}
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <SafeIcon name="Mail" size={32} className="text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">Email & Password</CardTitle>
                <CardDescription>
                  Sign in with your email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/login">Continue with Email</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Google Login Option */}
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <SafeIcon
                      name="Chrome"
                      size={32}
                      className="text-primary"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl">Google</CardTitle>
                <CardDescription>
                  Sign in with your Google account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/login">Continue with Google</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Option */}
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">New to JobCenter?</CardTitle>
              <CardDescription>
                Create an account to start applying for jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link to="/signup">
                  <SafeIcon name="UserPlus" size={18} className="mr-2" />
                  Create Account
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Company Portal Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Are you a company looking to post jobs?
            </p>
            <Button variant="ghost" asChild>
              <Link
                to="/company-login"
                className="text-primary hover:text-primary/80"
              >
                <SafeIcon name="Building2" size={16} className="mr-2" />
                Go to Employer Portal
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 JobCenter. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/help-support"
                className="hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
