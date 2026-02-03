
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SafeIcon from "@/components/common/safe-icon"
import { logger } from '@/lib/logger'
import { useUser } from '@/hooks/use-user-context'
import { toast } from 'sonner'

interface ContactInfo {
  email: string
  phone: string
  alternatePhone?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface FormErrors {
  [key: string]: string
}

export default function ContactInfoEditForm() {
  const { profile, updateProfile } = useUser();
  
  // Initialize form data from user profile
  const getInitialData = (): ContactInfo => {
    if (profile) {
      return {
        email: profile.email || '',
        phone: profile.phone || '',
        alternatePhone: '',
        address: '',
        city: profile.location?.split(',')[0] || '',
        state: '',
        zipCode: '',
        country: '',
      };
    }
    return {
      email: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    };
  };

  const [formData, setFormData] = useState<ContactInfo>(getInitialData())
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(getInitialData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Alternate phone validation (optional but if provided, must be valid)
    if (formData.alternatePhone && !/^[\d\s\-+()]+$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Please enter a valid phone number'
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required'
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required'
    }

    // State validation
    if (!formData.state) {
      newErrors.state = 'State/Province is required'
    }

    // Zip code validation
    if (!formData.zipCode) {
      newErrors.zipCode = 'Zip/Postal code is required'
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Call service to update contact information
      await updateProfile({
        email: formData.email,
        phone: formData.phone,
        location: formData.address || profile?.location || '',
      })
      
      setSubmitSuccess(true)
      toast.success('Contact information updated successfully')
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      logger.error('Error updating contact information:', error)
      toast.error('Failed to update contact information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-2xl">
      {/* Page Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2">
            <SafeIcon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Contact Information</h1>
        </div>
        <p className="text-muted-foreground text-base">
          Update your contact details to ensure employers can reach you easily.
        </p>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <SafeIcon name="CheckCircle" size={16} className="text-green-600" />
          <AlertDescription className="text-green-800">
            Your contact information has been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Contact Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Keep your contact information up to date so employers can reach you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-lg">Email Address</h3>
              <div className="space-y-2">
                <Label htmlFor="email">Primary Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.email}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  This is the email employers will use to contact you about job opportunities.
                </p>
              </div>
            </div>

            {/* Phone Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-lg">Phone Numbers</h3>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Primary Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone Number (Optional)</Label>
                <Input
                  id="alternatePhone"
                  name="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone || ''}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 987-6543"
                  className={errors.alternatePhone ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.alternatePhone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.alternatePhone}
                  </p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-lg">Address</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  className={errors.address ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <SafeIcon name="AlertCircle" size={14} />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className={errors.city ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <SafeIcon name="AlertCircle" size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className={errors.state ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <SafeIcon name="AlertCircle" size={14} />
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className={errors.zipCode ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <SafeIcon name="AlertCircle" size={14} />
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className={errors.country ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <SafeIcon name="AlertCircle" size={14} />
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <SafeIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SafeIcon name="Save" size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="mt-6 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Why We Need This Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Email:</strong> Employers use this to send you job offers and interview invitations.
          </p>
          <p>
            • <strong>Phone:</strong> Recruiters may call to discuss opportunities or schedule interviews.
          </p>
          <p>
            • <strong>Address:</strong> Some employers need this for background checks or relocation assistance.
          </p>
          <p>
            • <strong>Location:</strong> Helps employers find candidates in their desired geographic area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
