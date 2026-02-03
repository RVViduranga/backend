import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import type { JobSummaryModel } from "@/models/job";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface JobActionMenuProps {
  job: JobSummaryModel;
}

export default function JobActionMenu({ job }: JobActionMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would call an API here:
      // await jobService.deleteJob(job.id)

      toast.success(`Job "${job.title}" has been deleted successfully`);
      setShowDeleteDialog(false);

      // In a real app, you would refresh the job list or remove it from state
      // For now, we'll just show a toast
    } catch (error) {
      toast.error("Failed to delete job. Please try again.");
      logger.error("Error deleting job:", error);
    }
  };

  const handleArchive = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, you would call an API here:
      // await jobService.updateJobStatus(job.id, isActive ? 'Closed' : 'Active')

      toast.success(
        `Job "${job.title}" has been ${
          isActive ? "deactivated" : "reactivated"
        } successfully`
      );
      setShowArchiveDialog(false);

      // In a real app, you would refresh the job list or update it in state
      // For now, we'll just show a toast
    } catch (error) {
      toast.error(
        `Failed to ${
          isActive ? "deactivate" : "reactivate"
        } job. Please try again.`
      );
      logger.error("Error archiving job:", error);
    }
  };

  const isActive = job.status === "Active";
  const isClosed = job.status === "Closed";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SafeIcon name="MoreVertical" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to={`/jobs/${job.id}`}>
              <SafeIcon name="Eye" size={16} className="mr-2" />
              View Job
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/job-post-review">
              <SafeIcon name="Edit" size={16} className="mr-2" />
              Edit Job
            </Link>
          </DropdownMenuItem>

          {isActive && (
            <DropdownMenuItem asChild>
              <Link to="/company-applications">
                <SafeIcon name="Eye" size={16} className="mr-2" />
                View Applications
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {!isClosed && (
            <DropdownMenuItem onClick={() => setShowArchiveDialog(true)}>
              <SafeIcon name="Archive" size={16} className="mr-2" />
              {isActive ? "Deactivate" : "Reactivate"}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <SafeIcon name="Trash2" size={16} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{job.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "Deactivate" : "Reactivate"} Job Posting
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? `Are you sure you want to deactivate "${job.title}"? It will no longer be visible to job seekers.`
                : `Are you sure you want to reactivate "${job.title}"? It will be visible to job seekers again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              {isActive ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
