import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { PRICING_PLANS } from "@/constants/pricing";

export const Pricing: React.FC = () => {

  return (
    <BaseLayout title="Pricing - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Choose the perfect plan for your hiring needs. All plans include our core
                  features with no hidden fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {PRICING_PLANS.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative ${
                      plan.popular ? "border-primary shadow-lg scale-105" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">
                            {plan.price === "Custom" ? plan.price : plan.price.split(" ")[1]}
                          </span>
                          {plan.price !== "Custom" && (
                            <span className="text-muted-foreground ml-2">
                              {plan.price.split(" ")[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                      </div>
                      <CardDescription className="mt-4">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <SafeIcon
                              name="Check"
                              size={18}
                              className="text-primary mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        <Link to="/company-registration">
                          {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* FAQ Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                    <p className="text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be
                      reflected in your next billing cycle.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                    <p className="text-muted-foreground">
                      We offer a 14-day free trial for all new companies. No credit card required
                      to start.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-muted-foreground">
                      We accept all major credit cards, bank transfers, and mobile payment methods
                      in Sri Lanka.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                    <p className="text-muted-foreground">
                      Yes, we offer a 30-day money-back guarantee if you're not satisfied with
                      our service.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <div className="text-center">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle>Need Help Choosing?</CardTitle>
                    <CardDescription>
                      Our team is here to help you find the perfect plan for your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to="/contact">Contact Sales Team</Link>
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

