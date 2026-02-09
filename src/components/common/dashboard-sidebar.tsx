import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import SafeIcon from "@/components/common/safe-icon";
import {
  USER_DASHBOARD_MENU_ITEMS,
  COMPANY_DASHBOARD_MENU_ITEMS,
} from "@/constants/navigation";

interface DashboardSidebarProps {
  variant?: "user" | "company";
  currentPage?: string;
}

export default function DashboardSidebar({
  variant = "user",
  currentPage,
}: DashboardSidebarProps) {
  const location = useLocation();
  // Use currentPage prop if provided, otherwise use current location pathname
  const activePage = currentPage || location.pathname;

  const menuItems =
    variant === "company" ? COMPANY_DASHBOARD_MENU_ITEMS : USER_DASHBOARD_MENU_ITEMS;

  return (
    <>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePage === item.href || activePage.startsWith(item.href + "/")}
                  >
                    <Link to={item.href}>
                      <SafeIcon name={item.icon} size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/help-support">
                <SafeIcon name="HelpCircle" size={18} />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/login">
                <SafeIcon name="LogOut" size={18} />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
