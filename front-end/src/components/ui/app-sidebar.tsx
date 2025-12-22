"use client"

import * as React from "react"
import {
  Home,
  MessageCircle,
  Plus,
  Settings,
  Users,
} from "lucide-react"

import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { DraggableNavMain } from "./draggable-dropdown"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { getUser } from "@/lib/auth"
import { NavMain } from "./nav-main"

const data = {
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
    {
      id: "google",
      name: "Google",
      url: "https://google.com",
      favicon: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
    },
    {
      id: "airbnb",
      name: "Airbnb",
      url: "https://airbnb.com",
      favicon: "https://www.google.com/s2/favicons?sz=64&domain=airbnb.com",
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com",
      favicon: "https://www.google.com/s2/favicons?sz=64&domain=github.com",
    }
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState(getUser());

  React.useEffect(() => {
    const handleUserChange = () => {
      setUser(getUser());
    };
    
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const dataUser = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar || "/avatars/shadcn.jpg",
    },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher user={dataUser.user} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.projects} />

        <div className="p-3">
          <DraggableNavMain
            items={data.favorites}
            title="Favorites"
            triggerLabel="Favorites"
            onOrderChange={(newItems) =>
              console.log("favorites order", newItems)
            }
          />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-gray-500">
          <NavMain items={data.extends} />
        </div>

        <NavUser user={dataUser.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
