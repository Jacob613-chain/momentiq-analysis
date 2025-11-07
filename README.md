# Analytics Dashboard 📊

A beautiful and interactive analytics dashboard for tracking TikTok metrics with smooth, animated charts.

## ✨ Features

- **Real-time Metrics Display**: View the latest metrics including total creators, products substituted, average products per creator, and GMV generated
- **Interactive Charts**: 4 beautiful, smooth charts powered by Recharts:
  - Total Creators (Area Chart)
  - Products Substituted (Area Chart)
  - Average Products per Creator (Line Chart)
  - GMV Generated (Area Chart)
- **Flexible Date Ranges**: Switch between 7, 14, 30, 60, or 90-day views
- **Growth Indicators**: See daily growth with visual indicators
- **Period Summary**: View overall changes across the selected period
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in and slide-up animations for a polished user experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── MetricsCards.jsx      # Display latest metrics in card format
│   └── MetricsCharts.jsx     # 4 interactive charts for metrics visualization
├── pages/
│   └── AnalysisPage.jsx      # Main analysis page with all components
├── services/
│   └── api.js                # API service for fetching TikTok metrics
├── App.jsx                   # Main app component
├── main.jsx                  # App entry point
└── index.css                 # Global styles with Tailwind
```

## 🎨 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Beautiful, composable charts
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **date-fns** - Date formatting utilities
- **Lucide React** - Beautiful icon library

## 📊 API Integration

The dashboard connects to the BeMomentiq API:
- **Endpoint**: `https://api.bemomentiq.com/v1/tiktok/metrics/historical/`
- **Parameters**: `start_date` (YYYY-MM-DD format)

## 🎯 Key Components

### MetricsCards
Displays the latest metrics in beautiful card format with:
- Color-coded icons
- Growth indicators with trending arrows
- Smooth hover animations

### MetricsCharts
Four interactive charts showing:
1. **Total Creators** - Track creator growth over time
2. **Products Substituted** - Monitor product substitution trends
3. **Avg Products per Creator** - Analyze efficiency metrics
4. **GMV Generated** - Track revenue generation

### AnalysisPage
Main page that orchestrates:
- Data fetching and state management
- Date range selection
- Refresh functionality
- Period summary display

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple gradient background
- **Card Shadows**: Elevated cards with hover effects
- **Smooth Animations**: Fade-in and slide-up animations
- **Color-Coded Charts**: Each metric has its own color scheme
- **Responsive Grid**: Adapts to different screen sizes
- **Loading States**: Skeleton loaders while data is fetching

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

The date range can be customized in `AnalysisPage.jsx`:
```javascript
const [dateRange, setDateRange] = useState(30); // Default to 30 days
```

Available date ranges: 7, 14, 30, 60, 90 days

## 🌟 Future Enhancements

- Export data to CSV/Excel
- Custom date range picker
- Comparison mode (compare two periods)
- More chart types (bar, pie, etc.)
- Dark mode support
- Real-time updates with WebSocket

## 📄 License

This project is private and proprietary.
