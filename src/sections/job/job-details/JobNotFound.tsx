import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

export default function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
          <SafeIcon name="AlertCircle" size={48} className="text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Job Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The job you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/jobs">
              <SafeIcon name="ArrowLeft" size={18} className="mr-2" aria-hidden="true" />
              Back to Job Search
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <SafeIcon name="Home" size={18} className="mr-2" aria-hidden="true" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}









