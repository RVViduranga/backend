import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import PersonalDetailsContent from './PersonalDetailsContent'

interface PersonalDetailsEditWrapperProps {
  currentPage?: string
}

export default function PersonalDetailsEditWrapper({ 
  currentPage = '/personal-details-edit'
}: PersonalDetailsEditWrapperProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <PersonalDetailsContent />
    </ClientSidebarWrapper>
  )
}