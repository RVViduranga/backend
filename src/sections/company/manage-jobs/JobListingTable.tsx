
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SafeIcon from "@/components/common/safe-icon"
import JobActionMenu from './JobActionMenu'
import type { JobSummaryModel } from '@/models/jobPosts'

interface JobListingTableProps {
  jobs: JobSummaryModel[]
}

export default function JobListingTable({ jobs }: JobListingTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'applications'>('date')

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    }
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0)
    }
    if (sortBy === 'applications') {
      return (b.applicationsCount || 0) - (a.applicationsCount || 0)
    }
    return 0
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'Closed':
        return 'bg-gray-100 text-gray-800'
      case 'Pending Review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              <SafeIcon name="Calendar" size={14} className="mr-1" />
              Date
            </Button>
            <Button
              variant={sortBy === 'views' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('views')}
            >
              <SafeIcon name="Eye" size={14} className="mr-1" />
              Views
            </Button>
            <Button
              variant={sortBy === 'applications' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('applications')}
            >
              <SafeIcon name="Users" size={14} className="mr-1" />
              Applications
            </Button>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Job Title</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Views</TableHead>
            <TableHead className="text-right font-semibold">Applications</TableHead>
            <TableHead className="font-semibold">Posted Date</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary hover:underline font-semibold"
                  >
                    {job.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">{job.company.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(job.status)}`}>
                  {job.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <SafeIcon name="Eye" size={16} className="text-muted-foreground" />
                  <span className="font-medium">{job.views || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <SafeIcon name="Users" size={16} className="text-muted-foreground" />
                  <span className="font-medium">{job.applicationsCount || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(job.postedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <JobActionMenu job={job} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
