import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/safe-icon'
import { usePlatformStatisticsQuery } from '@/hooks/queries/use-platform-statistics-query'

interface AuthLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  showBranding?: boolean
}

export default function AuthLayout({
  title,
  description,
  children,
  showBranding = true,
}: AuthLayoutProps) {
  const { statistics } = usePlatformStatisticsQuery();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <SafeIcon name="Briefcase" size={24} color="white" />
            </div>
            <span className="font-bold text-2xl">JobCenter</span>
          </div>

          {/* Auth Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Branding */}
      {showBranding && (
        <div className="hidden lg:flex items-center justify-center bg-primary p-8">
          <div className="max-w-md text-center text-primary-foreground space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <SafeIcon name="Users" size={48} />
            </div>
            <h2 className="text-3xl font-bold">Find Your Dream Job</h2>
            <p className="text-lg text-primary-foreground/90">
              Connect with top employers and discover opportunities that match your skills and
              aspirations.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{statistics.activeJobs}</div>
                <div className="text-sm text-primary-foreground/80">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{statistics.companies}</div>
                <div className="text-sm text-primary-foreground/80">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{statistics.jobSeekers}</div>
                <div className="text-sm text-primary-foreground/80">Job Seekers</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
