import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

interface QuickActionItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  variant?: "default" | "secondary";
}

export default function QuickActions() {
  const actions: QuickActionItem[] = [
    {
      title: "Post New Job",
      description: "Create a new job vacancy listing immediately.",
      icon: "PlusCircle",
      href: "/job-post",
      variant: "default",
    },
    {
      title: "Manage Active Jobs",
      description: "View, edit, or archive your current job postings.",
      icon: "Briefcase",
      href: "/manage-jobs",
      variant: "secondary",
    },
    {
      title: "Review Applications",
      description: "Track and evaluate candidates for open roles.",
      icon: "Users",
      href: "/company-applications",
      variant: "secondary",
    },
    {
      title: "Company Settings",
      description: "Update your company profile and preferences.",
      icon: "Settings",
      href: "/company-settings",
      variant: "secondary",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
        <p className="text-muted-foreground">Access your most common tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Card
            key={action.title}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col border-l-4 border-l-transparent hover:border-l-primary"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.variant === "default" ? "from-primary/20 to-primary/10" : "from-muted to-muted/50"} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <SafeIcon
                    name={action.icon}
                    size={24}
                    className={action.variant === "default" ? "text-primary" : "text-foreground"}
                  />
                </div>
              </div>
              <CardTitle className="text-lg mb-1.5">{action.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <Button
                asChild
                variant={action.variant === "default" ? "default" : "outline"}
                className="w-full group-hover:shadow-md transition-shadow"
              >
                <Link to={action.href} className="flex items-center justify-center">
                  Access
                  <SafeIcon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
