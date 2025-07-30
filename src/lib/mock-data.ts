import { format, subDays, subMonths } from "date-fns"

// Types
export interface MetricCard {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: string
}

export interface ChartDataPoint {
  date?: string;
  value?: number;
  month?: string;
  desktop?: number;
  mobile?: number;
  revenue?: number;
  users?: number;
  costs?: number;
  profit?: number;
  sessions?: number;
  name?: string;
  [key: string]: string | number | undefined;
}

export interface TableRow {
  id: string
  campaign: string
  status: "active" | "paused" | "completed"
  clicks: number
  conversions: number
  cost: number
  revenue: number
  roi: number
}

// Generate date range for charts
const generateDateRange = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    return format(date, "MMM dd")
  })
}

// Simulation state for realistic data correlation
const simulationState = {
  baseRevenue: 847352,
  baseUsers: 24567,
  baseConversions: 3428,
  baseGrowthRate: 23.4,
  lastUpdate: Date.now(),
  dailyTrend: 1, // 1 for positive, -1 for negative, 0 for neutral
  revenueVelocity: 0,
  userVelocity: 0,
  conversionVelocity: 0
}

// Generate correlated real-time data that affects all metrics
export const generateRealTimeData = () => {
  const now = Date.now()
  // const timeFactorMinutes = timeDiff / (1000 * 60) // Convert to minutes (unused)

  // Simulate market fluctuations (every 30 seconds chance to change trend)
  if (Math.random() < 0.1) {
    simulationState.dailyTrend = Math.random() < 0.7 ? 1 : Math.random() < 0.5 ? 0 : -1
  }

  // Calculate velocity changes (momentum)
  simulationState.revenueVelocity += (Math.random() - 0.5) * 100
  simulationState.userVelocity += (Math.random() - 0.5) * 50
  simulationState.conversionVelocity += (Math.random() - 0.5) * 5

  // Apply dampening to prevent extreme values
  simulationState.revenueVelocity *= 0.95
  simulationState.userVelocity *= 0.95
  simulationState.conversionVelocity *= 0.95

  // Generate current real-time activity based on trends
  const trendMultiplier = simulationState.dailyTrend === 1 ? 1.2 : simulationState.dailyTrend === -1 ? 0.8 : 1

  const activeUsers = Math.floor(
    (Math.random() * 800 + 2000) * trendMultiplier + simulationState.userVelocity
  )

  const pageViews = Math.floor(activeUsers * (3.5 + Math.random() * 2)) // 3.5-5.5 pages per user

  const conversionRate = (2.5 + Math.random() * 2 + simulationState.dailyTrend * 0.5) / 100 // 2.5-4.5%
  const conversions = Math.floor(pageViews * conversionRate)

  const avgOrderValue = 150 + Math.random() * 100 + simulationState.dailyTrend * 20 // $150-$270
  const revenue = Math.floor(conversions * avgOrderValue)

  simulationState.lastUpdate = now

  return {
    activeUsers,
    pageViews,
    conversions,
    revenue,
    conversionRate: conversionRate * 100,
    avgOrderValue,
    trendDirection: simulationState.dailyTrend
  }
}

// Generate dynamic performance metrics based on real-time data and cumulative state
export const generatePerformanceMetrics = (realTimeData: ReturnType<typeof generateRealTimeData>) => {
  // Update cumulative metrics based on real-time activity
  const timeFactor = 0.001 // How much real-time affects daily totals
  
  simulationState.baseRevenue += realTimeData.revenue * timeFactor
  simulationState.baseUsers += realTimeData.activeUsers * timeFactor * 0.1
  simulationState.baseConversions += realTimeData.conversions * timeFactor
  
  // Calculate growth rates based on trend
  const revenueGrowth = 8 + Math.random() * 8 + simulationState.dailyTrend * 4 // 8-20%
  const userGrowth = 5 + Math.random() * 6 + simulationState.dailyTrend * 3 // 5-14%
  const conversionGrowth = 10 + Math.random() * 10 + simulationState.dailyTrend * 5 // 10-25%
  const growthRate = simulationState.baseGrowthRate + (Math.random() - 0.5) * 2 + simulationState.dailyTrend * 1
  
  return [
    {
      title: "Total Revenue",
      value: formatCurrency(Math.floor(simulationState.baseRevenue)),
      change: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
      changeType: revenueGrowth > 0 ? "increase" as const : "decrease" as const,
      icon: "DollarSign" as const
    },
    {
      title: "Active Users",
      value: formatNumber(Math.floor(simulationState.baseUsers)),
      change: `${userGrowth > 0 ? '+' : ''}${userGrowth.toFixed(1)}%`,
      changeType: userGrowth > 0 ? "increase" as const : "decrease" as const,
      icon: "Users" as const
    },
    {
      title: "Conversions",
      value: formatNumber(Math.floor(simulationState.baseConversions)),
      change: `${conversionGrowth > 0 ? '+' : ''}${conversionGrowth.toFixed(1)}%`,
      changeType: conversionGrowth > 0 ? "increase" as const : "decrease" as const,
      icon: "Target" as const
    },
    {
      title: "Growth Rate",
      value: `${growthRate.toFixed(1)}%`,
      change: `${simulationState.dailyTrend > 0 ? '+' : simulationState.dailyTrend < 0 ? '' : '±'}${(simulationState.dailyTrend * 2.1).toFixed(1)}%`,
      changeType: simulationState.dailyTrend > 0 ? "increase" as const : simulationState.dailyTrend < 0 ? "decrease" as const : "neutral" as const,
      icon: "TrendingUp" as const
    }
  ]
}

