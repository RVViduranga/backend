import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import UserSettingsContent from './UserSettingsContent'

interface UserSettingsLayoutProps {
  currentPage?: string
}

export default function UserSettingsLayout({ 
  currentPage = ''
}: UserSettingsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <UserSettingsContent />
    </ClientSidebarWrapper>
  )
}








