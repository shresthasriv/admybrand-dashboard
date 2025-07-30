"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { motion } from "motion/react"
// Components
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedHatchedPatternAreaChart } from "@/components/charts/animated-hatched-pattern-chart"
import { MonochromeBarChart } from "@/components/charts/monochrome-bar-chart"
import { PingingDotChart } from "@/components/charts/pinging-dot-chart"
import { RoundedPieChart } from "@/components/charts/rounded-pie-chart"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Icons
import { 
  Download, 
  RefreshCw,
  BarChart3,
} from "lucide-react"

// Data and utilities
import {
  revenueData,
  trafficSourcesData,
  monthlyPerformanceData,
  dailyActiveUsersData
} from "@/lib/mock-data"
import { exportToPDF } from "@/lib/export-utils"

export default function AnalyticsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExportToPdf = async () => {
    setIsExporting(true)
    try {
      await exportToPDF('analytics-content', `admybrand-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Export failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.'
      alert(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <Image
                    src="/web-logo.svg"
                    alt="ADmyBRAND"
                    width={40}
                    height={40}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    priority
                  />
                </div>
                <h1 className="text-xl sm:text-3xl font-bold">
                  Dashboard
                </h1>
              </div>
              <div>
                <Badge variant="secondary" className="text-xs">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Charts
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="hidden sm:block">
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportToPdf}
                disabled={isExporting}
                className="flex-1 sm:flex-none"
              >
                <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Date Picker */}
          <div className="mt-3 sm:hidden">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="container mx-auto px-2 sm:px-4 py-4 sm:py-8" 
        id="analytics-content"
      >
        {/* Navigation Buttons */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2">
            {/* Navigation buttons removed, now in sidebar */}
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <AnimatedHatchedPatternAreaChart
              title="Revenue Trend"
              description="Daily revenue over the last 30 days"
              data={revenueData}
              dataKey1="desktop"
              dataKey2="mobile"
              xAxisDataKey="month"
              height={300}
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <PingingDotChart
              title="Active Users"
              description="Daily active users for the past 2 weeks"
              data={dailyActiveUsersData}
              dataKey="desktop"
              xAxisDataKey="month"
              height={300}
            />
          </div>
        </motion.div>

        {/* Charts Row 2 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-[1.02]">
            <MonochromeBarChart
              title="Monthly Performance"
              description="Revenue vs costs comparison by month"
              data={monthlyPerformanceData}
              dataKey="desktop"
              xAxisDataKey="month"
              height={350}
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <RoundedPieChart
              title="Traffic Sources"
              description="Breakdown of traffic by source"
              data={trafficSourcesData}
              dataKey="value"
              nameKey="name"
              height={350}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center text-xs sm:text-sm text-muted-foreground pt-6 sm:pt-8 border-t"
        >
          <p>© 2024 ADmyBRAND Analytics. Advanced chart visualizations and insights.</p>
          <p className="mt-2">
            Data refreshed every 5 minutes • 
            <span className="mx-2">•</span>
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </motion.footer>
      </motion.main>
    </motion.div>
  )
} 