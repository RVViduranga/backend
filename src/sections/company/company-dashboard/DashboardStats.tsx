import type { CompanySummaryModel } from "@/models/companies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { useCompany } from "@/hooks/use-company-context";
import { useMemo } from "react";
import { companyService } from "@/services/company";

interface DashboardStatsProps {
  summary: CompanySummaryModel;
}

export default function DashboardStats({ summary }: DashboardStatsProps) {
  const { jobs, applications } = useCompany();

  // Calculate stats using service layer (business logic)
  const stats = useMemo(
    () => companyService.calculateDashboardStats(jobs, applications),
    [jobs, applications]
  );

  const dashboardStats = useMemo(
    () => [
      {
        title: "Active Job Postings",
        value: stats.activeJobsCount,
        description: "Currently open positions",
        icon: "Briefcase",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-l-blue-500",
      },
      {
        title: "Total Applications",
        value: stats.totalApplicationsReceived,
        description: "Received this month",
        icon: "Users",
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-l-green-500",
      },
      {
        title: "Pending Reviews",
        value: stats.pendingApplications,
        description: "Applications awaiting review",
        icon: "Clock",
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-l-orange-500",
      },
      {
        title: "Total Job Views",
        value: stats.totalViews,
        description: "All-time views across jobs",
        icon: "Eye",
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        borderColor: "border-l-purple-500",
      },
      {
        title: "Industry",
        value: summary.industry,
        description: "Your sector",
        icon: "Building2",
        color: "text-indigo-500",
        bgColor: "bg-indigo-50",
        borderColor: "border-l-indigo-500",
      },
    ],
    [summary, stats]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {dashboardStats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${stat.borderColor}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2.5 rounded-lg shadow-sm`}>
                <SafeIcon name={stat.icon} size={20} className={stat.color} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1.5 tracking-tight">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value}
            </div>
            <CardDescription className="text-xs font-medium">
              {stat.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
