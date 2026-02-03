/**
 * Content Constants
 * Static content for public pages (Resources, FAQ, Company Values, etc.)
 * 
 * Note: These are marked as 🟡 ADMIN MANAGED (CMS / Hybrid) in the data architecture audit.
 * For MVP, they are stored in constants, but should eventually be moved to a CMS/backend.
 */

/**
 * Resource items for the Resources page
 */
export interface ResourceItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
}

export const RESOURCES: ResourceItem[] = [
  {
    title: "Career Advice",
    description:
      "Expert tips and guides to help you navigate your career journey",
    icon: "BookOpen",
    href: "/career-advice",
    comingSoon: true,
  },
  {
    title: "Resume Builder",
    description: "Create a professional resume that stands out to employers",
    icon: "FileText",
    href: "/resume-builder",
    comingSoon: true,
  },
  {
    title: "Salary Guide",
    description: "Find out what you should be earning in your field",
    icon: "TrendingUp",
    href: "/salary-guide",
    comingSoon: true,
  },
  {
    title: "Interview Tips",
    description: "Prepare for your next job interview with confidence",
    icon: "Users",
    href: "/jobs",
  },
  {
    title: "Job Search Tips",
    description: "Learn how to find and apply for the best opportunities",
    icon: "Search",
    href: "/jobs",
  },
  {
    title: "Help & Support",
    description:
      "Get help with your account or find answers to common questions",
    icon: "HelpCircle",
    href: "/help-support",
  },
] as const;

/**
 * FAQ Item structure
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Category structure
 */
export interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

/**
 * FAQ Categories for the Help & Support page
 */
export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "Getting Started",
    icon: "Rocket",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Click on 'Sign Up' and choose between email or Google signup. Fill in your details to get started.",
      },
      {
        question: "How do I complete my profile?",
        answer:
          "Go to Profile Management and fill in your personal details, education, and work experience.",
      },
      {
        question: "How do I upload my CV?",
        answer:
          "Navigate to CV Management from your dashboard and click 'Upload CV' to add your resume.",
      },
    ],
  },
  {
    title: "Job Applications",
    icon: "FileText",
    items: [
      {
        question: "How do I apply for a job?",
        answer:
          "Browse jobs, click on a job you're interested in, and click 'Apply Now'. Fill in the application form and submit.",
      },
      {
        question: "How do I track my applications?",
        answer:
          "Go to 'My Applications' from your dashboard to see all your applications and their status.",
      },
      {
        question: "Can I edit my application after submitting?",
        answer:
          "Unfortunately, applications cannot be edited after submission. Please review carefully before submitting.",
      },
    ],
  },
  {
    title: "Account Settings",
    icon: "Settings",
    items: [
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings > Security to update your password. You'll need your current password to make changes.",
      },
      {
        question: "How do I update my email?",
        answer:
          "Email addresses cannot be changed directly. Please contact support if you need to update your email.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Go to Settings > Danger Zone and click 'Delete Account'. This action is permanent and cannot be undone.",
      },
    ],
  },
] as const;

/**
 * Contact Option structure
 */
export interface ContactOption {
  title: string;
  description: string;
  icon: string;
  action: string;
  href: string;
}

/**
 * Contact Options for the Help & Support page
 */
export const CONTACT_OPTIONS: ContactOption[] = [
  {
    title: "Email Support",
    description: "Send us an email and we'll get back to you within 24 hours",
    icon: "Mail",
    action: "support@jobcenter.com",
    href: "mailto:support@jobcenter.com",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: "MessageCircle",
    action: "Start Chat",
    href: "#",
  },
  {
    title: "Help Center",
    description: "Browse our comprehensive documentation",
    icon: "BookOpen",
    action: "Browse Articles",
    href: "#",
  },
] as const;

/**
 * Company Value structure
 */
export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

/**
 * Company Values for the About page
 */
export const COMPANY_VALUES: CompanyValue[] = [
  {
    title: "Transparency",
    description: "We believe in honest, clear communication between job seekers and employers",
    icon: "Eye",
  },
  {
    title: "Innovation",
    description: "We continuously improve our platform to provide the best experience",
    icon: "Sparkles",
  },
  {
    title: "Inclusivity",
    description: "We're committed to creating opportunities for everyone, everywhere",
    icon: "Users",
  },
  {
    title: "Excellence",
    description: "We strive for excellence in everything we do",
    icon: "Star",
  },
] as const;
