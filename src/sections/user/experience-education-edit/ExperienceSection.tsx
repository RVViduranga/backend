
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'
import ExperienceForm from '@/sections/user/experience-education-edit/ExperienceForm'
import ExperienceCard from '@/sections/user/experience-education-edit/ExperienceCard'
import { useUser } from '@/hooks/use-user-context'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import type { ExperienceModel } from '@/models/experience'

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

export default function ExperienceSection() {
  const { profile, isLoading, updateProfile } = useUser()
  
  // Transform profile experience data to component format
  const [experiences, setExperiences] = useState<Experience[]>([])
  
  useEffect(() => {
    if (profile?.experience) {
      const transformed = profile.experience.map((exp, index) => ({
        id: `exp_${index}`,
        jobTitle: exp.title,
        company: exp.company,
        employmentType: 'Full-time', // Default, could be enhanced
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate || '',
        currentlyWorking: exp.endDate === null,
        description: exp.description || '',
      }))
      setExperiences(transformed)
    }
  }, [profile])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Experience | null>(null)

  const handleAddNew = () => {
    setEditingId(null)
    setEditingData(null)
    setIsFormOpen(true)
  }

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id)
    setEditingData(experience)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      // Update local state first
      const updatedExperiences = experiences.filter((exp) => exp.id !== id)
      setExperiences(updatedExperiences)

      // Transform to ExperienceModel array for backend
      const experienceModels: ExperienceModel[] = updatedExperiences.map((exp) => ({
        title: exp.jobTitle,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.currentlyWorking ? null : exp.endDate,
        description: exp.description,
      }))

      // Call service to update profile with updated experience array
      await updateProfile({ experience: experienceModels })
      
      toast.success("Experience deleted successfully!")
    } catch (error) {
      logger.error("Error deleting experience:", error)
      toast.error("Failed to delete experience. Please try again.")
      // Reload from profile on error
      if (profile?.experience) {
        const transformed = profile.experience.map((exp, index) => ({
          id: `exp_${index}`,
          jobTitle: exp.title,
          company: exp.company,
          employmentType: 'Full-time',
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate || '',
          currentlyWorking: exp.endDate === null,
          description: exp.description || '',
        }))
        setExperiences(transformed)
      }
    }
  }

  const handleSave = async (data: Omit<Experience, 'id'>) => {
    try {
      // Transform component format to ExperienceModel format
      const experienceModel: ExperienceModel = {
        title: data.jobTitle,
        company: data.company,
        location: data.location,
        startDate: data.startDate,
        endDate: data.currentlyWorking ? null : data.endDate,
        description: data.description,
      }

      // Update local state first for immediate UI feedback
      let updatedExperiences: Experience[]
      if (editingId) {
        updatedExperiences = experiences.map((exp) =>
          exp.id === editingId ? { ...data, id: editingId } : exp
        )
      } else {
        const newExperience: Experience = {
          ...data,
          id: Date.now().toString(),
        }
        updatedExperiences = [newExperience, ...experiences]
      }
      setExperiences(updatedExperiences)

      // Transform to ExperienceModel array for backend
      const experienceModels: ExperienceModel[] = updatedExperiences.map((exp) => ({
        title: exp.jobTitle,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.currentlyWorking ? null : exp.endDate,
        description: exp.description,
      }))

      // Call service to update profile with new experience array
      await updateProfile({ experience: experienceModels })
      
      toast.success("Experience saved successfully!")
      setIsFormOpen(false)
      setEditingId(null)
      setEditingData(null)
    } catch (error) {
      logger.error("Error saving experience:", error)
      toast.error("Failed to save experience. Please try again.")
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
          Add Work Experience
        </Button>
      )}

      {/* Form */}
      {isFormOpen && (
        <ExperienceForm
          initialData={editingData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <SafeIcon name="Briefcase" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No work experience added yet</p>
            <Button onClick={handleAddNew} variant="outline">
              Add Your First Experience
            </Button>
          </div>
        ) : (
          experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
