import { useEffect, useState } from 'react'
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/common/dashboard-sidebar'
import CommonFooter from '@/components/common/common-footer'

interface ClientSidebarWrapperProps {
  variant?: 'user' | 'company'
  currentPage?: string
  children: React.ReactNode
}

export default function ClientSidebarWrapper({ 
  variant = 'user',
  currentPage = '',
  children
}: ClientSidebarWrapperProps) {
  const isBrowser = typeof window !== 'undefined'
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isBrowser || !isClient) {
    return <div className="flex flex-col min-h-[calc(100vh-64px)]"><main className="flex-1 overflow-auto">{children}</main><CommonFooter variant="simple" /></div>
  }
  
  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="top-[64px] h-[calc(100vh-64px)]">
        <DashboardSidebar variant={variant} currentPage={currentPage} />
      </Sidebar>
      
      <SidebarInset className="flex flex-col min-h-[calc(100vh-64px)]">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <CommonFooter variant="simple" />
      </SidebarInset>
    </SidebarProvider>
  )
}