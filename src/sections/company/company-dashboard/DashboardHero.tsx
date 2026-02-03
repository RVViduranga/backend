
import type { CompanyDetailModel, CompanySummaryModel } from '@/models/company'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import SafeIcon from "@/components/common/safe-icon"

interface DashboardHeroProps {
  company: CompanyDetailModel
  summary: CompanySummaryModel
}

export default function DashboardHero({ company, summary }: DashboardHeroProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {company.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your job postings, track applications, and grow your team.
          </p>
        </div>
        <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
          <Link to="/job-post" className="flex items-center gap-2">
            <SafeIcon name="PlusCircle" size={20} />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Company Info Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Company Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl"></div>
            <img 
              src={company.logoUrl} 
              alt={`${company.name} company logo`}
              className="relative w-24 h-24 rounded-xl object-cover border-2 border-primary/20 shadow-lg"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold mb-2">{company.name}</h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {company.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50">
                <SafeIcon name="MapPin" size={16} className="text-primary" />
                <span className="font-medium">{company.headquarters}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50">
                <SafeIcon name="Globe" size={16} className="text-primary" />
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium hover:text-primary transition-colors"
                >
                  {company.website?.replace(/^https?:\/\//, '') || company.website || ""}
                </a>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50">
                <SafeIcon name="Users" size={16} className="text-primary" />
                <span className="font-medium">{company.employeeCountRange}</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/company-profile-edit" className="flex items-center gap-2">
              <SafeIcon name="Edit" size={16} />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
