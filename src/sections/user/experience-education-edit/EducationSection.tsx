
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from "@/components/common/safe-icon"
import EducationForm from '@/sections/user/experience-education-edit/EducationForm'
import EducationCard from '@/sections/user/experience-education-edit/EducationCard'
import { useUser } from '@/hooks/use-user-context'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import type { EducationModel } from '@/models/user-profile'

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

export default function EducationSection() {
  const { profile, isLoading, updateProfile } = useUser()
  
  // Transform profile education data to component format
  const [educations, setEducations] = useState<Education[]>([])
  
  useEffect(() => {
    if (profile?.education) {
      const transformed = profile.education.map((edu, index) => ({
        id: `edu_${index}`,
        school: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        currentlyStudying: false, // Could be enhanced
        grade: '', // Not in current type
        description: '', // Not in current type
      }))
      setEducations(transformed)
    }
  }, [profile])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Education | null>(null)

  const handleAddNew = () => {
    setEditingId(null)
    setEditingData(null)
    setIsFormOpen(true)
  }

  const handleEdit = (education: Education) => {
    setEditingId(education.id)
    setEditingData(education)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      // Update local state first
      const updatedEducations = educations.filter((edu) => edu.id !== id)
      setEducations(updatedEducations)

      // Transform to EducationModel array for backend
      const educationModels: EducationModel[] = updatedEducations.map((edu) => ({
        institution: edu.school,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.currentlyStudying ? '' : edu.endDate,
      }))

      // Call service to update profile with updated education array
      await updateProfile({ education: educationModels })
      
      toast.success("Education deleted successfully!")
    } catch (error) {
      logger.error("Error deleting education:", error)
      toast.error("Failed to delete education. Please try again.")
      // Reload from profile on error
      if (profile?.education) {
        const transformed = profile.education.map((edu, index) => ({
          id: `edu_${index}`,
          school: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          currentlyStudying: false,
          grade: '',
          description: '',
        }))
        setEducations(transformed)
      }
    }
  }

  const handleSave = async (data: Omit<Education, 'id'>) => {
    try {
      // Update local state first for immediate UI feedback
      let updatedEducations: Education[]
      if (editingId) {
        updatedEducations = educations.map((edu) =>
          edu.id === editingId ? { ...data, id: editingId } : edu
        )
      } else {
        const newEducation: Education = {
          ...data,
          id: Date.now().toString(),
        }
        updatedEducations = [newEducation, ...educations]
      }
      setEducations(updatedEducations)

      // Transform to EducationModel array for backend
      const educationModels: EducationModel[] = updatedEducations.map((edu) => ({
        institution: edu.school,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.currentlyStudying ? '' : edu.endDate,
      }))

      // Call service to update profile with new education array
      await updateProfile({ education: educationModels })
      
      toast.success("Education saved successfully!")
      setIsFormOpen(false)
      setEditingId(null)
      setEditingData(null)
    } catch (error) {
      logger.error("Error saving education:", error)
      toast.error("Failed to save education. Please try again.")
      // Revert local state on error
      // Could reload from profile here if needed
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setEditingData(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!isFormOpen && (
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <SafeIcon name="Plus" size={16} className="mr-2" />
          Add Education
        </Button>
      )}

      {/* Form */}
      {isFormOpen && (
        <EducationForm
          initialData={editingData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Education List */}
      <div className="space-y-4">
        {educations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <SafeIcon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No education added yet</p>
            <Button onClick={handleAddNew} variant="outline">
              Add Your First Education
            </Button>
          </div>
        ) : (
          educations.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
