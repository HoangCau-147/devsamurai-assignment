import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ChartBarInteractive } from "@/components/ui/chart-bar-interactive"
import { DatePickerWithRangeForm } from "@/components/ui/date-pick-range"
import { TableVisit, type ContactItem } from "@/components/Table"

import usePageTitle from "@/hooks/use-page-title"
import { CircleAlert } from "lucide-react"

const MOST_VISIT_CONTACTS: ContactItem[] = [
  { id: "1", name: "Airbnb", avatar: null, count: 3 },
  { id: "2", name: "Vivian Casey", avatar: null, count: 1 },
  { id: "3", name: "Zoom", avatar: null, count: 0 },
  { id: "4", name: "PayPal", avatar: null, count: 0 },
  { id: "5", name: "Thomas Clark", avatar: null, count: 0 },
  { id: "6", name: "Gabriel Fischer", avatar: null, count: 0 },
]

const LEAST_VISIT_CONTACTS: ContactItem[] = [
  { id: "1", name: "Ishaan Richardson", avatar: null, count: 0 },
  { id: "2", name: "Gabriel Fischer", avatar: null, count: 0 },
  { id: "3", name: "Thomas Clark", avatar: null, count: 0 },
  { id: "4", name: "PayPal", avatar: null, count: 0 },
  { id: "5", name: "Zoom", avatar: null, count: 0 },
  { id: "6", name: "Lucia Bianchi", avatar: null, count: 0 },
]

export default function Dashboard() {
  usePageTitle("home");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="w-full flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex flex-1 flex-row items-center">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-sm font-semibold">Overview</h1>
                <CircleAlert className="w-4 h-4" />
              </div>

              <div className="w-full flex items-center gap-2 pr-4 self-end">
                <a
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
                  href="https://github.com/achromaticlabs/pro"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 15 15"
                    className="size-4 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M7.5.25a7.25 7.25 0 0 0-2.292 14.13c.363.066.495-.158.495-.35 0-.172-.006-.628-.01-1.233-2.016.438-2.442-.972-2.442-.972-.33-.838-.805-1.06-.805-1.06-.658-.45.05-.441.05-.441.728.051 1.11.747 1.11.747.647 1.108 1.697.788 2.11.602.066-.468.254-.788.46-.969-1.61-.183-3.302-.805-3.302-3.583 0-.792.283-1.438.747-1.945-.075-.184-.324-.92.07-1.92 0 0 .61-.194 1.994.744A7 7 0 0 1 7.5 3.756 7 7 0 0 1 9.315 4c1.384-.938 1.992-.743 1.992-.743.396.998.147 1.735.072 1.919.465.507.745 1.153.745 1.945 0 2.785-1.695 3.398-3.31 3.577.26.224.492.667.492 1.343 0 .97-.009 1.751-.009 1.989 0 .194.131.42.499.349A7.25 7.25 0 0 0 7.499.25"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
                  href="https://x.com/achromaticlabs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    strokeLinejoin="round"
                    color="currentcolor"
                    viewBox="0 0 16 16"
                    className="size-4 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M.5.5h5.25l3.734 5.21L14 .5h2l-5.61 6.474L16.5 15.5h-5.25l-3.734-5.21L3 15.5H1l5.61-6.474L.5.5zM12.02 14L3.42 2h1.56l8.6 12h-1.56z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">X (formerly Twitter)</span>
                </a>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 pt-0">
          <div className="w-full border border-solid border-x-0 px-6">
            <DatePickerWithRangeForm />
          </div>
          <div className="w-full px-2 md:px-6">
            <div className="w-full mx-auto max-w-6xl">
              <ChartBarInteractive/>
              <div className="flex flex-col gap-2 md:flex-row md:gap-8 mt-2 md:mt-8 ">
                <TableVisit items={MOST_VISIT_CONTACTS} />
                <TableVisit title='Least visited contacts' items={LEAST_VISIT_CONTACTS} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
