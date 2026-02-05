import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { formatDate, getDaysUntilDeadline } from "@/utils/date";
import { formatSalaryRangeDisplay, formatClosingDate } from "@/utils/job-format";
import { Loader2 } from "lucide-react";

export default function JobMetadata() {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading, isError } = useJobQuery({ jobId: id });

  if (isLoading) {
    return (
      <Card className="sticky top-24">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !job) {
    return null;
  }

  const applicationDeadline = job.applicationDeadline; // ✅ Backend field name
  const daysUntilDeadline = applicationDeadline
    ? getDaysUntilDeadline(applicationDeadline)
    : null;

  const metadataItems = [
    {
      label: "Job Type",
      value: job.jobType,
      icon: "Briefcase",
    },
    {
      label: "Experience Level",
      value: job.experienceLevel,
      icon: "TrendingUp",
    },
    {
      label: "Salary Range",
      value: formatSalaryRangeDisplay(job.salaryRange as any),
      icon: "DollarSign",
    },
    {
      label: "Location",
      value: job.location,
      icon: "MapPin",
    },
    {
      label: "Application Deadline",
      value: applicationDeadline ? formatDate(applicationDeadline) : "Not specified",
      icon: "Calendar",
      urgency: daysUntilDeadline !== null && daysUntilDeadline <= 7,
      daysLeft: daysUntilDeadline,
    },
  ];

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Job Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metadataItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <SafeIcon name={item.icon} size={16} aria-hidden="true" />
              {item.label}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{item.value}</p>
              {item.urgency && item.daysLeft !== null && (
                <Badge variant="destructive" className="text-xs">
                  {item.daysLeft === 0
                    ? "Today"
                    : item.daysLeft === 1
                    ? "1 day left"
                    : `${item.daysLeft} days left`}
                </Badge>
              )}
            </div>
            {index < metadataItems.length - 1 && <div className="border-t mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
