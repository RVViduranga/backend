import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import SavedJobsContent from './SavedJobsContent'

interface SavedJobsLayoutProps {
  currentPage?: string
}

export default function SavedJobsLayout({ 
  currentPage = ''
}: SavedJobsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <SavedJobsContent />
    </ClientSidebarWrapper>
  )
}








