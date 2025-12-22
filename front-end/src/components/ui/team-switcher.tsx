"use client"

import * as React from "react"
import { ChevronsUpDown, Ellipsis, Plus, Settings, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import SearchInput from "@/components/ui/search-input"

import { getUser } from "@/lib/auth"

const projects = [
  {
    name: "Account settings",
    url: "#",
    icon: User,
  },
  {
    name: "Organization settings",
    url: "#",
    icon: Settings,
  },
];
  
export function TeamSwitcher({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-6 w-6 rounded-md border-2 border-solid border-gray-200">
                <AvatarFallback className="rounded-md bg-gray-200/50">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <SearchInput></SearchInput>

            <DropdownMenuSeparator />
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-5 w-5 rounded-xs border border-solid border-gray-200">
                <AvatarFallback className="rounded-xs bg-gray-200/50">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate">{user.name}</span>
              </div>
              <div className="relative">
                  <input checked type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 bg-gray-200 rounded-full border-2 border-gray-300 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200 peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:ring-offset-2"></div>
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
              </div>
            </SidebarMenuButton>
            <DropdownMenuItem className="gap-2 p-2">
              <Ellipsis />
              <div className="text-muted-foreground font-medium">
                All organizations
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <SidebarMenu>
              {projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <Plus className="text-black" />
              <div className="font-medium">Add organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
