import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Cookies: React.FC = () => {
  return (
    <BaseLayout title="Cookie Policy - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>What Are Cookies?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Cookies are small text files that are placed on your computer or mobile
                      device when you visit a website. They are widely used to make websites work
                      more efficiently and provide information to the website owners.
                    </p>
                    <p className="text-muted-foreground">
                      JobCenter uses cookies to enhance your browsing experience, analyze site
                      traffic, and personalize content. By continuing to use our website, you
                      consent to our use of cookies as described in this policy.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How We Use Cookies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Essential Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies are necessary for the website to function properly. They
                        enable core functionality such as security, network management, and
                        accessibility. You cannot opt out of essential cookies.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies help us understand how visitors interact with our website
                        by collecting and reporting information anonymously. This helps us improve
                        our website and services.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Functional Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies enable enhanced functionality and personalization, such as
                        remembering your preferences and login status.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies are used to deliver relevant advertisements and track the
                        effectiveness of our marketing campaigns.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Managing Cookies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      You can control and manage cookies in various ways. Please keep in mind that
                      removing or blocking cookies can impact your user experience and parts of
                      our website may no longer be fully accessible.
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">Browser Settings</p>
                      <p className="text-muted-foreground">
                        Most browsers allow you to control cookies through their settings
                        preferences. You can set your browser to refuse cookies or delete certain
                        cookies. However, blocking all cookies may impact your ability to use our
                        website.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Third-Party Cookies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      In addition to our own cookies, we may also use various third-party cookies
                      to report usage statistics of the website, deliver advertisements, and so on.
                      These third parties may use cookies to collect information about your online
                      activities across different websites.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Updates to This Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We may update this Cookie Policy from time to time to reflect changes in
                      technology, legislation, or our data use practices. We will notify you of
                      any material changes by posting the new policy on this page.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about our use of cookies, please contact us:
                    </p>
                    <div className="space-y-2">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:privacy@jobcenter.lk" className="text-primary hover:underline">
                          privacy@jobcenter.lk
                        </a>
                      </p>
                      <p>
                        <strong>Address:</strong> Colombo 05, Sri Lanka
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4 justify-center pt-4">
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <CommonFooter />
      </div>
    </BaseLayout>
  );
};

