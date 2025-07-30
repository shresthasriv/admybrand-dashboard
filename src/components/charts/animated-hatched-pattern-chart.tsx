"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import React from "react";

interface AnimatedHatchedPatternAreaChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey1: string;
  dataKey2?: string;
  xAxisDataKey: string;
  height?: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile", 
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ActiveProperty = keyof typeof chartConfig;

export function AnimatedHatchedPatternAreaChart({
  title,
  description,
  data,
  dataKey1,
  dataKey2,
  xAxisDataKey,
  height = 350
}: AnimatedHatchedPatternAreaChartProps) {
  const [activeProperty, setActiveProperty] =
    React.useState<ActiveProperty | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
          <AreaChart 
            accessibilityLayer 
            data={data}
            width="100%"
            height={height}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisDataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <HatchedBackgroundPattern config={chartConfig} />
              <linearGradient
                id="hatched-background-pattern-grad-desktop"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0}
                />
              </linearGradient>
              {dataKey2 && (
                <linearGradient
                  id="hatched-background-pattern-grad-mobile"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0}
                  />
                </linearGradient>
              )}
            </defs>
            {dataKey2 && (
              <Area
                onMouseEnter={() => setActiveProperty("mobile")}
                onMouseLeave={() => setActiveProperty(null)}
                dataKey={dataKey2}
                type="natural"
                fill={
                  activeProperty === "mobile"
                    ? "url(#hatched-background-pattern-mobile)"
                    : "url(#hatched-background-pattern-grad-mobile)"
                }
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
                strokeWidth={0.8}
              />
            )}
            <Area
              onMouseEnter={() => setActiveProperty("desktop")}
              onMouseLeave={() => setActiveProperty(null)}
              dataKey={dataKey1}
              type="natural"
              fill={
                activeProperty === "desktop"
                  ? "url(#hatched-background-pattern-desktop)"
                  : "url(#hatched-background-pattern-grad-desktop)"
              }
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
              strokeWidth={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const HatchedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );
  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`hatched-background-pattern-${key}`}
          x="0"
          y="0"
          width="6.81"
          height="6.81"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
          overflow="visible"
        >
          <g overflow="visible" className="will-change-transform">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="6 0"
              dur="1s"
              repeatCount="indefinite"
            />
            <rect width="10" height="10" opacity={0.05} fill={value} />
            <rect width="1" height="10" fill={value} />
          </g>
        </pattern>
      ))}
    </>
  );
}; 