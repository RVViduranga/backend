import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import UserApplicationsContent from './UserApplicationsContent'

interface UserApplicationsLayoutProps {
  currentPage?: string
}

export default function UserApplicationsLayout({ 
  currentPage = ''
}: UserApplicationsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <UserApplicationsContent />
    </ClientSidebarWrapper>
  )
}








