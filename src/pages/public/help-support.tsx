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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SafeIcon from "@/components/common/safe-icon";
import { FAQ_CATEGORIES, CONTACT_OPTIONS } from "@/constants/content";

export const HelpSupport: React.FC = () => {

  return (
    <BaseLayout title="Help & Support - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
                <p className="text-xl text-muted-foreground">
                  Find answers to common questions or get in touch with our
                  support team
                </p>
              </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {CONTACT_OPTIONS.map((option, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow flex flex-col"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <SafeIcon
                          name={option.icon as any}
                          size={20}
                          className="text-primary"
                        />
                      </div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {option.href.startsWith("mailto:") ? (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={option.href}>
                          <SafeIcon name="Mail" size={16} className="mr-2" />
                          {option.action}
                        </a>
                      </Button>
                    ) : option.href === "#" ? (
                      <Button variant="outline" disabled className="w-full">
                        <SafeIcon
                          name={option.icon as any}
                          size={16}
                          className="mr-2"
                        />
                        {option.action}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={option.href}>
                          <SafeIcon
                            name={option.icon as any}
                            size={16}
                            className="mr-2"
                          />
                          {option.action}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Sections */}
            <div className="space-y-6">
              {FAQ_CATEGORIES.map((category, categoryIndex) => (
                <Card
                  key={categoryIndex}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <SafeIcon
                          name={category.icon as any}
                          size={24}
                          className="text-primary"
                        />
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem
                          key={itemIndex}
                          value={`item-${categoryIndex}-${itemIndex}`}
                          className="border-b"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-semibold">
                              {item.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground pt-2">
                              {item.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

              {/* Still Need Help */}
              <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle>Still Need Help?</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Our support team is here
                    to help.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1 sm:flex-initial">
                      <a href="mailto:support@jobcenter.com">
                        <SafeIcon name="Mail" size={16} className="mr-2" />
                        Contact Support
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 sm:flex-initial"
                    >
                      <Link to="/contact">
                        <SafeIcon
                          name="MessageCircle"
                          size={16}
                          className="mr-2"
                        />
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <CommonFooter />
      </div>
    </BaseLayout>
  );
};
