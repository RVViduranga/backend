import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SafeIcon from "@/components/common/safe-icon";
import { useAuth } from "@/hooks/use-auth-context";
import {
  MAIN_NAV_LINKS_USER,
  MAIN_NAV_LINKS_COMPANY,
} from "@/constants/navigation";
import { toast } from "sonner";

interface CommonHeaderProps {
  variant?: "default" | "authenticated" | "company";
}

export default function CommonHeader({
  variant = "default",
}: CommonHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated: authIsAuthenticated, logout } = useAuth();

  // Use AuthContext if available, fallback to variant prop
  const isAuthenticated =
    authIsAuthenticated || variant === "authenticated" || variant === "company";
  const isCompany = user?.userType === "company" || variant === "company";

  const mainNavLinks = isCompany ? MAIN_NAV_LINKS_COMPANY : MAIN_NAV_LINKS_USER;

  // Determine logo link destination
  const logoHref = isAuthenticated
    ? isCompany
      ? "/company-dashboard"
      : "/user-dashboard"
    : "/jobs";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to={logoHref}
          className="flex items-center space-x-2.5 group transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1 -ml-1"
          aria-label="JobCenter home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow duration-200">
            <SafeIcon name="Briefcase" size={21} color="white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-200">
            JobCenter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1"
          aria-label="Main navigation"
        >
          {mainNavLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              location.pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-muted/80 transition-all duration-200"
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Link to="/signup">
                  Sign Up
                </Link>
              </Button>
              {!isCompany && (
                <Button
                  variant="secondary"
                  asChild
                  className="hover:bg-secondary/80 transition-all duration-200"
                >
                  <Link to="/company-login">For Employers</Link>
                </Button>
              )}
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.name ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground shadow-md">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  ) : (
                    <SafeIcon name="User" size={18} aria-hidden="true" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg mb-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold leading-none">
                        {user?.name || user?.email || "My Account"}
                      </p>
                      {user?.userType && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-semibold border border-primary/20">
                          {user.userType === "company"
                            ? "Employer"
                            : "Job Seeker"}
                        </span>
                      )}
                    </div>
                    {user?.email && user?.name && (
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="rounded-md hover:bg-primary/5 cursor-pointer"
                >
                  <Link
                    to={isCompany ? "/company-dashboard" : "/user-dashboard"}
                    className="flex items-center"
                  >
                    <SafeIcon
                      name="LayoutDashboard"
                      size={16}
                      className="mr-2.5 text-primary"
                      aria-hidden="true"
                    />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {!isCompany && (
                  <DropdownMenuItem
                    asChild
                    className="rounded-md hover:bg-primary/5 cursor-pointer"
                  >
                    <Link
                      to="/user-profile-management"
                      className="flex items-center"
                    >
                      <SafeIcon
                        name="User"
                        size={16}
                        className="mr-2.5 text-primary"
                        aria-hidden="true"
                      />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  asChild
                  className="rounded-md hover:bg-primary/5 cursor-pointer"
                >
                  <Link
                    to={isCompany ? "/company-settings" : "/user-settings"}
                    className="flex items-center"
                  >
                    <SafeIcon
                      name="Settings"
                      size={16}
                      className="mr-2.5 text-primary"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                    navigate("/jobs");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-md cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <SafeIcon
                    name="LogOut"
                    size={16}
                    className="mr-2.5"
                    aria-hidden="true"
                  />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="h-10 w-10 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <SafeIcon name="Menu" size={24} aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[320px] sm:w-[400px] bg-gradient-to-b from-background to-muted/20"
          >
            <nav
              className="flex flex-col space-y-2 mt-8"
              aria-label="Mobile navigation"
            >
              {mainNavLinks.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  location.pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-6 border-t border-border/50 space-y-3 mt-4">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-muted/80 transition-all duration-200"
                      asChild
                    >
                      <Link
                        to={isCompany ? "/company-login" : "/login"}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log In
                      </Link>
                    </Button>
                    <Button
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                      asChild
                    >
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                    {!isCompany && (
                      <Button
                        variant="secondary"
                        className="w-full h-11 hover:bg-secondary/80 transition-all duration-200"
                        asChild
                      >
                        <Link
                          to="/company-login"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          For Employers
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="pb-3 mb-3 border-b border-border/50">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                        {user?.name ? (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground flex-shrink-0 shadow-md">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted flex-shrink-0">
                            <SafeIcon name="User" size={20} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {user?.name || user?.email || "My Account"}
                          </p>
                          {user?.userType && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {user.userType === "company"
                                ? "Employer"
                                : "Job Seeker"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-11 rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      asChild
                    >
                      <Link
                        to={
                          isCompany ? "/company-dashboard" : "/user-dashboard"
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SafeIcon
                          name="LayoutDashboard"
                          size={16}
                          className="mr-2.5"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                    </Button>
                    {!isCompany && (
                      <Button
                        variant="outline"
                        className="w-full justify-start h-11 rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        asChild
                      >
                        <Link
                          to="/user-profile-management"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <SafeIcon
                            name="User"
                            size={16}
                            className="mr-2.5"
                            aria-hidden="true"
                          />
                          Profile
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start h-11 rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      asChild
                    >
                      <Link
                        to={isCompany ? "/company-settings" : "/user-settings"}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SafeIcon
                          name="Settings"
                          size={16}
                          className="mr-2.5"
                          aria-hidden="true"
                        />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start h-11 mt-2 rounded-lg hover:bg-destructive/90 transition-all duration-200"
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                        navigate("/jobs");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <SafeIcon name="LogOut" size={16} className="mr-2.5" />
                      Log Out
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
