import ClientSidebarWrapper from '@/components/common/client-sidebar-wrapper'
import DashboardOverview from './DashboardOverview'

interface UserDashboardLayoutProps {
  currentPage?: string
}

export default function UserDashboardLayout({ 
  currentPage = ''
}: UserDashboardLayoutProps) {
  return (
    <ClientSidebarWrapper variant="user" currentPage={currentPage}>
      <DashboardOverview />
    </ClientSidebarWrapper>
  )
}