import jsPDF from 'jspdf'

export async function exportToPDF(elementId: string, filename: string = 'dashboard-report.pdf') {
  try {
    // Show loading state in title
    const originalTitle = document.title
    document.title = 'Generating PDF...'

    // Create PDF with dashboard summary data
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Add header
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('ADmyBRAND Insights', pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 10
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Analytics Dashboard Report', pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 15
    pdf.setFontSize(10)
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 20

    // Add metrics summary
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Key Metrics Summary', 20, yPosition)
    yPosition += 10

    // Extract metric data from the page
    const metricElements = document.querySelectorAll('[data-metric]') || []
    if (metricElements.length === 0) {
      // Fallback: extract from metric cards
      const metricCards = document.querySelectorAll('.text-2xl.font-bold')
      metricCards.forEach((card, index) => {
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }
        
        const value = card.textContent || 'N/A'
        const title = card.parentElement?.querySelector('.text-sm')?.textContent || `Metric ${index + 1}`
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${title}:`, 20, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(value, 80, yPosition)
        yPosition += 8
      })
    }

    yPosition += 10

    // Add real-time data section
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Real-time Activity', 20, yPosition)
    yPosition += 10

    // Extract real-time data
    const realTimeElements = document.querySelectorAll('.text-2xl.font-bold.text-blue-600, .text-2xl.font-bold.text-green-600, .text-2xl.font-bold.text-purple-600, .text-2xl.font-bold.text-orange-600')
    realTimeElements.forEach((element, index) => {
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      
      const value = element.textContent || 'N/A'
      const label = element.nextElementSibling?.textContent || `Data ${index + 1}`
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${label}:`, 20, yPosition)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, 80, yPosition)
      yPosition += 8
    })

    yPosition += 15

    // Add chart descriptions
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Dashboard Components', 20, yPosition)
    yPosition += 10

    const chartTitles = [
      'Revenue Trend - Daily revenue over the last 30 days',
      'Active Users - Daily active users for the past 2 weeks', 
      'Monthly Performance - Revenue vs costs comparison by month',
      'Traffic Sources - Breakdown of traffic by source'
    ]

    chartTitles.forEach(title => {
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`• ${title}`, 20, yPosition)
      yPosition += 8
    })

    yPosition += 15

    // Add campaign data section
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Campaign Performance Summary', 20, yPosition)
    yPosition += 10

    // Extract table data
    const tableRows = document.querySelectorAll('table tbody tr')
    let campaignCount = 0
    
    tableRows.forEach((row) => {
      if (yPosition > 240) {
        pdf.addPage()
        yPosition = 20
      }
      
      const cells = row.querySelectorAll('td')
      if (cells.length >= 3) {
        const campaign = cells[0]?.textContent?.trim() || 'N/A'
        const status = cells[1]?.textContent?.trim() || 'N/A'
        const revenue = cells[5]?.textContent?.trim() || 'N/A'
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(campaign, 20, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Status: ${status}`, 20, yPosition + 5)
        pdf.text(`Revenue: ${revenue}`, 20, yPosition + 10)
        yPosition += 18
        campaignCount++
        
        if (campaignCount >= 5) return // Limit to first 5 campaigns
      }
    })

    // Add footer
    const totalPages = pdf.internal.pages.length - 1
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`ADmyBRAND Insights - Page ${i} of ${totalPages}`, pageWidth / 2, 285, { align: 'center' })
    }

    // Save PDF
    pdf.save(filename)

    // Restore original title
    document.title = originalTitle

    return true
  } catch (error) {
    // Restore original title on error
    document.title = document.title.replace('Generating PDF...', 'ADmyBRAND Insights - Analytics Dashboard')
    
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF. This feature is temporarily unavailable.')
  }
}

import type { TableRow } from "@/lib/mock-data";
export function exportToCSV(data: TableRow[], filename: string = 'data-export.csv', headers?: string[]) {
  try {
    if (!data.length) {
      throw new Error('No data to export')
    }

    // Get headers from data keys if not provided
    const csvHeaders = headers || Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...data.map(row => 
        csvHeaders.map(header => {
                    const value = (row as unknown as Record<string, unknown>)[header]
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up
    }

    return true
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw error
  }
}

export function exportTableToCSV(tableId: string, filename: string = 'table-export.csv') {
  try {
    const table = document.getElementById(tableId)
    if (!table) {
      throw new Error('Table not found')
    }

    const rows = table.querySelectorAll('tr')
    const csvContent = Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td, th')
      return Array.from(cells).map(cell => {
        const text = cell.textContent?.trim() || ''
        // Handle values that might contain commas or quotes
        if (text.includes(',') || text.includes('"')) {
          return `"${text.replace(/"/g, '""')}"`
        }
        return text
      }).join(',')
    }).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up
    }

    return true
  } catch (error) {
    console.error('Error exporting table to CSV:', error)
    throw error
  }
} 