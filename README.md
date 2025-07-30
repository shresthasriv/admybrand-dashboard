# ADmyBRAND Insights - Analytics Dashboard

ADmyBRAND Insights is a modern analytics dashboard for digital marketing agencies, featuring real-time data visualization, interactive charts, advanced filtering, and a beautiful, responsive UI built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm (or yarn) package manager

### Installation & Running Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/shresthasriv/admybrand-dashboard.git
   cd admybrand-analytics
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🌟 Feature Overview

### Dashboard & Analytics
- **Overview Metrics Cards:** Key performance indicators with animated trend indicators
- **Interactive Charts:** Area, bar, line, and pie charts powered by Recharts
- **Real-time Data Updates:** Live statistics update every 5 seconds
- **Advanced Data Table:** Sortable, filterable, paginated campaign data
- **Date Range Filtering:** Flexible date picker for custom time periods

### UI/UX & Design
- **Modern Sidebar Navigation:** Retractable sidebar with user profile and navigation
- **Dark/Light Mode:** Seamless theme switching with smooth transitions
- **Responsive Design:** Optimized for desktop, tablet, and mobile
- **Smooth Animations:** Micro-interactions and animated transitions
- **Loading Skeletons:** Beautiful loading states for better UX

### Technical Highlights
- **Next.js 14:** App Router, TypeScript, and fast refresh
- **shadcn/ui & Tailwind CSS:** Modern, consistent component styling
- **Lucide Icons:** Crisp, scalable iconography
- **Export Functionality:** PDF and CSV export for reports and data
- **Mock Data:** Realistic analytics and campaign data for demo/testing

### Subtle & Useful Features
- **Sticky Header:** Always-visible navigation and actions
- **Animated Sidebar Rail:** Collapsible sidebar with smooth expand/collapse
- **Theme-aware Buttons:** Navigation buttons adapt to dark/light mode
- **Accessibility:** ARIA labels, keyboard navigation, and color contrast
- **Performance:** Lazy loading, optimized images, and efficient re-renders

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Export**: html2canvas + jsPDF
- **Theme**: next-themes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── charts/            # Chart components (Area, Bar, Line, Pie)
│   ├── data-table.tsx     # Advanced data table
│   ├── metric-card.tsx    # KPI metric cards
│   ├── theme-toggle.tsx   # Dark/light mode toggle
│   ├── theme-provider.tsx # Theme context provider
│   ├── date-range-picker.tsx # Date range selector
│   └── loading-skeleton.tsx  # Loading components
└── lib/                   # Utilities and data
    ├── mock-data.ts       # Sample analytics data
    ├── export-utils.ts    # Export functionality
    └── utils.ts           # shadcn/ui utilities
```

## 🎯 Key Components

### Metric Cards
Display key performance indicators with:
- Animated trend indicators
- Color-coded change indicators
- Hover effects and transitions

### Interactive Charts
Four chart types powered by Recharts:
- **Area Chart** - Revenue trends over time
- **Line Chart** - User engagement metrics
- **Bar Chart** - Monthly performance comparisons
- **Pie Chart** - Traffic source breakdown

### Advanced Data Table
Features include:
- **Sorting** - Click column headers to sort
- **Filtering** - Search campaigns and filter by status
- **Pagination** - Navigate through large datasets
- **Export** - Download filtered data as CSV

### Real-time Features
- Live data updates every 5 seconds
- Animated counters and indicators
- Refresh button with loading states
- Real-time activity monitor

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#8b5cf6) 
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Headings**: Geist Sans font family
- **Body**: Consistent font weights and sizes
- **Monospace**: Geist Mono for code and data

### Spacing
- 8px grid system for consistent spacing
- Responsive margins and padding
- Consistent component sizing

## 📱 Responsive Design

- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Responsive grid adjustments
- **Mobile**: Optimized touch interactions and layout

## 🌙 Dark Mode

Seamless dark/light mode switching with:
- System preference detection
- Smooth transitions between themes
- Persistent theme selection
- Properly styled charts and components

## 📊 Mock Data

The dashboard uses realistic mock data including:
- **Revenue metrics** - Monthly and daily revenue data
- **User analytics** - Active users and engagement
- **Campaign performance** - Marketing campaign ROI
- **Traffic sources** - Breakdown by acquisition channel

## 🔧 Export Features

### PDF Export
- Full dashboard export to PDF
- Professional formatting with headers
- High-resolution chart rendering
- Loading states during generation

### CSV Export
- Campaign data export to CSV
- Filtered data export
- Proper CSV formatting and encoding

## 🚀 Performance Optimizations

- **Component lazy loading** for better initial load times
- **Optimized images** using Next.js Image component
- **Efficient re-renders** with React hooks optimization
- **Responsive design** without layout shifts

## 🔮 Future Enhancements

- **API Integration** - Connect to real analytics APIs
- **User Authentication** - Add login and user management
- **Custom Dashboards** - Allow users to create custom views
- **More Chart Types** - Add heatmaps, scatter plots, etc.
- **Email Reports** - Scheduled report generation
- **Mobile App** - React Native companion app

