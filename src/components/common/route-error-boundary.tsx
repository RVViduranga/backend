import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { logger } from "@/lib/logger";

interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeGroup: "auth" | "user" | "company";
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      `RouteErrorBoundary (${this.props.routeGroup}) caught an error:`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Navigate to appropriate dashboard based on route group
    const routes = {
      auth: "/login",
      user: "/user-dashboard",
      company: "/company-dashboard",
    };
    window.location.href = routes[this.props.routeGroup];
  };

  getRouteSpecificContent() {
    const { routeGroup, fallbackTitle, fallbackDescription } = this.props;

    const defaultContent = {
      auth: {
        title: "Authentication Error",
        description:
          "We encountered an error on the authentication page. Please try again.",
      },
      user: {
        title: "User Dashboard Error",
        description:
          "We encountered an error on your dashboard. Please try again or return home.",
      },
      company: {
        title: "Company Dashboard Error",
        description:
          "We encountered an error on your company dashboard. Please try again or return home.",
      },
    };

    return {
      title: fallbackTitle || defaultContent[routeGroup].title,
      description:
        fallbackDescription || defaultContent[routeGroup].description,
    };
  }

  render() {
    if (this.state.hasError) {
      const { title, description } = this.getRouteSpecificContent();

      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <SafeIcon
                  name="AlertTriangle"
                  size={32}
                  className="text-destructive"
                />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && import.meta.env.DEV && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <SafeIcon name="Home" size={16} className="mr-2" />
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  <SafeIcon name="RefreshCw" size={16} className="mr-2" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;

