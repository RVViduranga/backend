import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import DashboardContent from './DashboardContent'

interface DashboardLayoutProps {
  variant?: 'user' | 'company'
  currentPage?: string
}

export default function DashboardLayout({ 
  variant = 'company',
  currentPage = ''
}: DashboardLayoutProps) {
  return (
    <ClientSidebarWrapper variant={variant} currentPage={currentPage}>
      <DashboardContent />
    </ClientSidebarWrapper>
  )
}