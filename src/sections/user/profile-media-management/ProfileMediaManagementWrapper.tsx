import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import ProfileMediaManagement from './ProfileMediaManagement'

interface ProfileMediaManagementWrapperProps {
  currentPage?: string
}

export default function ProfileMediaManagementWrapper({ 
  currentPage = '/profile-media-management'
}: ProfileMediaManagementWrapperProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <ProfileMediaManagement />
    </ClientSidebarWrapper>
  )
}








