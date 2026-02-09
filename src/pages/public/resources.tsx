import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import { useAuth } from "@/hooks/use-auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { RESOURCES } from "@/constants/content";

export const Resources: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isCompany = user?.userType === "company";

  const content = (
    <div className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <div className="border-b bg-card">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Resources
            </h1>
            <p className="text-base text-muted-foreground">
              Tools and guides to help you succeed in your job search
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {RESOURCES.map((resource) => (
            <Card
              key={resource.href}
              className="hover:shadow-lg transition-all border hover:border-primary/20 h-full flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <SafeIcon
                      name={resource.icon}
                      size={24}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {resource.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                {resource.comingSoon ? (
                  <Button variant="outline" disabled className="w-full">
                    Coming Soon
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link to={resource.href}>Explore</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <div className="max-w-2xl mx-auto pt-8 border-t">
          <Card className="bg-muted/50">
            <CardHeader className="text-center">
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>
                Our support team is here to assist you with any questions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link to="/help-support">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Show sidebar for authenticated users, full page for public users
  if (isAuthenticated) {
    return (
      <BaseLayout title="Resources - JobCenter">
        <CommonHeader variant={isCompany ? "company" : "authenticated"} />
        <ClientSidebarWrapper variant={isCompany ? "company" : "user"} currentPage="/resources">
          {content}
        </ClientSidebarWrapper>
      </BaseLayout>
    );
  }

  // Public page without sidebar
  return (
    <BaseLayout title="Resources - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          {content}
        </main>
        <CommonFooter variant="full" />
      </div>
    </BaseLayout>
  );
};
