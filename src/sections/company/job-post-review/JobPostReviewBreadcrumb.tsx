import { Link } from "react-router-dom";
import SafeIcon from "@/components/common/safe-icon";

export default function JobPostReviewBreadcrumb() {
  return (
    <nav
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap"
      aria-label="Breadcrumb"
    >
      <Link
        to="/company-dashboard"
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <SafeIcon name="LayoutDashboard" size={16} aria-hidden="true" />
        Dashboard
      </Link>
      <SafeIcon
        name="ChevronRight"
        size={16}
        className="text-muted-foreground/50 flex-shrink-0"
        aria-hidden="true"
      />
      <Link
        to="/job-post"
        className="hover:text-primary transition-colors"
      >
        Post Job
      </Link>
      <SafeIcon
        name="ChevronRight"
        size={16}
        className="text-muted-foreground/50 flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-foreground font-medium">Review</span>
    </nav>
  );
}








