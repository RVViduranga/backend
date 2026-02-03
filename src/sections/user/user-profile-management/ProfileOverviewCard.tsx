import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";

interface ProfileSectionStat {
  label: string;
  value: string | number;
}

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  buttonText: string;
  stats?: ProfileSectionStat[];
}

interface ProfileOverviewCardProps {
  section: ProfileSection;
}

export default function ProfileOverviewCard({
  section,
}: ProfileOverviewCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <SafeIcon
                name={section.icon}
                size={20}
                className="text-primary"
              />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription className="text-sm">
                {section.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Stats */}
        {section.stats && section.stats.length > 0 && (
          <div className="space-y-2 py-3 border-y">
            {section.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button className="w-full mt-auto" asChild>
          <Link to={section.href}>
            {section.buttonText}
            <SafeIcon name="ArrowRight" size={16} className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
