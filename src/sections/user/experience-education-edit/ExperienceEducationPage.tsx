
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import SafeIcon from "@/components/common/safe-icon"
import ExperienceSection from '@/sections/user/experience-education-edit/ExperienceSection'
import EducationSection from '@/sections/user/experience-education-edit/EducationSection'

export default function ExperienceEducationPage() {
  const [activeTab, setActiveTab] = useState('experience')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="-ml-2">
              <Link to="/personal-details-edit">
                <SafeIcon name="ArrowLeft" size={20} />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Experience & Education</h1>
          </div>
          <p className="text-muted-foreground text-base">
            Manage your work experience and educational background to enhance your job applications.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <SafeIcon name="Briefcase" size={16} />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <SafeIcon name="BookOpen" size={16} />
              <span>Education</span>
            </TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-8">
            <ExperienceSection />
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="mt-8">
            <EducationSection />
          </TabsContent>
        </Tabs>

        {/* Navigation Footer */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" asChild>
            <Link to="/personal-details-edit">
              <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Personal Details
            </Link>
          </Button>
          <Button asChild>
            <Link to="/user-profile-management">
              <SafeIcon name="Check" size={16} className="mr-2" />
              Done
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
