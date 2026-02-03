/**
 * Pricing Constants
 * Pricing plans configuration for the Pricing page
 * 
 * Note: This is marked as 🟡 ADMIN MANAGED (CMS / Hybrid) in the data architecture audit.
 * For MVP, it is stored in constants, but should eventually be manageable via admin panel/backend.
 */

/**
 * Pricing Plan structure
 */
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

/**
 * Pricing Plans
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "Rs. 15,000",
    period: "per month",
    description: "Perfect for small businesses just getting started",
    features: [
      "Post up to 5 jobs",
      "View applications",
      "Basic company profile",
      "Email support",
      "Access to job board",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "Rs. 35,000",
    period: "per month",
    description: "Ideal for growing companies with active hiring needs",
    features: [
      "Post up to 25 jobs",
      "Advanced application management",
      "Featured job listings",
      "Priority support",
      "Advanced analytics",
      "Company branding",
      "Resume database access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For large organizations with extensive hiring needs",
    features: [
      "Unlimited job postings",
      "Dedicated account manager",
      "Custom integrations",
      "24/7 priority support",
      "Advanced analytics & reporting",
      "Multi-user accounts",
      "Custom branding",
      "API access",
    ],
    popular: false,
  },
] as const;
