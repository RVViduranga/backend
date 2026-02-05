
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/safe-icon'
import type { UserProfileModel } from '@/models/profiles'

interface PersonalDetailsSectionProps {
  data: UserProfileModel
  onChange: (updates: Partial<UserProfileModel>) => void
}

export default function PersonalDetailsSection({
  data,
  onChange,
}: PersonalDetailsSectionProps) {
  const handleChange = (field: keyof UserProfileModel, value: string) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
          <CardDescription>Add a professional photo to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt={data.fullName} className="w-full h-full object-cover" />
              ) : (
                <SafeIcon name="User" size={40} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Current Photo</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a clear, professional headshot. JPG or PNG, max 5MB.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile-photo-upload">
                  <SafeIcon name="Upload" size={14} className="mr-2" />
                  {data.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <CardDescription>Your personal and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Headline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Headline</CardTitle>
          <CardDescription>A brief summary of your professional role and expertise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={data.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="e.g., Senior Software Engineer specializing in React & Node.js"
            maxLength={120}
          />
          <p className="text-xs text-muted-foreground">
            {data.headline.length}/120 characters
          </p>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <SafeIcon name="Lightbulb" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-green-900 mb-2">Pro Tips</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Use a professional, recent photo for better visibility</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Keep your headline clear and specific to your expertise</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Complete all sections to increase profile visibility</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