// Static initial metrics (will be replaced by dynamic ones)
export const metricsData: MetricCard[] = [
  {
    title: "Total Revenue",
    value: "$847,352",
    change: "+12.3%",
    changeType: "increase",
    icon: "DollarSign"
  },
  {
    title: "Active Users",
    value: "24,567",
    change: "+8.1%",
    changeType: "increase",
    icon: "Users"
  },
  {
    title: "Conversions",
    value: "3,428",
    change: "+15.7%",
    changeType: "increase",
    icon: "Target"
  },
  {
    title: "Growth Rate",
    value: "23.4%",
    change: "-2.1%",
    changeType: "decrease",
    icon: "TrendingUp"
  }
]

// Revenue chart data (30 days) with desktop and mobile
export const revenueData: ChartDataPoint[] = generateDateRange(30).map((date, index) => ({
  date,
  month: date,
  desktop: Math.floor(Math.random() * 50000) + 20000 + (index * 500),
  mobile: Math.floor(Math.random() * 30000) + 15000 + (index * 300),
  revenue: Math.floor(Math.random() * 50000) + 20000 + (index * 500),
  users: Math.floor(Math.random() * 2000) + 500 + (index * 20),
}))

// Traffic sources data (pie chart) - adapted for EvilCharts
export const trafficSourcesData = [
  { name: "Organic Search", value: 4500, browser: "chrome", fill: "var(--chart-1)" },
  { name: "Paid Ads", value: 3200, browser: "safari", fill: "var(--chart-2)" },
  { name: "Social Media", value: 2800, browser: "firefox", fill: "var(--chart-3)" },
  { name: "Direct", value: 2100, browser: "edge", fill: "var(--chart-4)" },
  { name: "Email", value: 1500, browser: "other", fill: "var(--chart-5)" },
  { name: "Referral", value: 800, browser: "other2", fill: "var(--chart-1)" }
]

// Monthly performance data (bar chart) - adapted for EvilCharts
export const monthlyPerformanceData: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const dateObj = subMonths(new Date(), 11 - i);
  const revenue = Math.floor(Math.random() * 100000) + 50000;
  const costs = Math.floor(Math.random() * 40000) + 20000;
  return {
    date: format(dateObj, "yyyy-MM-dd"),
    month: format(dateObj, "MMM"),
    desktop: revenue,
    revenue: revenue,
    costs: costs,
    profit: revenue - costs,
    value: revenue // fallback for charts expecting value
  };
});

// Daily active users data (line chart) - adapted for EvilCharts  
export const dailyActiveUsersData: ChartDataPoint[] = generateDateRange(14).map((date, index) => ({
  date,
  month: date,
  desktop: Math.floor(Math.random() * 5000) + 8000 + (index * 100),
  users: Math.floor(Math.random() * 5000) + 8000 + (index * 100),
  sessions: Math.floor(Math.random() * 8000) + 12000 + (index * 150),
}))

// Campaigns table data
export const campaignsTableData: TableRow[] = [
  {
    id: "1",
    campaign: "Summer Sale 2024",
    status: "active",
    clicks: 15420,
    conversions: 342,
    cost: 8500,
    revenue: 45200,
    roi: 432
  },
  {
    id: "2",
    campaign: "Black Friday Preview",
    status: "active",
    clicks: 23150,
    conversions: 567,
    cost: 12300,
    revenue: 78900,
    roi: 541
  },
  {
    id: "3",
    campaign: "Product Launch Q3",
    status: "completed",
    clicks: 8940,
    conversions: 189,
    cost: 5600,
    revenue: 23400,
    roi: 318
  },
  {
    id: "4",
    campaign: "Holiday Special",
    status: "paused",
    clicks: 11200,
    conversions: 278,
    cost: 7200,
    revenue: 31800,
    roi: 342
  },
  {
    id: "5",
    campaign: "New Customer Acquisition",
    status: "active",
    clicks: 19800,
    conversions: 445,
    cost: 11800,
    revenue: 58700,
    roi: 397
  },
  {
    id: "6",
    campaign: "Retargeting Campaign",
    status: "active",
    clicks: 7650,
    conversions: 198,
    cost: 4200,
    revenue: 19600,
    roi: 367
  },
  {
    id: "7",
    campaign: "Brand Awareness",
    status: "completed",
    clicks: 28900,
    conversions: 234,
    cost: 15600,
    revenue: 28900,
    roi: 85
  },
  {
    id: "8",
    campaign: "Mobile App Promotion",
    status: "active",
    clicks: 13400,
    conversions: 356,
    cost: 8900,
    revenue: 42300,
    roi: 375
  }
]

// Export utility functions
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
} 