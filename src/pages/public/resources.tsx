import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
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

  return (
    <BaseLayout title="Resources - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Resources</h1>
                <p className="text-xl text-muted-foreground">
                  Tools and guides to help you succeed in your job search
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RESOURCES.map((resource) => (
                  <Card
                    key={resource.href}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <SafeIcon
                            name={resource.icon}
                            size={20}
                            className="text-primary"
                          />
                        </div>
                        <CardTitle className="text-xl">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
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

              <div className="mt-12 text-center">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>Need More Help?</CardTitle>
                    <CardDescription>
                      Our support team is here to assist you with any questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to="/help-support">Contact Support</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <CommonFooter />
      </div>
    </BaseLayout>
  );
};
