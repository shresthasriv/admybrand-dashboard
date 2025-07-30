"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

// Components
import { ThemeToggle } from "@/components/theme-toggle"
import { MetricCard } from "@/components/metric-card"
import { DataTable } from "@/components/data-table"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { LoadingAnimation } from "@/components/loading-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Icons
import { 
  BarChart3, 
  Download, 
  RefreshCw,
  Activity,
  Users,
  Eye,
  Clock,
  TrendingUp,
  DollarSign,
  MousePointer
} from "lucide-react"

// Data and utilities
import {
  metricsData,
  campaignsTableData,
  generateRealTimeData,
  generatePerformanceMetrics,
  formatCurrency,
  formatNumber
} from "@/lib/mock-data"
import { exportToPDF } from "@/lib/export-utils"

export default function OverviewPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [showContent, setShowContent] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  
  const [realTimeData, setRealTimeData] = React.useState(generateRealTimeData())
  const [performanceMetrics, setPerformanceMetrics] = React.useState(metricsData)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)

  // Handle loading animation completion
  const handleLoadingComplete = React.useCallback(() => {
    setIsLoading(false)
    setTimeout(() => {
      setShowContent(true)
    }, 300) // Small delay for smooth transition
  }, [])

  // Real-time data updates (only when content is shown)
  React.useEffect(() => {
    if (!showContent) return
    
    const interval = setInterval(() => {
      const newRealTimeData = generateRealTimeData()
      const newPerformanceMetrics = generatePerformanceMetrics(newRealTimeData)
      
      setRealTimeData(newRealTimeData)
      setPerformanceMetrics(newPerformanceMetrics)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [showContent])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const newRealTimeData = generateRealTimeData()
    const newPerformanceMetrics = generatePerformanceMetrics(newRealTimeData)
    
    setRealTimeData(newRealTimeData)
    setPerformanceMetrics(newPerformanceMetrics)
    setIsRefreshing(false)
  }

  const handleExportToPdf = async () => {
    setIsExporting(true)
    try {
      await exportToPDF('overview-content', `admybrand-overview-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Export failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.'
      alert(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  // Show loading animation first
  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />
  }

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-background"
        >
          {/* Header */}
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
          >
            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    >
                      <Image
                        src="/web-logo.svg"
                        alt="ADmyBRAND"
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10"
                        priority
                      />
                    </motion.div>
                    <motion.h1 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-xl sm:text-3xl font-bold"
                    >
                      Dashboard
                    </motion.h1>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto"
                >
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
                </motion.div>
              </div>
              
              {/* Mobile Date Picker */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-3 sm:hidden"
              >
                <DatePickerWithRange date={date} setDate={setDate} />
              </motion.div>
            </div>
          </motion.header>

          {/* Main Content */}
          <motion.main 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="container mx-auto px-2 sm:px-4 py-4 sm:py-8" 
            id="overview-content"
          >
            {/* Navigation Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2">
            {/* Navigation buttons removed, now in sidebar */}
              </div>
            </motion.div>

            {/* Real-time Activity - Separate Cards */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <Clock className="h-5 w-5 animate-pulse text-blue-600" />
                Real-time Activity
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                        <Users className="h-4 w-4" />
                        Active Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 animate-pulse">{formatNumber(realTimeData.activeUsers)}</div>
                      <p className="text-xs text-muted-foreground">Currently online</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
                        <Eye className="h-4 w-4" />
                        Page Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 animate-pulse">{formatNumber(realTimeData.pageViews)}</div>
                      <p className="text-xs text-muted-foreground">Last 5 minutes</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                        <MousePointer className="h-4 w-4" />
                        Conversions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600 animate-pulse">{formatNumber(realTimeData.conversions)}</div>
                      <p className="text-xs text-muted-foreground">This hour</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300">
                        <DollarSign className="h-4 w-4" />
                        Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600 animate-pulse">{formatCurrency(realTimeData.revenue)}</div>
                      <p className="text-xs text-muted-foreground">Live tracking</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            {/* Key Metrics Cards */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-6 sm:mb-8"
            >
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <TrendingUp className="h-5 w-5 text-green-600" />
                Key Performance Metrics
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {performanceMetrics.map((metric, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <MetricCard
                      title={metric.title}
                      value={metric.value}
                      change={metric.change}
                      changeType={metric.changeType}
                      icon={metric.icon}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Campaign Performance Table */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="mb-6 sm:mb-8 transform transition-all duration-300 hover:scale-[1.01]"
            >
              <DataTable
                data={campaignsTableData}
                title="Campaign Performance"
                description="Detailed performance metrics for all active and completed campaigns"
              />
            </motion.div>

            {/* Quick Analytics Preview */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="mb-6 sm:mb-8"
            >
              <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-dashed">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5" />
                    Advanced Analytics
                  </CardTitle>
                  <CardDescription>
                    Get deeper insights with our comprehensive analytics dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/analytics">
                    <Button size="lg" className="w-full sm:w-auto">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.footer 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="text-center text-xs sm:text-sm text-muted-foreground pt-6 sm:pt-8 border-t"
            >
              <p>© 2024 ADmyBRAND Overview. Real-time dashboard and insights.</p>
              <p className="mt-2">
                Real-time data updates every 5 seconds • 
                <span className="mx-2">•</span>
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </motion.footer>
          </motion.main>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
