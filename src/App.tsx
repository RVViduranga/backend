import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/common/error-boundary";
import SkipToContent from "@/components/common/skip-to-content";
import { AuthProvider } from "@/contexts/auth-context";
import { UserProvider } from "@/contexts/user-context";
import { CompanyProvider } from "@/contexts/company-context";
import { CandidateJobProvider } from "@/contexts/candidate-job-context";
import { CandidateApplicationProvider } from "@/contexts/candidate-application-context";
import { EmployerJobPostProvider } from "@/contexts/employer-job-post-context";
import { EmployerApplicationProvider } from "@/contexts/employer-application-context";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <CompanyProvider>
              <CandidateJobProvider>
                <CandidateApplicationProvider>
                    <EmployerJobPostProvider>
                      <EmployerApplicationProvider>
                <SkipToContent />
                <div className="min-h-screen bg-background">
                  <main id="main-content" tabIndex={-1}>
                    <AppRoutes />
                  </main>
                  <Toaster />
                </div>
                    </EmployerApplicationProvider>
                  </EmployerJobPostProvider>
                </CandidateApplicationProvider>
              </CandidateJobProvider>
            </CompanyProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
