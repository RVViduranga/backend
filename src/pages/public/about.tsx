import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { COMPANY_VALUES } from "@/constants/content";

export const About: React.FC = () => {

  return (
    <BaseLayout title="About Us - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">About JobCenter</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Connecting talented professionals with their dream careers in Sri Lanka
                </p>
              </div>

              {/* Mission */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    JobCenter is dedicated to transforming the job search and recruitment experience
                    in Sri Lanka. We believe that finding the right job or the right candidate
                    shouldn't be complicated.
                  </p>
                  <p className="text-muted-foreground">
                    Our platform provides a seamless, user-friendly experience that connects
                    job seekers with employers, making the hiring process efficient, transparent,
                    and effective for everyone involved.
                  </p>
                </CardContent>
              </Card>

              {/* Values */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {COMPANY_VALUES.map((value) => (
                    <Card key={value.title}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <SafeIcon name={value.icon} size={20} className="text-primary" />
                          </div>
                          <CardTitle>{value.title}</CardTitle>
                        </div>
                        <CardDescription>{value.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* What We Do */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">What We Do</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">For Job Seekers</h3>
                    <p className="text-muted-foreground">
                      We provide a comprehensive platform where you can search for jobs, manage
                      your applications, build your profile, and connect with top employers
                      across Sri Lanka.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Employers</h3>
                    <p className="text-muted-foreground">
                      We offer powerful tools to help companies post jobs, manage applications,
                      find qualified candidates, and streamline their hiring process.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <div className="text-center">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle>Join Us Today</CardTitle>
                    <CardDescription>
                      Start your journey with JobCenter and discover endless opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4 justify-center">
                    <Button asChild>
                      <Link to="/signup">Get Started</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Contact Us</Link>
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

