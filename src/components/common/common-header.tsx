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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full flex h-14 items-center justify-between">
        {/* Logo - Far Left Corner */}
        <div className="flex items-center flex-shrink-0 pl-4 sm:pl-6 lg:pl-8">
          <Link
            to={logoHref}
            className="flex items-center space-x-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
            aria-label="JobCenter home"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <SafeIcon name="Briefcase" size={18} color="white" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              JobCenter
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav
          className="hidden md:flex items-center space-x-1 flex-1 justify-center"
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
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Actions - Far Right Corner */}
        <div className="hidden md:flex items-center space-x-3 flex-shrink-0 pr-4 sm:pr-6 lg:pr-8">
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="text-sm"
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="text-sm"
              >
                <Link to="/signup">
                  Sign Up
                </Link>
              </Button>
              {!isCompany && (
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="text-sm"
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
                  className="h-9 w-9 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.name ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || user?.email || "My Account"}
                    </p>
                    {user?.email && user?.name && (
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                    {user?.userType && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {user.userType === "company"
                          ? "Employer"
                          : "Job Seeker"}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link
                    to={isCompany ? "/company-dashboard" : "/user-dashboard"}
                    className="flex items-center"
                  >
                    <SafeIcon
                      name="LayoutDashboard"
                      size={16}
                      className="mr-2"
                      aria-hidden="true"
                    />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {!isCompany && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer"
                  >
                    <Link
                      to="/user-profile-view"
                      className="flex items-center"
                    >
                      <SafeIcon
                        name="User"
                        size={16}
                        className="mr-2"
                        aria-hidden="true"
                      />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link
                    to={isCompany ? "/company-settings" : "/user-settings"}
                    className="flex items-center"
                  >
                    <SafeIcon
                      name="Settings"
                      size={16}
                      className="mr-2"
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
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <SafeIcon
                    name="LogOut"
                    size={16}
                    className="mr-2"
                    aria-hidden="true"
                  />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu - Far Right Corner */}
        <div className="flex items-center md:hidden pr-4 sm:pr-6 lg:pr-8">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="h-9 w-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <SafeIcon name="Menu" size={20} aria-hidden="true" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[380px]"
          >
            <nav
              className="flex flex-col space-y-1 mt-6"
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
                    className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t space-y-2 mt-4">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
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
                      className="w-full"
                      size="sm"
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
                        variant="outline"
                        className="w-full"
                        size="sm"
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
                    <div className="pb-3 mb-3 border-b">
                      <div className="flex items-center gap-3 px-3 py-2">
                        {user?.name ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground flex-shrink-0">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                            <SafeIcon name="User" size={18} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
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
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
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
                          className="mr-2"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                    </Button>
                    {!isCompany && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        size="sm"
                        asChild
                      >
                        <Link
                          to="/user-profile-view"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <SafeIcon
                            name="User"
                            size={16}
                            className="mr-2"
                            aria-hidden="true"
                          />
                          Profile
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      asChild
                    >
                      <Link
                        to={isCompany ? "/company-settings" : "/user-settings"}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SafeIcon
                          name="Settings"
                          size={16}
                          className="mr-2"
                          aria-hidden="true"
                        />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                      size="sm"
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                        navigate("/jobs");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <SafeIcon name="LogOut" size={16} className="mr-2" />
                      Log Out
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
