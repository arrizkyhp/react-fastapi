import { ChevronRight, ChevronsUpDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {Link, useLocation} from "react-router-dom";
import { menu } from "@/constants/menu.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import generateAbbreviation from "@/utils/generateAbbreviation.ts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MenuItem, SubMenuItem } from "@/types/menu.ts";
import {
  Popover,
  PopoverContentDialog,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

const AppSidebar = () => {
  const { isLoggingOut, authStatusData, logout } = useAuthStatus();
  const { username, email } = authStatusData || {};
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout({})
  };

  const isGroupActive = (submenu: SubMenuItem[]) => {
    return submenu.some((subItem) => location.pathname === subItem.url);
  };

  const activeClasses = "bg-red-100 text-sidebar-accent-foreground";

  return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold">
              My Application
            </SidebarGroupLabel>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item: MenuItem) => {
                  // If collapsed and has subitems, show popover
                  if (isCollapsed && item.isGroup && item.submenu) {
                    return (
                        <SidebarMenuItem key={item.title}>
                          <Popover>
                            <PopoverTrigger asChild>
                              <SidebarMenuButton
                                  tooltip={item.title}
                                  className={isGroupActive(item.submenu) ? activeClasses : ""}
                              >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                              </SidebarMenuButton>
                            </PopoverTrigger>
                            <PopoverContentDialog
                                side="right"
                                align="start"
                                className="w-48 p-1"
                                sideOffset={4}
                            >
                              <div className="grid gap-1">
                                <div className="px-2 py-1.5 text-sm font-semibold">
                                  {item.title}
                                </div>
                                {item.submenu.map((subItem) => (
                                    <Link
                                        to={subItem.url}
                                        key={subItem.title}
                                        // Apply activeClasses here for popover submenu
                                        className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                                            location.pathname === subItem.url
                                                ? activeClasses
                                                : ""
                                        }`}
                                    >
                                      {subItem.icon && (
                                          <subItem.icon className="h-4 w-4" />
                                      )}
                                      <span>{subItem.title}</span>
                                    </Link>
                                ))}
                              </div>
                            </PopoverContentDialog>
                          </Popover>
                        </SidebarMenuItem>
                    );
                  }

                  // If not collapsed and has subitems, show collapsible
                  if (!isCollapsed && item.isGroup && item.submenu) {
                    return (
                        <Collapsible
                            key={item.title}
                            className="group/collapsible"
                            defaultOpen={isGroupActive(item.submenu)}
                            asChild
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                  tooltip={item.title}
                                  className={
                                    isGroupActive(item.submenu) ? activeClasses : ""
                                  }
                              >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                {item.submenu && item.submenu.length > 0 && (
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                )}
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.submenu.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                            to={subItem.url}
                                            className={
                                              location.pathname === subItem.url
                                                  ? activeClasses
                                                  : ""
                                            }
                                        >
                                          {subItem.icon && <subItem.icon />}
                                          <span>{subItem.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                    );
                  }

                  // For regular menu items (no submenu or not a group)
                  return (
                      item.url && (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                              <Link
                                  to={item.url}
                                  className={
                                    location.pathname === item.url ? activeClasses : ""
                                  }
                              >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                      )
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <span className="text-sm font-semibold">
                      {generateAbbreviation(authStatusData?.username || "")}
                    </span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{username}</span>
                      <span className="truncate text-xs">{email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  );
};

export default AppSidebar;
