
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import SafeIcon from '@/components/common/safe-icon'
import { useUser } from '@/hooks/use-user-context'
import { useMemo } from 'react'

interface ProfileStatusCardProps {
  profileCompletion: number
}

export default function ProfileStatusCard({ profileCompletion }: ProfileStatusCardProps) {
  const { profile } = useUser()

  // Calculate section completion based on actual profile data
  const profileSections = useMemo(() => [
    {
      name: 'Personal Info',
      completed: !!(profile?.fullName),
      icon: 'User',
    },
    {
      name: 'Contact Details',
      completed: !!(profile?.email && profile?.phone),
      icon: 'Mail',
    },
    {
      name: 'Experience',
      completed: !!(profile?.experience && profile.experience.length > 0),
      icon: 'Briefcase',
    },
    {
      name: 'Education',
      completed: !!(profile?.education && profile.education.length > 0),
      icon: 'BookOpen',
    },
    {
      name: 'CV Upload',
      completed: !!(profile?.cvUploaded),
      icon: 'FileText',
    },
    {
      name: 'Profile Photo',
      completed: !!(profile?.avatarUrl),
      icon: 'Camera',
    },
  ], [profile])

  const completedSections = profileSections.filter((s) => s.completed).length
  const totalSections = profileSections.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Status</CardTitle>
        <CardDescription>Complete your profile to stand out</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion</span>
            <span className="text-sm font-semibold text-primary">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>

        {/* Profile Sections */}
        <div className="space-y-2">
          {profileSections.map((section) => (
            <div
              key={section.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  section.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {section.completed ? (
                  <SafeIcon name="Check" size={14} />
                ) : (
                  <SafeIcon name={section.icon} size={14} />
                )}
              </div>
              <span className={`text-sm ${section.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button className="w-full" asChild>
          <Link to="/user-profile-setup">
            <SafeIcon name="Edit" size={16} className="mr-2" />
            Complete Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
