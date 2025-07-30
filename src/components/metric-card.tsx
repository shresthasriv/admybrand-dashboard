"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Users, 
  Target, 
  TrendingUp, 
  TrendingDown,
  ArrowUpIcon,
  ArrowDownIcon,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: string
  className?: string
}

const iconMap = {
  DollarSign,
  Users,
  Target,
  TrendingUp,
}

export function MetricCard({ title, value, change, changeType, icon, className }: MetricCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp
  const isPositive = changeType === "increase"
  const isNeutral = changeType === "neutral"
  
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <IconComponent className={cn(
          "h-3 w-3 sm:h-4 sm:w-4 transition-colors",
          isPositive ? "text-green-600" : isNeutral ? "text-yellow-600" : "text-blue-600"
        )} />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
          <Badge 
            variant={isPositive ? "default" : "secondary"}
            className={cn(
              "flex items-center space-x-1 text-xs",
              isPositive 
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : isNeutral
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            )}
          >
            {isPositive ? (
              <ArrowUpIcon className="h-2 w-2 sm:h-3 sm:w-3" />
            ) : isNeutral ? (
              <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
            ) : (
              <ArrowDownIcon className="h-2 w-2 sm:h-3 sm:w-3" />
            )}
            <span>{change}</span>
          </Badge>
          <span className="hidden sm:inline">from last month</span>
          <span className="sm:hidden">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
} 