import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/common/protected-route";
import PublicOnlyRoute from "@/components/common/public-only-route";
import RouteLoader from "@/components/common/route-loader";

// Public pages - Lazy loaded
const JobSearchPage = lazy(() => import("@/pages/public/job-search-page"));
const JobDetailsPage = lazy(() => import("@/pages/public/job-details-page"));
const JobApplicationPage = lazy(
  () => import("@/pages/public/job-application-page")
);
const CompaniesPage = lazy(() => import("@/pages/public/companies-page"));
const CompanyDetailPage = lazy(
  () => import("@/pages/public/company-detail-page")
);
const TermsOfService = lazy(() =>
  import("@/pages/public/terms-of-service").then((module) => ({
    default: module.TermsOfService,
  }))
);
const PrivacyPolicy = lazy(() =>
  import("@/pages/public/privacy-policy").then((module) => ({
    default: module.PrivacyPolicy,
  }))
);
const HelpSupport = lazy(() =>
  import("@/pages/public/help-support").then((module) => ({
    default: module.HelpSupport,
  }))
);
const About = lazy(() =>
  import("@/pages/public/about").then((module) => ({ default: module.About }))
);
const Contact = lazy(() =>
  import("@/pages/public/contact").then((module) => ({
    default: module.Contact,
  }))
);
const Pricing = lazy(() =>
  import("@/pages/public/pricing").then((module) => ({
    default: module.Pricing,
  }))
);
const Cookies = lazy(() =>
  import("@/pages/public/cookies").then((module) => ({
    default: module.Cookies,
  }))
);
const Resources = lazy(() =>
  import("@/pages/public/resources").then((module) => ({
    default: module.Resources,
  }))
);
const PublicProfileView = lazy(() =>
  import("@/pages/public/public-profile-view").then((module) => ({
    default: module.default,
  }))
);
const CandidateSearchPage = lazy(() =>
  import("@/pages/public/candidate-search-page").then((module) => ({
    default: module.default,
  }))
);

// Auth pages - Lazy loaded
const UnifiedLogin = lazy(() =>
  import("@/pages/auth/unified-login").then((module) => ({
    default: module.UnifiedLogin,
  }))
);
const UnifiedSignup = lazy(() =>
  import("@/pages/auth/unified-signup").then((module) => ({
    default: module.UnifiedSignup,
  }))
);
const EmailSignup = lazy(() =>
  import("@/pages/auth/email-signup").then((module) => ({
    default: module.EmailSignup,
  }))
);
const GoogleSignup = lazy(() =>
  import("@/pages/auth/google-signup").then((module) => ({
    default: module.GoogleSignup,
  }))
);
const CompanyRegistration = lazy(() =>
  import("@/pages/auth/company-registration").then((module) => ({
    default: module.CompanyRegistration,
  }))
);
const ForgotPassword = lazy(() =>
  import("@/pages/auth/forgot-password").then((module) => ({
    default: module.ForgotPassword,
  }))
);

// User pages - Lazy loaded
const UserDashboard = lazy(() =>
  import("@/pages/user/dashboard").then((module) => ({
    default: module.UserDashboard,
  }))
);
const UserApplications = lazy(() =>
  import("@/pages/user/user-applications").then((module) => ({
    default: module.UserApplications,
  }))
);
const SavedJobs = lazy(() =>
  import("@/pages/user/saved-jobs").then((module) => ({
    default: module.SavedJobs,
  }))
);
const UserSettings = lazy(() =>
  import("@/pages/user/user-settings").then((module) => ({
    default: module.UserSettings,
  }))
);
const ProfileManagement = lazy(() =>
  import("@/pages/user/user-profile-management").then((module) => ({
    default: module.ProfileManagement,
  }))
);
const ProfileSetup = lazy(() =>
  import("@/pages/user/user-profile-setup").then((module) => ({
    default: module.ProfileSetup,
  }))
);
const ProfileView = lazy(() =>
  import("@/pages/user/user-profile-view").then((module) => ({
    default: module.ProfileView,
  }))
);
const PersonalDetailsEdit = lazy(() =>
  import("@/pages/user/personal-details-edit").then((module) => ({
    default: module.PersonalDetailsEdit,
  }))
);
const ContactInfoEdit = lazy(() =>
  import("@/pages/user/contact-info-edit").then((module) => ({
    default: module.ContactInfoEdit,
  }))
);
const ExperienceEducationEdit = lazy(() =>
  import("@/pages/user/experience-education-edit").then((module) => ({
    default: module.ExperienceEducationEdit,
  }))
);
const ProfilePhotoUpload = lazy(() =>
  import("@/pages/user/profile-photo-upload").then((module) => ({
    default: module.ProfilePhotoUpload,
  }))
);
const ProfileMediaManagementPage = lazy(() =>
  import("@/pages/user/profile-media-management").then((module) => ({
    default: module.ProfileMediaManagementPage,
  }))
);
const ProjectsWorkSamples = lazy(() =>
  import("@/pages/user/projects-work-samples").then((module) => ({
    default: module.ProjectsWorkSamples,
  }))
);
const CVManagement = lazy(() =>
  import("@/pages/user/cv-management").then((module) => ({
    default: module.CVManagement,
  }))
);
const CVUpload = lazy(() =>
  import("@/pages/user/cv-upload").then((module) => ({
    default: module.CVUpload,
  }))
);
const CVView = lazy(() =>
  import("@/pages/user/cv-view").then((module) => ({ default: module.CVView }))
);
const ApplicationSubmitted = lazy(() =>
  import("@/pages/user/application-confirmation").then((module) => ({
    default: module.ApplicationSubmitted,
  }))
);

