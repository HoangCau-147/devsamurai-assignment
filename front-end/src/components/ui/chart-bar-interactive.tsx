"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { addDays, parseISO } from "date-fns"
import { useAppSelector } from "@/store/hooks"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2025-10-02", people: 293, companies: 310 },
  { date: "2025-10-03", people: 247, companies: 190 },
  { date: "2025-10-04", people: 385, companies: 420 },
  { date: "2025-10-05", people: 481, companies: 390 },
  { date: "2025-10-06", people: 498, companies: 520 },
  { date: "2025-10-07", people: 388, companies: 300 },
  { date: "2025-10-08", people: 149, companies: 210 },
  { date: "2025-10-09", people: 227, companies: 180 },
  { date: "2025-10-10", people: 293, companies: 330 },
  { date: "2025-10-11", people: 335, companies: 270 },
  { date: "2025-10-12", people: 197, companies: 240 },
  { date: "2025-10-13", people: 197, companies: 160 },
  { date: "2025-10-14", people: 448, companies: 490 },
  { date: "2025-10-15", people: 473, companies: 380 },
  { date: "2025-10-16", people: 338, companies: 400 },
  { date: "2025-10-17", people: 499, companies: 420 },
  { date: "2025-10-18", people: 315, companies: 350 },
  { date: "2025-10-19", people: 235, companies: 180 },
  { date: "2025-10-20", people: 177, companies: 230 },
  { date: "2025-10-21", people: 82, companies: 140 },
  { date: "2025-10-22", people: 81, companies: 120 },
  { date: "2025-10-23", people: 252, companies: 290 },
  { date: "2025-10-24", people: 294, companies: 220 },
  { date: "2025-10-25", people: 201, companies: 250 },
  { date: "2025-10-26", people: 213, companies: 170 },
  { date: "2025-10-27", people: 420, companies: 460 },
  { date: "2025-10-28", people: 233, companies: 190 },
  { date: "2025-10-29", people: 78, companies: 130 },
  { date: "2025-10-30", people: 340, companies: 280 },
  { date: "2025-10-31", people: 178, companies: 230 },
  { date: "2025-11-01", people: 178, companies: 200 },
  { date: "2025-11-02", people: 470, companies: 410 },
  { date: "2025-11-03", people: 103, companies: 160 },
  { date: "2025-11-04", people: 439, companies: 380 },
  { date: "2025-11-05", people: 88, companies: 140 },
  { date: "2025-11-06", people: 294, companies: 250 },
  { date: "2025-11-07", people: 323, companies: 370 },
  { date: "2025-11-08", people: 385, companies: 320 },
  { date: "2025-11-09", people: 438, companies: 480 },
  { date: "2025-11-10", people: 155, companies: 200 },
  { date: "2025-11-11", people: 92, companies: 150 },
  { date: "2025-11-12", people: 492, companies: 420 },
  { date: "2025-11-13", people: 81, companies: 130 },
  { date: "2025-11-14", people: 426, companies: 380 },
  { date: "2025-11-15", people: 307, companies: 350 },
  { date: "2025-11-16", people: 371, companies: 310 },
  { date: "2025-11-17", people: 475, companies: 520 },
  { date: "2025-11-18", people: 107, companies: 170 },
  { date: "2025-11-19", people: 341, companies: 290 },
  { date: "2025-11-20", people: 408, companies: 450 },
  { date: "2025-11-21", people: 169, companies: 210 },
  { date: "2025-11-22", people: 317, companies: 270 },
  { date: "2025-11-23", people: 480, companies: 530 },
  { date: "2025-11-24", people: 132, companies: 180 },
  { date: "2025-11-25", people: 141, companies: 190 },
  { date: "2025-11-26", people: 434, companies: 380 },
  { date: "2025-11-27", people: 448, companies: 490 },
  { date: "2025-11-28", people: 149, companies: 200 },
  { date: "2025-11-29", people: 103, companies: 160 },
  { date: "2025-11-30", people: 446, companies: 400 },
  { date: "2025-12-01", people: 178, companies: 200 },
  { date: "2025-12-02", people: 470, companies: 410 },
  { date: "2025-12-03", people: 103, companies: 160 },
  { date: "2025-12-04", people: 439, companies: 380 },
  { date: "2025-12-05", people: 88, companies: 140 },
  { date: "2025-12-06", people: 294, companies: 250 },
  { date: "2025-12-07", people: 323, companies: 370 },
  { date: "2025-12-08", people: 385, companies: 320 },
  { date: "2025-12-09", people: 438, companies: 480 },
  { date: "2025-12-10", people: 155, companies: 200 },
  { date: "2025-12-11", people: 92, companies: 150 },
  { date: "2025-12-12", people: 492, companies: 420 },
  { date: "2025-12-13", people: 81, companies: 130 },
  { date: "2025-12-14", people: 426, companies: 380 },
  { date: "2025-12-15", people: 307, companies: 350 },
  { date: "2025-12-16", people: 371, companies: 310 },
  { date: "2025-12-17", people: 475, companies: 520 },
  { date: "2025-12-18", people: 107, companies: 170 },
  { date: "2025-12-19", people: 341, companies: 290 },
  { date: "2025-12-20", people: 408, companies: 450 },
  { date: "2025-12-21", people: 169, companies: 210 },
  { date: "2025-12-22", people: 317, companies: 270 },
  { date: "2025-12-23", people: 480, companies: 530 },
  { date: "2025-12-24", people: 132, companies: 180 },
  { date: "2025-12-25", people: 141, companies: 190 },
  { date: "2025-12-26", people: 434, companies: 380 },
  { date: "2025-12-27", people: 448, companies: 490 },
  { date: "2025-12-28", people: 149, companies: 200 },
  { date: "2025-12-29", people: 103, companies: 160 },
  { date: "2025-12-30", people: 446, companies: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  people: {
    label: "People",
    color: "var(--chart-2)",
  },
  companies: {
    label: "Companies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("people")

  const dateRange = useAppSelector((s) => s.dateRange)

  const filteredData = React.useMemo(() => {
    let from: Date | null = null
    let to: Date | null = null

    if (dateRange.mode === "preset") {
      to = new Date()
      from = addDays(to, -dateRange.days)
    } else if (dateRange.mode === "custom" && dateRange.from && dateRange.to) {
      from = parseISO(dateRange.from)
      to = parseISO(dateRange.to)
    }

    if (!from || !to) return chartData

    return chartData.filter((d) => {
      const date = new Date(d.date)
      return (date >= from && date <= to)
    })
  }, [dateRange])

  const total = React.useMemo(
    () => ({
      people: filteredData.reduce((acc, curr) => acc + curr.people, 0),
      companies: filteredData.reduce((acc, curr) => acc + curr.companies, 0),
    }),
    [filteredData]
  )

  return (
    <Card className="py-0 w-full">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Lead generation</CardTitle>
          <CardDescription>
            New contacts added to the pool.
          </CardDescription>
        </div>
        <div className="flex">
          {["people", "companies"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
