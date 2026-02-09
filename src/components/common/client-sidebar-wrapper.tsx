import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/common/dashboard-sidebar'
import CommonFooter from '@/components/common/common-footer'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

interface ClientSidebarWrapperProps {
  variant?: 'user' | 'company'
  currentPage?: string
  children: React.ReactNode
}

export default function ClientSidebarWrapper({ 
  variant = 'user',
  currentPage,
  children
}: ClientSidebarWrapperProps) {
  const location = useLocation()
  // Use currentPage prop if provided, otherwise use current location pathname
  const activePage = currentPage || location.pathname

  // Prevent body scroll when sidebar is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])
  
  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="top-[64px] bottom-[80px] h-[calc(100vh-64px-80px)]">
        <DashboardSidebar variant={variant} currentPage={activePage} />
      </Sidebar>
      
      <SidebarInset className="flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-24 scrollbar-thin">
          {children}
        </div>
        <div className="w-screen relative left-1/2 -translate-x-1/2 md:absolute md:left-0 md:right-0 md:bottom-0 md:top-auto md:w-full md:translate-x-0">
          <CommonFooter variant="simple" />
        </div>
      </SidebarInset>
      
    </SidebarProvider> 
  )
}