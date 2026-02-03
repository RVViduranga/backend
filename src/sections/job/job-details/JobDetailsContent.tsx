import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { Loader2 } from "lucide-react";

export default function JobDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading, isError, error } = useJobQuery({ jobId: id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12">
        <SafeIcon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{error?.message || "Unable to load job details."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="FileText" size={24} aria-hidden="true" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {job.description || "No job description available."}
          </p>
        </CardContent>
      </Card>

      {/* Responsibilities */}
      {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SafeIcon name="CheckCircle2" size={24} aria-hidden="true" />
              Key Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex gap-3">
                  <SafeIcon
                    name="ArrowRight"
                    size={20}
                    className="text-primary flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{responsibility}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Qualifications */}
      {job.qualifications && Array.isArray(job.qualifications) && job.qualifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SafeIcon name="Award" size={24} aria-hidden="true" />
              Required Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.qualifications.map((qualification, index) => (
                <li key={index} className="flex gap-3">
                  <SafeIcon
                    name="CheckCircle"
                    size={20}
                    className="text-success flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{qualification}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
