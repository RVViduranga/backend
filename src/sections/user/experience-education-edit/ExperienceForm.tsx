
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from "@/components/common/safe-icon"

interface Experience {
  id: string
  jobTitle: string
  company: string
  employmentType: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

interface ExperienceFormProps {
  initialData: Experience | null
  onSave: (data: Omit<Experience, 'id'>) => void
  onCancel: () => void
}

export default function ExperienceForm({
  initialData,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || '',
    company: initialData?.company || '',
    employmentType: initialData?.employmentType || 'Full-time',
    location: initialData?.location || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    currentlyWorking: initialData?.currentlyWorking || false,
    description: initialData?.description || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.currentlyWorking && !formData.endDate) {
      newErrors.endDate = 'End date is required if not currently working'
    }
    if (formData.startDate && formData.endDate && !formData.currentlyWorking) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      currentlyWorking: checked,
      endDate: checked ? '' : prev.endDate,
    }))
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SafeIcon name="Briefcase" size={24} />
          {initialData ? 'Edit Work Experience' : 'Add Work Experience'}
        </CardTitle>
        <CardDescription>
          {initialData
            ? 'Update your work experience details'
            : 'Add a new position to your professional history'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="e.g., Senior Product Designer"
              value={formData.jobTitle}
              onChange={handleChange}
              className={errors.jobTitle ? 'border-destructive' : ''}
            />
            {errors.jobTitle && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              name="company"
              placeholder="e.g., Tech Innovations Inc."
              value={formData.company}
              onChange={handleChange}
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.company}
              </p>
            )}
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select
              value={formData.employmentType}
              onValueChange={(value) => handleSelectChange('employmentType', value)}
            >
              <SelectTrigger id="employmentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="month"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'border-destructive' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date {!formData.currentlyWorking && '*'}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="month"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
                className={errors.endDate ? 'border-destructive' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <SafeIcon name="AlertCircle" size={14} />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Currently Working */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="currentlyWorking"
              checked={formData.currentlyWorking}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="currentlyWorking" className="font-normal cursor-pointer">
              I currently work here
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your responsibilities, achievements, and key projects..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <SafeIcon name="Save" size={16} className="mr-2" />
              Save Experience
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
