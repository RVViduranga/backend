import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import CVManagementContent from './CVManagementContent'

interface CVManagementWrapperProps {
  currentPage?: string
}

export default function CVManagementWrapper({ 
  currentPage = '/cv-management'
}: CVManagementWrapperProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <CVManagementContent />
    </ClientSidebarWrapper>
  )
}