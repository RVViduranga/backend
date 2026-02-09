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
  const getIconColor = (id: string) => {
    switch (id) {
      case "cv":
        return "from-blue-500/20 to-blue-600/10 text-blue-600";
      case "media":
        return "from-purple-500/20 to-purple-600/10 text-purple-600";
      case "projects":
      case "portfolio": // Legacy support
        return "from-green-500/20 to-green-600/10 text-green-600";
      default:
        return "from-primary/20 to-primary/10 text-primary";
    }
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col border-l-4 border-l-transparent hover:border-l-primary relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getIconColor(section.id)} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <SafeIcon
                name={section.icon}
                size={24}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {section.title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {section.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 relative">
        {/* Stats */}
        {section.stats && section.stats.length > 0 && (
          <div className="space-y-3 py-4 border-y border-border/50 bg-muted/30 rounded-lg px-4">
            {section.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-muted-foreground flex items-center gap-2">
                  <SafeIcon name="Circle" size={6} className="text-primary/40" />
                  {stat.label}
                </span>
                <span className="font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full mt-auto group/btn hover:shadow-md transition-all duration-300" 
          asChild
        >
          <Link to={section.href} className="flex items-center justify-center">
            {section.buttonText}
            <SafeIcon 
              name="ArrowRight" 
              size={16} 
              className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" 
            />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
