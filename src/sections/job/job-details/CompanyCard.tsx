import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { useCompany } from "@/hooks/use-company-context";
import companyService from "@/services/company";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { CompanyDetailModel } from "@/models/companies";
import { logger } from "@/lib/logger";

export default function CompanyCard() {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading: jobLoading } = useJobQuery({ jobId: id });
  const { profile } = useCompany();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailModel | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!job?.company.id) return;

      // If logged in as company and viewing own profile, use profile
      if (profile && profile.id === job.company.id) {
        setCompanyDetails(profile);
        return;
      }

      // Otherwise, fetch company details via service
      setLoadingDetails(true);
      try {
        const details = await companyService.getCompanyById(job.company.id);
        setCompanyDetails(details);
      } catch (error) {
        logger.error("Error fetching company details:", error);
        // Fallback to basic company info from job
        setCompanyDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    if (job) {
      fetchCompanyDetails();
    }
  }, [job, profile]);

  if (jobLoading || loadingDetails) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return null;
  }

  // Use company details if available, otherwise fallback to job company info
  const company = companyDetails || {
    id: job.company.id,
    name: job.company.name,
    logoUrl: job.company.logoUrl,
    website: '',
    description: '',
    headquarters: '',
    establishedYear: 0,
    employeeCountRange: '',
    industry: job.industry || '',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SafeIcon name="Building2" size={24} aria-hidden="true" />
          About the Company
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Logo and Name */}
        <div className="flex items-center gap-4">
          <img
            src={company.logoUrl}
            alt={`${company.name} company logo`}
            className="w-16 h-16 rounded-lg object-cover"
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold">{company.name}</h3>
            {company.website && (
              <p className="text-sm text-muted-foreground">{company.website}</p>
            )}
          </div>
        </div>

        {/* Company Description */}
        {company.description ? (
          <p className="text-foreground leading-relaxed">{company.description}</p>
        ) : (
          <p className="text-muted-foreground italic">No company description available.</p>
        )}

        {/* Company Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {company.headquarters && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Headquarters</p>
              <p className="font-medium flex items-center gap-2">
                <SafeIcon name="MapPin" size={16} aria-hidden="true" />
                {company.headquarters}
              </p>
            </div>
          )}
          {company.establishedYear && company.establishedYear > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Founded</p>
              <p className="font-medium">{company.establishedYear}</p>
            </div>
          )}
          {company.employeeCountRange && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Company Size</p>
              <p className="font-medium">{company.employeeCountRange}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Industry</p>
            <p className="font-medium">{job.industry || 'N/A'}</p>
          </div>
        </div>

        {/* Company Website Button */}
        {company.website && (
          <Button variant="outline" className="w-full" asChild>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit company website"
            >
              <SafeIcon name="ExternalLink" size={16} className="mr-2" aria-hidden="true" />
              Visit Company Website
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
