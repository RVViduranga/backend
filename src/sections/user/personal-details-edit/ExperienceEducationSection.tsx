
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/safe-icon'

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationYear: string
}

interface ExperienceEducationSectionProps {
  experience: Experience[]
  education: Education[]
  onNavigate: () => void
}

export default function ExperienceEducationSection({
  experience,
  education,
  onNavigate,
}: ExperienceEducationSectionProps) {
  const formatDate = (dateStr: string) => {
    if (dateStr === 'present') return 'Present'
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6">
      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="Briefcase" size={24} />
            Work Experience
          </CardTitle>
          <CardDescription>
            {experience.length} position{experience.length !== 1 ? 's' : ''} listed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <Badge variant="secondary">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon name="Briefcase" size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No work experience added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SafeIcon name="GraduationCap" size={24} />
            Education
          </CardTitle>
          <CardDescription>
            {education.length} qualification{education.length !== 1 ? 's' : ''} listed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {education.length > 0 ? (
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.field}</p>
                    </div>
                    <Badge variant="outline">
                      Graduated {edu.graduationYear}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon name="GraduationCap" size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No education added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Button */}
      <div className="flex gap-2">
        <Button className="flex-1" asChild>
          <Link to="/experience-education-edit">
            <SafeIcon name="Edit2" size={16} className="mr-2" />
            Edit Experience & Education
          </Link>
        </Button>
      </div>
    </div>
  )
}
