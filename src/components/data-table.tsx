"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Search
} from "lucide-react"
import { TableRow as TableRowType, formatCurrency, formatNumber } from "@/lib/mock-data"

interface DataTableProps {
  data: TableRowType[]
  title: string
  description?: string
}

export function DataTable({ data, title, description }: DataTableProps) {
  const [filteredData, setFilteredData] = React.useState(data)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortField, setSortField] = React.useState<keyof TableRowType>("campaign")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)

  // Filter and sort data
  React.useEffect(() => {
    const filtered = data.filter(row => {
      const matchesSearch = row.campaign.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || row.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    setFilteredData(filtered)
  }, [data, searchTerm, statusFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

  const handleSort = (field: keyof TableRowType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToCsv = () => {
    const headers = ["Campaign", "Status", "Clicks", "Conversions", "Cost", "Revenue", "ROI"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        `"${row.campaign}"`,
        row.status,
        row.clicks,
        row.conversions,
        row.cost,
        row.revenue,
        row.roi
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "campaigns-data.csv"
    link.click()
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      completed: "outline"
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
          <Button onClick={exportToCsv} variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {paginatedData.map((row) => (
            <Card key={row.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{row.campaign}</h3>
                {getStatusBadge(row.status)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Clicks:</span>
                  <span className="ml-1 font-medium">{formatNumber(row.clicks)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Conversions:</span>
                  <span className="ml-1 font-medium">{formatNumber(row.conversions)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="ml-1 font-medium">{formatCurrency(row.cost)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="ml-1 font-medium">{formatCurrency(row.revenue)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className="ml-1 font-medium text-green-600">{row.roi}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("campaign")}>
                  <div className="flex items-center space-x-2">
                    <span>Campaign</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("clicks")}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>Clicks</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("conversions")}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>Conversions</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("cost")}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>Cost</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("revenue")}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>Revenue</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("roi")}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>ROI %</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.campaign}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.clicks)}</TableCell>
                  <TableCell className="text-right">{formatNumber(row.conversions)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.cost)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                  <TableCell className="text-right font-medium">{row.roi}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {Math.min(startIndex + 1, filteredData.length)} to{" "}
              {Math.min(startIndex + pageSize, filteredData.length)} of{" "}
              {filteredData.length} results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16 sm:w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 