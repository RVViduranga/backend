import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SafeIcon from "@/components/common/safe-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth-context";
import {
  CONTACT_METHODS,
  BUSINESS_HOURS,
  SOCIAL_LINKS,
} from "@/constants/app";
import {
  FOOTER_LINKS_BASE,
  FOOTER_LINKS_USER_AUTH,
  FOOTER_LINKS_COMPANY_AUTH,
  FOOTER_LINKS_COMPANY_UNAUTH,
} from "@/constants/footer";
import { usePlatformStatisticsQuery } from "@/hooks/queries/use-platform-statistics-query";
import { useNewsletterMutation } from "@/hooks/mutations/use-newsletter-mutation";
import { toast } from "sonner";

interface CommonFooterProps {
  variant?: "simple" | "full";
}

export default function CommonFooter({ variant = "full" }: CommonFooterProps) {
  const currentYear = new Date().getFullYear();
  const { user, isAuthenticated } = useAuth();
  const isCompany = user?.userType === "company";
  const { statistics } = usePlatformStatisticsQuery(); // Fetches from backend or uses fallback constants
  const { subscribe, isPending: isSubscribing, error: newsletterError } = useNewsletterMutation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe(newsletterEmail);
      toast.success("Successfully subscribed to our newsletter!");
      setNewsletterEmail("");
    } catch (error) {
      // Error is already logged in mutation hook
      const errorMessage = newsletterError?.message || "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build footer links dynamically based on authentication state
  const footerLinks = {
    forJobSeekers: [
      ...FOOTER_LINKS_BASE.forJobSeekers,
      ...(isAuthenticated && !isCompany ? FOOTER_LINKS_USER_AUTH : []),
    ],
    forEmployers: [
      ...FOOTER_LINKS_BASE.forEmployers,
      ...(!isAuthenticated
        ? FOOTER_LINKS_COMPANY_UNAUTH
        : isCompany
        ? FOOTER_LINKS_COMPANY_AUTH
        : []),
    ],
    company: FOOTER_LINKS_BASE.company,
    legal: FOOTER_LINKS_BASE.legal,
  };

  if (variant === "simple") {
    return (
      <footer
        className="border-t border-border/40 bg-background/95 backdrop-blur-sm mt-auto"
        role="contentinfo"
        aria-label="Footer"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} JobCenter. All rights reserved.
            </p>
            <nav aria-label="Footer legal links">
              <div className="flex items-center gap-5">
                {footerLinks.legal.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="border-t bg-slate-50 dark:bg-slate-900 mt-auto relative"
      role="contentinfo"
      aria-label="Footer"
    >
      {/* Return to Top Button - Only show when scrolled */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-6 z-50 h-11 w-11 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 bg-white dark:bg-slate-800 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
          aria-label="Scroll to top"
        >
          <SafeIcon
            name="ArrowUp"
            size={18}
            className="text-primary"
            aria-hidden="true"
          />
        </Button>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-10 max-w-6xl">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            isAuthenticated
              ? isCompany
                ? "lg:grid-cols-4"
                : "lg:grid-cols-4"
              : "lg:grid-cols-5"
          } gap-4 lg:gap-5 mb-8 justify-items-start`}
        >
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3 w-full max-w-[280px]">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
                aria-hidden="true"
              >
                <SafeIcon name="Briefcase" size={18} color="white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                JobCenter
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              Connecting talented professionals with their dream careers in Sri Lanka.
            </p>

            {/* Contact Information */}
            <div className="space-y-2 pt-1">
              {CONTACT_METHODS.map((contact) => (
                <div key={contact.title} className="flex items-start gap-2">
                  <SafeIcon
                    name={contact.icon as any}
                    size={12}
                    className="text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {contact.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Business Hours:</span>
                {BUSINESS_HOURS.weekdays}<br />
                {BUSINESS_HOURS.saturday}
              </p>
            </div>

            <nav aria-label="Social media links">
              <div className="flex items-center gap-1 pt-1.5">
                {SOCIAL_LINKS.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    aria-label={`Visit our ${social.label} page`}
                    className="h-8 w-8 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200"
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in new tab)`}
                    >
                      <SafeIcon
                        name={social.icon}
                        size={16}
                        className="text-slate-600 dark:text-slate-400"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ))}
              </div>
            </nav>
          </div>

          {/* Newsletter Section - Only show on public pages */}
          {!isAuthenticated && (
            <div className="sm:col-span-2 lg:col-span-1 space-y-2 w-full max-w-[220px]">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">
                  Stay Updated
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  Get the latest job opportunities delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="h-9 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubscribing}
                      className="h-9 px-3 text-sm bg-primary hover:bg-primary/90 text-white transition-all duration-200 whitespace-nowrap"
                    >
                      {isSubscribing ? (
                        <>
                          <SafeIcon
                            name="Loader2"
                            size={14}
                            className="mr-1.5 animate-spin"
                          />
                          Subscribe
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We respect your privacy.
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* For Job Seekers - Hide if company user is logged in */}
          {(!isAuthenticated || !isCompany) && (
            <nav aria-labelledby="job-seekers-heading" className="space-y-2 w-full max-w-[180px]">
              <h3
                id="job-seekers-heading"
                className="font-semibold text-xs text-slate-900 dark:text-white mb-3 uppercase tracking-wider"
              >
                For Job Seekers
              </h3>
              <ul className="space-y-2">
                {footerLinks.forJobSeekers.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* For Employers - Hide if job seeker user is logged in */}
          {(!isAuthenticated || isCompany) && (
            <nav aria-labelledby="employers-heading" className="space-y-2 w-full max-w-[180px]">
              <h3
                id="employers-heading"
                className="font-semibold text-xs text-slate-900 dark:text-white mb-3 uppercase tracking-wider"
              >
                For Employers
              </h3>
              <ul className="space-y-2">
                {footerLinks.forEmployers.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Company & Support */}
          <nav aria-labelledby="company-heading" className="space-y-2 w-full max-w-[180px]">
            <h3
              id="company-heading"
              className="font-semibold text-xs text-slate-900 dark:text-white mb-3 uppercase tracking-wider"
            >
              Company & Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-labelledby="legal-heading" className="space-y-2 w-full max-w-[180px]">
            <h3
              id="legal-heading"
              className="font-semibold text-xs text-slate-900 dark:text-white mb-3 uppercase tracking-wider"
            >
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Statistics/Trust Indicators - Fetched from backend analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {statistics.activeJobs}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {statistics.companies}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {statistics.jobSeekers}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {statistics.newJobsDaily}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                New Jobs Daily
              </div>
            </div>
          </div>

          {/* Copyright and Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <p>© {currentYear} JobCenter. All rights reserved.</p>
              <div className="hidden md:block text-slate-400">•</div>
              <p>Registered in Sri Lanka</p>
              <div className="hidden md:block text-slate-400">•</div>
              <Link
                to="/resources"
                className="hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                Made with{" "}
                <SafeIcon
                  name="Heart"
                  size={12}
                  className="inline text-red-500 fill-red-500"
                  aria-hidden="true"
                />
                <span className="sr-only">love</span> in Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
