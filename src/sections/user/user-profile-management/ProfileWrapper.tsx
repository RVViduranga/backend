import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import UserProfileManagement from './UserProfileManagement'

interface ProfileWrapperProps {
  currentPage?: string
}

export default function ProfileWrapper({ currentPage = '/user-profile-management' }: ProfileWrapperProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <UserProfileManagement />
    </ClientSidebarWrapper>
  )
}