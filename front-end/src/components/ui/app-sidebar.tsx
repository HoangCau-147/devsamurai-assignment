"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  MessageCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react"

import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import DraggableDropdown from "./draggable-dropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { getUser } from "@/lib/auth"

const data = {
  user: {
    name: getUser()?.name,
    email: getUser()?.email,
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
    },
    {
      name: "Evil Corp.",
      logo: Command,
    },
  ],
  projects: [
    {
      name: "Home",
      url: "#",
      icon: Home,
    },
    {
      name: "Contacts",
      url: "#",
      icon: Users,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
  favorites: [
    { id: "google", name: "Google", icon: GalleryVerticalEnd },
    { id: "airbnb", name: "Airbnb", icon: AudioWaveform },
    { id: "microsoft", name: "Microsoft", icon: Command },
  ],
  extends: [
    {
      name: "Invite members",
      url: "#",
      icon: Plus,
    },
    {
      name: "Feedback",
      url: "#",
      icon: MessageCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavProjects items={data.projects} />

        <div className="p-3">
          <DraggableDropdown
            items={data.favorites}
            title="Favorites"
            triggerLabel="Favorites"
            onOrderChange={(newItems) => console.log("favorites order", newItems)}
          />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavProjects items={data.extends} />

        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
