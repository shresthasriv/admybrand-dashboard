"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import React, { SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import type { ChartDataPoint } from "@/lib/mock-data";
interface MonochromeBarChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  dataKey: string;
  xAxisDataKey: string;
  height?: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--secondary-foreground)",
  },
} satisfies ChartConfig;

export function MonochromeBarChart({
  description,
  data,
  dataKey,
  xAxisDataKey,
  height = 350
}: MonochromeBarChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined
  );

  const activeData = React.useMemo(() => {
    if (activeIndex === undefined) return null;
    return data[activeIndex];
  }, [activeIndex, data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span
            className={cn(jetBrainsMono.className, "text-2xl tracking-tighter")}
          >
            ${activeData ? activeData[dataKey] : data[0]?.[dataKey] || "123"}
          </span>
          <Badge variant="secondary">
            <TrendingUp className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
            <BarChart
              accessibilityLayer
              data={data}
              width={400}
              height={height}
              onMouseLeave={() => setActiveIndex(undefined)}
              barCategoryGap="2%"
            >
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar
                dataKey={dataKey}
                fill="var(--secondary-foreground)"
                shape={
                  <CustomBar
                    setActiveIndex={setActiveIndex}
                    activeIndex={activeIndex}
                    totalBars={data.length}
                  />
                }
              ></Bar>
            </BarChart>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface CustomBarProps extends SVGProps<SVGSVGElement> {
  setActiveIndex: (index?: number) => void;
  index?: number;
  activeIndex?: number;
  value?: string;
  totalBars: number;
}

const CustomBar = (props: CustomBarProps) => {
  const { fill, x, y, width, height, index, activeIndex, value } = props;

  // Custom variables
  const xPos = Number(x || 0);
  const realWidth = Number(width || 0);
  const isActive = index === activeIndex;
  const collapsedWidth = 3; // Thin collapsed bars
  
  // Much more subtle expansion - just enough to be noticeable
  const expandedWidth = Math.min(realWidth * 0.8, collapsedWidth + 25); // Much smaller expansion
  
  // Center the collapsed bar, but expand from original position
  const barX = isActive ? xPos + (realWidth - expandedWidth) / 2 : xPos + (realWidth - collapsedWidth) / 2;
  const barWidth = isActive ? expandedWidth : collapsedWidth;
  
  // Text position (always centered on the original bar position)
  const textX = xPos + realWidth / 2;
  
  // Hover area - covers the full bar width for easier interaction
  const hoverAreaWidth = realWidth;
  const hoverAreaX = xPos;

  return (
    <g>
      {/* Large invisible hover area for better UX */}
      <rect
        x={hoverAreaX}
        y={y}
        width={hoverAreaWidth}
        height={height}
        fill="transparent"
        onMouseEnter={() => props.setActiveIndex(index)}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Visible animated bar */}
      <motion.rect
        style={{
          willChange: "transform, width", // helps with performance
        }}
        y={y}
        initial={{ width: collapsedWidth, x: xPos + (realWidth - collapsedWidth) / 2 }}
        animate={{ 
          width: barWidth, 
          x: barX 
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        height={height}
        fill={fill}
        rx={2} // Slightly rounded corners
      />
      
      {/* Render value text on top of bar */}
      {isActive && (
        <motion.text
          style={{
            willChange: "transform, opacity", // helps with performance
          }}
          className={jetBrainsMono.className}
          key={index}
          initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.2 }}
          x={textX}
          y={Number(y) - 8}
          textAnchor="middle"
          fill={fill}
          fontSize="14"
          fontWeight="600"
        >
          {value}
        </motion.text>
      )}
    </g>
  );
}; 