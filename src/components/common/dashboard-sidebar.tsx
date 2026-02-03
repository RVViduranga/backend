import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  currentPage = "",
}: DashboardSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isBrowser || !mounted) {
    return null;
  }

  const menuItems =
    variant === "company" ? COMPANY_DASHBOARD_MENU_ITEMS : USER_DASHBOARD_MENU_ITEMS;

  return (
    <>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <SafeIcon name="Briefcase" size={20} color="white" />
          </div>
          <div>
            <p className="font-semibold text-sm">JobCenter</p>
            <p className="text-xs text-muted-foreground">
              {variant === "company" ? "Employer Portal" : "Job Seeker Portal"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPage === item.href}
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
