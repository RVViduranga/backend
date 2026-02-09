
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SafeIcon from '@/components/common/safe-icon'
import ProfilePhotoUploadDialogForm from '@/sections/user/profile-media-management/ProfilePhotoUploadDialogForm'
import { userService } from '@/services/user'
import type { UserProfileModel } from '@/models/profiles'

interface PersonalDetailsSectionProps {
  data: UserProfileModel
  onChange: (updates: Partial<UserProfileModel>) => void
}

interface ExtendedFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  bio: string
}

export default function PersonalDetailsSection({
  data,
  onChange,
}: PersonalDetailsSectionProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  // Parse fullName into firstName and lastName
  const parseName = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    }
  }

  // Parse location into address components
  const parseLocation = (location: string) => {
    // Simple parsing - location is usually "City, Country" or just "City"
    const parts = location.split(',').map(s => s.trim())
    return {
      city: parts[0] || '',
      country: parts[1] || '',
      state: '',
      address: '',
      zipCode: '',
    }
  }

  const [formData, setFormData] = useState<ExtendedFormData>(() => {
    const nameParts = parseName(data.fullName || '')
    const locationParts = parseLocation(data.location || '')
    return {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      dateOfBirth: data.dateOfBirth || '',
      nationality: data.nationality || '',
      address: data.address || locationParts.address || '',
      city: data.city || locationParts.city || '',
      state: data.state || locationParts.state || '',
      zipCode: data.zipCode || locationParts.zipCode || '',
      country: data.country || locationParts.country || '',
      bio: data.headline || '',
    }
  })

  // Update form data when data prop changes (only for fields that come from backend)
  useEffect(() => {
    const nameParts = parseName(data.fullName || '')
    const locationParts = parseLocation(data.location || '')
    setFormData(prev => ({
      ...prev,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      nationality: data.nationality || prev.nationality,
      address: data.address || locationParts.address || prev.address,
      city: data.city || locationParts.city || prev.city,
      state: data.state || locationParts.state || prev.state,
      zipCode: data.zipCode || locationParts.zipCode || prev.zipCode,
      country: data.country || locationParts.country || prev.country,
      bio: data.headline || '',
    }))
  }, [data.fullName, data.location, data.headline, data.dateOfBirth, data.nationality, data.address, data.city, data.state, data.zipCode, data.country])

  const handleFormChange = (field: keyof ExtendedFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Update parent component with transformed data
      if (field === 'firstName' || field === 'lastName') {
        const fullName = `${updated.firstName} ${updated.lastName}`.trim()
        onChange({ fullName })
      } else if (field === 'bio') {
        onChange({ headline: value })
      } else if (['address', 'city', 'state', 'zipCode', 'country'].includes(field)) {
        // Update individual address fields
        onChange({
          address: updated.address,
          city: updated.city,
          state: updated.state,
          zipCode: updated.zipCode,
          country: updated.country,
        })
        
        // Also update location string for backward compatibility (city, country)
        const locationParts = []
        if (updated.city) {
          locationParts.push(updated.city)
        }
        if (updated.country) {
          locationParts.push(updated.country)
        }
        const location = locationParts.join(', ')
        if (location) {
          onChange({ location })
        }
      } else if (field === 'dateOfBirth') {
        onChange({ dateOfBirth: value })
      } else if (field === 'nationality') {
        onChange({ nationality: value })
      }
      
      return updated
    })
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setUploadDialogOpen(true)}
              >
                <SafeIcon name="Upload" size={14} className="mr-2" />
                {data.avatarUrl ? 'Change Photo' : 'Upload Photo'}
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
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                disabled
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="your.email@example.com"
                title="Email cannot be changed"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleFormChange('nationality', e.target.value)}
                placeholder="United States"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address Information</CardTitle>
          <CardDescription>Your location and address details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleFormChange('state', e.target.value)}
                placeholder="California"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleFormChange('zipCode', e.target.value)}
                placeholder="94102"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleFormChange('country', e.target.value)}
              placeholder="United States"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Bio</CardTitle>
          <CardDescription>Tell employers about yourself, your skills, and your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="bio">Bio / Professional Summary</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleFormChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your professional background, skills, and what makes you unique..."
            rows={5}
            className="resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {formData.bio.length}/500 characters
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

      {/* Profile Photo Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a clear, professional headshot for your profile
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <ProfilePhotoUploadDialogForm
              setAsPrimary={true}
              onSuccess={async () => {
                // ProfilePhotoUploadDialogForm already calls refreshProfile()
                // Refresh the parent component's data to show new photo
                const updatedProfile = await userService.getProfile();
                onChange({ avatarUrl: updatedProfile.avatarUrl });
                setUploadDialogOpen(false)
              }}
              onCancel={() => setUploadDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
