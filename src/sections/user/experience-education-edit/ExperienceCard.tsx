
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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

interface ExperienceCardProps {
  experience: Experience
  onEdit: (experience: Experience) => void
  onDelete: (id: string) => void
}

export default function ExperienceCard({
  experience,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const startDate = formatDate(experience.startDate)
  const endDate = experience.currentlyWorking ? 'Present' : formatDate(experience.endDate)
  const dateRange = `${startDate} - ${endDate}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{experience.jobTitle}</CardTitle>
            <CardDescription className="text-base">{experience.company}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(experience)}
              title="Edit experience"
            >
              <SafeIcon name="Edit2" size={18} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete experience">
                  <SafeIcon name="Trash2" size={18} className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this work experience? This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-muted p-3 rounded-md mb-4">
                  <p className="font-semibold text-sm">{experience.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{experience.company}</p>
                </div>
                <div className="flex gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(experience.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <SafeIcon name="Calendar" size={16} />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <SafeIcon name="Briefcase" size={16} />
            <span>{experience.employmentType}</span>
          </div>
          {experience.location && (
            <div className="flex items-center gap-2">
              <SafeIcon name="MapPin" size={16} />
              <span>{experience.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {experience.description && (
          <p className="text-sm text-foreground leading-relaxed">{experience.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
