import { Home, History, Images, BookOpen, User, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "History", url: "/history", icon: History },
  { title: "Gallery", url: "/storage", icon: Images },
  { title: "Prompts", url: "/prompts", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isExpanded = mainItems.some((i) => isActive(i.url));
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted/50";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo Section */}
        <div className={`flex items-center gap-3 p-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt="PIXARIS" className="w-8 h-8" />
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm bg-gradient-primary bg-clip-text text-transparent">
                PIXARIS
              </h2>
              <p className="text-xs text-muted-foreground">Craft Your Vision</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={collapsed ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button at Bottom */}
        <div className="mt-auto border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                <LogOut className={collapsed ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                {!collapsed && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