// Company pages - Lazy loaded
const CompanyDashboard = lazy(() =>
  import("@/pages/company/company-dashboard").then((module) => ({
    default: module.CompanyDashboard,
  }))
);
const ManageJobs = lazy(() =>
  import("@/pages/company/manage-jobs").then((module) => ({
    default: module.ManageJobs,
  }))
);
const JobPostFormPage = lazy(() =>
  import("@/pages/company/job-post-form").then((module) => ({
    default: module.JobPostFormPage,
  }))
);
const JobPostReview = lazy(() =>
  import("@/pages/company/job-post-review").then((module) => ({
    default: module.JobPostReview,
  }))
);
const JobPostConfirmation = lazy(() =>
  import("@/pages/company/job-post-confirmation").then((module) => ({
    default: module.JobPostConfirmation,
  }))
);
const CompanyApplications = lazy(() =>
  import("@/pages/company/company-applications").then((module) => ({
    default: module.CompanyApplications,
  }))
);
const CompanyApplicationDetail = lazy(
  () => import("@/pages/company/company-application-detail")
);
const CompanySettings = lazy(() =>
  import("@/pages/company/company-settings").then((module) => ({
    default: module.CompanySettings,
  }))
);
const CompanyProfileEdit = lazy(() =>
  import("@/pages/company/company-profile-edit").then((module) => ({
    default: module.CompanyProfileEdit,
  }))
);

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<JobSearchPage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/candidates" element={<CandidateSearchPage />} />
        <Route path="/candidates/search" element={<CandidateSearchPage />} />
        <Route path="/users/:id" element={<PublicProfileView />} />
        <Route path="/profile/:id" element={<PublicProfileView />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* Public-only routes (redirect if authenticated) */}
        <Route
          path="/login-options"
          element={
            <PublicOnlyRoute>
              <UnifiedLogin />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <UnifiedLogin />
            </PublicOnlyRoute>
          }
        />
        {/* Legacy login routes - redirect to unified login */}
        <Route
          path="/email-login"
          element={
            <PublicOnlyRoute>
              <Navigate to="/login" replace />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/google-login"
          element={
            <PublicOnlyRoute>
              <Navigate to="/login" replace />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/company-login"
          element={
            <PublicOnlyRoute>
              <UnifiedLogin />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <UnifiedSignup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup/user"
          element={
            <PublicOnlyRoute>
              <UnifiedSignup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup/employer"
          element={
            <PublicOnlyRoute>
              <UnifiedSignup />
            </PublicOnlyRoute>
          }
        />
        {/* Legacy routes - redirect to unified signup */}
        <Route
          path="/signup-options"
          element={
            <PublicOnlyRoute>
              <Navigate to="/signup" replace />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/email-signup"
          element={
            <PublicOnlyRoute>
              <EmailSignup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/google-signup"
          element={
            <PublicOnlyRoute>
              <GoogleSignup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/company-registration"
          element={
            <PublicOnlyRoute>
              <CompanyRegistration />
            </PublicOnlyRoute>
          }
        />
        {/* Legacy route - redirect to company registration */}
        <Route
          path="/company-register"
          element={
            <PublicOnlyRoute>
              <Navigate to="/company-registration" replace />
            </PublicOnlyRoute>
          }
        />

        {/* Protected user routes */}
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute requiredUserType="user">
              <JobApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredUserType="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredUserType="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-applications"
          element={
            <ProtectedRoute requiredUserType="user">
              <UserApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute requiredUserType="user">
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-settings"
          element={
            <ProtectedRoute requiredUserType="user">
              <UserSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredUserType="user">
              <UserSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile-management"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProfileManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile-view"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile-setup"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-details-edit"
          element={
            <ProtectedRoute requiredUserType="user">
              <PersonalDetailsEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-info-edit"
          element={
            <ProtectedRoute requiredUserType="user">
              <ContactInfoEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experience-education-edit"
          element={
            <ProtectedRoute requiredUserType="user">
              <ExperienceEducationEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-photo-upload"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProfilePhotoUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-media-management"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProfileMediaManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects-work-samples"
          element={
            <ProtectedRoute requiredUserType="user">
              <ProjectsWorkSamples />
            </ProtectedRoute>
          }
        />
        {/* Legacy route redirect for backward compatibility */}
        <Route
          path="/portfolio-upload"
          element={
            <ProtectedRoute requiredUserType="user">
              <Navigate to="/projects-work-samples" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-management"
          element={
            <ProtectedRoute requiredUserType="user">
              <CVManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-upload"
          element={
            <ProtectedRoute requiredUserType="user">
              <CVUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-view"
          element={
            <ProtectedRoute requiredUserType="user">
              <CVView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application-confirmation"
          element={
            <ProtectedRoute requiredUserType="user">
              <ApplicationSubmitted />
            </ProtectedRoute>
          }
        />

        {/* Protected company routes */}
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute requiredUserType="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-jobs"
          element={
            <ProtectedRoute requiredUserType="company">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-post"
          element={
            <ProtectedRoute requiredUserType="company">
              <JobPostFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-post-form"
          element={
            <ProtectedRoute requiredUserType="company">
              <JobPostFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-post-review"
          element={
            <ProtectedRoute requiredUserType="company">
              <JobPostReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-post-confirmation"
          element={
            <ProtectedRoute requiredUserType="company">
              <JobPostConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-applications"
          element={
            <ProtectedRoute requiredUserType="company">
              <CompanyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute requiredUserType="company">
              <CompanyApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-settings"
          element={
            <ProtectedRoute requiredUserType="company">
              <CompanySettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-profile-edit"
          element={
            <ProtectedRoute requiredUserType="company">
              <CompanyProfileEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
