import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import type { CompanySummaryModel } from "@/models/company";

interface CompanyCardProps {
  company: CompanySummaryModel;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-4">
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="w-16 h-16 rounded-lg object-cover border"
            loading="lazy"
          />
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{company.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary">{company.industry}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <SafeIcon name="Briefcase" size={16} aria-hidden="true" />
              Active Jobs
            </span>
            <span className="font-semibold text-foreground">
              {company.activeJobsCount}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link to={`/companies/${company.id}`}>View Company</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

