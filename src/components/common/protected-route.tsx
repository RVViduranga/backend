import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "user" | "company";
  redirectTo?: string;
}

/**
 * ProtectedRoute - Redirects to login if user is not authenticated
 * Optionally restricts access based on user type (user vs company)
 */
export default function ProtectedRoute({
  children,
  requiredUserType,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check user type if specified
  if (requiredUserType && user?.userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    if (user?.userType === "company") {
      return <Navigate to="/company-dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
}







