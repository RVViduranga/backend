import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicOnlyRoute - Redirects authenticated users away from public pages (login/signup)
 */
export default function PublicOnlyRoute({
  children,
  redirectTo,
}: PublicOnlyRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    // Default redirect based on user type
    if (user?.userType === "company") {
      return <Navigate to="/company-dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
}







