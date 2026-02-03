import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper"
import CompanyProfileEditContent from './CompanyProfileEditContent'

interface CompanyProfileEditLayoutProps {
  currentPage?: string
}

export default function CompanyProfileEditLayout({ 
  currentPage = '/company-profile-edit'
}: CompanyProfileEditLayoutProps) {
  return (
    <ClientSidebarWrapper variant="company" currentPage={currentPage}>
      <CompanyProfileEditContent />
    </ClientSidebarWrapper>
  )
}








