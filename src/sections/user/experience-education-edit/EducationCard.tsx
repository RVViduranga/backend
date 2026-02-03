
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

interface EducationCardProps {
  education: Education
  onEdit: (education: Education) => void
  onDelete: (id: string) => void
}

export default function EducationCard({
  education,
  onEdit,
  onDelete,
}: EducationCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const startDate = formatDate(education.startDate)
  const endDate = education.currentlyStudying ? 'Present' : formatDate(education.endDate)
  const dateRange = `${startDate} - ${endDate}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{education.degree}</CardTitle>
            <CardDescription className="text-base">{education.school}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(education)}
              title="Edit education"
            >
              <SafeIcon name="Edit2" size={18} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete education">
                  <SafeIcon name="Trash2" size={18} className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Education</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this education entry? This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-muted p-3 rounded-md mb-4">
                  <p className="font-semibold text-sm">{education.degree}</p>
                  <p className="text-sm text-muted-foreground">{education.school}</p>
                </div>
                <div className="flex gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(education.id)}
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
            <SafeIcon name="BookOpen" size={16} />
            <span>{education.fieldOfStudy}</span>
          </div>
          {education.grade && (
            <div className="flex items-center gap-2">
              <SafeIcon name="Award" size={16} />
              <span>GPA: {education.grade}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {education.description && (
          <p className="text-sm text-foreground leading-relaxed">{education.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
