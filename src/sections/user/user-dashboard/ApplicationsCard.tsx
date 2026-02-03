import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'
import { useCandidateApplicationContext } from '@/hooks/use-candidate-application-context'
import { Loader2 } from 'lucide-react'
import { formatRelativeDate } from '@/utils/date'

export default function ApplicationsCard() {
  const { applications, isLoading } = useCandidateApplicationContext()
  
  // Show only first 4 applications for dashboard preview
  const displayApplications = applications.slice(0, 4)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'reviewing':
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview':
        return 'CheckCircle'
      case 'reviewing':
      case 'shortlisted':
        return 'Clock'
      case 'pending':
        return 'AlertCircle'
      case 'rejected':
        return 'XCircle'
      case 'accepted':
        return 'CheckCircle'
      default:
        return 'Circle'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/user-applications">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayApplications.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon
              name="FileText"
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start applying to jobs and track your applications here.
            </p>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{app.job.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.job.company.name}</p>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    <SafeIcon name={getStatusIcon(app.status)} size={14} className="mr-1" />
                    {getStatusLabel(app.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <SafeIcon name="MapPin" size={12} />
                    {app.job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <SafeIcon name="Clock" size={12} />
                    Applied {formatRelativeDate(app.appliedDate || (app as any).date || "")}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-2" asChild>
                <Link to={`/jobs/${app.jobId || (app as any).jobPost || ""}`}>
                  <SafeIcon name="ChevronRight" size={16} />
                </Link>
              </Button>
            </div>
          ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
