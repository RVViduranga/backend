import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import AuthLayout from "@/components/common/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { toast } from "sonner";
import authService from "@/services/auth";
import { logger } from "@/lib/logger";

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call auth service to send password reset email
      await authService.forgotPassword(email);
      
      setIsSubmitted(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      logger.error("Error sending password reset email:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to send password reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <BaseLayout title="Password Reset - JobCenter">
        <AuthLayout
          title="Check Your Email"
          description="We've sent a password reset link to your email address"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <SafeIcon name="Mail" size={32} className="text-primary" />
              </div>
              <CardTitle>Email Sent</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please check your email and click the link to reset your password. If you don't see the email, check your spam folder.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Resend Email
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AuthLayout>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Forgot Password - JobCenter">
      <AuthLayout
        title="Reset Your Password"
        description="Enter your email address and we'll send you a link to reset your password"
      >
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <SafeIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <SafeIcon name="Mail" size={16} className="mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
              <div className="text-center">
                <Button asChild variant="link" type="button">
                  <Link to="/login">
                    <SafeIcon name="ArrowLeft" size={14} className="mr-1" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>
    </BaseLayout>
  );
};

