import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import CompanySettingsContent from './CompanySettingsContent'

interface CompanySettingsLayoutProps {
  currentPage?: string
}

export default function CompanySettingsLayout({ 
  currentPage = '/company-settings'
}: CompanySettingsLayoutProps) {
  return (
    <ClientSidebarWrapper variant="company" currentPage={currentPage}>
      <CompanySettingsContent />
    </ClientSidebarWrapper>
  )
}








