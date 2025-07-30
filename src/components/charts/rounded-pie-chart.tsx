"use client";

import { LabelList, Pie, PieChart } from "recharts";
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

import type { ChartDataPoint } from "@/lib/mock-data";
interface RoundedPieChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  dataKey: string;
  nameKey: string;
  height?: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
  other2: {
    label: "Other",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RoundedPieChart({
  title,
  description,
  data,
  dataKey,
  height = 250
}: RoundedPieChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
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
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full [&_.recharts-text]:fill-background mx-auto aspect-square"
          style={{ maxHeight: `${height}px` }}
        >
          <PieChart width={height} height={height}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={dataKey} hideLabel />}
            />
            <Pie
              data={data}
              innerRadius={30}
              dataKey={dataKey}
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey={dataKey}
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 