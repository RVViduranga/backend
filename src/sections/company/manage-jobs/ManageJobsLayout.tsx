import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import ManageJobsContent from './ManageJobsContent'

interface ManageJobsLayoutProps {
  currentPage?: string
}

export default function ManageJobsLayout({ 
  currentPage = '/manage-jobs'
}: ManageJobsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="company" currentPage={currentPage}>
      <ManageJobsContent />
    </ClientSidebarWrapper>
  )
}