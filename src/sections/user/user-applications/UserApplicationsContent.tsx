import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SafeIcon from '@/components/common/safe-icon'
import { formatRelativeDate } from '@/utils/date'
import type { UserApplicationStatus } from '@/models/applications'
import { useCandidateApplicationContext } from '@/hooks/use-candidate-application-context'
import { Loader2 } from 'lucide-react'

export default function UserApplicationsContent() {
  const { applications, isLoading } = useCandidateApplicationContext()
  const [selectedTab, setSelectedTab] = useState<'all' | UserApplicationStatus>('all')

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      return selectedTab === 'all' || app.status === selectedTab
    })
  }, [applications, selectedTab])

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'Pending').length,
      reviewing: applications.filter((a) => a.status === 'Reviewed').length,
      shortlisted: applications.filter((a) => a.status === 'Reviewed').length, // Maps to Reviewed
      interview: applications.filter((a) => a.status === 'Reviewed').length, // Maps to Reviewed
      accepted: applications.filter((a) => a.status === 'Accepted').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
    }
  }, [applications])

  const getStatusColor = (status: UserApplicationStatus) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: UserApplicationStatus) => {
    switch (status) {
      case 'Accepted':
        return 'CheckCircle'
      case 'Reviewed':
        return 'Clock'
      case 'Pending':
        return 'Circle'
      case 'Rejected':
        return 'XCircle'
      default:
        return 'Circle'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.reviewing}</div>
              <p className="text-xs text-muted-foreground">Reviewing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.shortlisted}</div>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.interview}</div>
              <p className="text-xs text-muted-foreground">Interview</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>View and manage your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}>
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1">
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
                <TabsTrigger value="reviewing" className="text-xs sm:text-sm">Reviewing</TabsTrigger>
                <TabsTrigger value="shortlisted" className="text-xs sm:text-sm">Shortlisted</TabsTrigger>
                <TabsTrigger value="interview" className="text-xs sm:text-sm">Interview</TabsTrigger>
                <TabsTrigger value="accepted" className="text-xs sm:text-sm">Accepted</TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs sm:text-sm">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedTab} className="mt-4">
                {filteredApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{app.job.title}</h4>
                              <p className="text-sm text-muted-foreground">{app.job.company.name}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <SafeIcon name="MapPin" size={14} />
                                  {app.job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <SafeIcon name="Briefcase" size={14} />
                                  {app.job.jobType}
                                </span>
                                {app.job.experienceLevel && (
                                  <span className="flex items-center gap-1">
                                    <SafeIcon name="User" size={14} />
                                    {app.job.experienceLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              <SafeIcon name={getStatusIcon(app.status)} size={14} className="mr-1" />
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <SafeIcon name="Clock" size={14} />
                              Applied {formatRelativeDate(app.appliedDate || (app as any).date || "")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                            <Link to={`/jobs/${app.jobId || (app as any).jobPost || ""}`}>
                              <SafeIcon name="ExternalLink" size={14} className="mr-1.5" />
                              View Job
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <SafeIcon name="FileText" size={40} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {selectedTab === 'all'
                        ? "You haven't applied to any jobs yet. Start browsing and apply to positions that match your skills."
                        : `No ${selectedTab} applications at the moment. Try checking other statuses or browse for new opportunities.`}
                    </p>
                    <Button asChild>
                      <Link to="/jobs">
                        <SafeIcon name="Search" size={16} className="mr-2" />
                        Browse Jobs
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

