import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import ApplicationsContent from './ApplicationsContent'

interface ApplicationsLayoutProps {
  currentPage?: string
}

export default function ApplicationsLayout({ 
  currentPage = '/company-applications'
}: ApplicationsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="company" currentPage={currentPage}>
      <ApplicationsContent />
    </ClientSidebarWrapper>
  )
}








