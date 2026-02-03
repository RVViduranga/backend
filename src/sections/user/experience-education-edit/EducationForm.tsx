
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

interface Education {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  currentlyStudying: boolean
  grade: string
  description: string
}

interface EducationFormProps {
  initialData: Education | null
  onSave: (data: Omit<Education, 'id'>) => void
  onCancel: () => void
}

const degreeOptions = [
  'High School',
  'Associate Degree',
  'Bachelor of Science',
  'Bachelor of Arts',
  'Master of Science',
  'Master of Arts',
  'Master of Business Administration',
  'Doctor of Philosophy',
  'Other',
]

export default function EducationForm({
  initialData,
  onSave,
  onCancel,
}: EducationFormProps) {
  const [formData, setFormData] = useState({
    school: initialData?.school || '',
    degree: initialData?.degree || '',
    fieldOfStudy: initialData?.fieldOfStudy || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    currentlyStudying: initialData?.currentlyStudying || false,
    grade: initialData?.grade || '',
    description: initialData?.description || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.school.trim()) newErrors.school = 'School/University name is required'
    if (!formData.degree) newErrors.degree = 'Degree is required'
    if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.currentlyStudying && !formData.endDate) {
      newErrors.endDate = 'End date is required if not currently studying'
    }
    if (formData.startDate && formData.endDate && !formData.currentlyStudying) {
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
      currentlyStudying: checked,
      endDate: checked ? '' : prev.endDate,
    }))
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SafeIcon name="BookOpen" size={24} />
          {initialData ? 'Edit Education' : 'Add Education'}
        </CardTitle>
        <CardDescription>
          {initialData
            ? 'Update your education details'
            : 'Add a new educational qualification to your profile'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School/University */}
          <div className="space-y-2">
            <Label htmlFor="school">School/University *</Label>
            <Input
              id="school"
              name="school"
              placeholder="e.g., University of California, Berkeley"
              value={formData.school}
              onChange={handleChange}
              className={errors.school ? 'border-destructive' : ''}
            />
            {errors.school && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.school}
              </p>
            )}
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Select
              value={formData.degree}
              onValueChange={(value) => handleSelectChange('degree', value)}
            >
              <SelectTrigger id="degree" className={errors.degree ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a degree" />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.degree && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.degree}
              </p>
            )}
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of Study *</Label>
            <Input
              id="fieldOfStudy"
              name="fieldOfStudy"
              placeholder="e.g., Computer Science"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              className={errors.fieldOfStudy ? 'border-destructive' : ''}
            />
            {errors.fieldOfStudy && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <SafeIcon name="AlertCircle" size={14} />
                {errors.fieldOfStudy}
              </p>
            )}
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
              <Label htmlFor="endDate">End Date {!formData.currentlyStudying && '*'}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="month"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentlyStudying}
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

          {/* Currently Studying */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="currentlyStudying"
              checked={formData.currentlyStudying}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="currentlyStudying" className="font-normal cursor-pointer">
              I currently study here
            </Label>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade/GPA (Optional)</Label>
            <Input
              id="grade"
              name="grade"
              placeholder="e.g., 3.8 or A+"
              value={formData.grade}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Enter your GPA, percentage, or letter grade
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add any relevant details about your education, achievements, or coursework..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
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
              Save Education
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
