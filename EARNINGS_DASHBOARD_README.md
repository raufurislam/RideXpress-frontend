# Driver Earnings Dashboard

A comprehensive, professional earnings dashboard for RideExpress drivers featuring beautiful charts, analytics, and real-time data visualization.

## Features

### 📊 **Visual Analytics**

- **Earnings Trend Chart**: Area chart showing earnings over time (daily/weekly/monthly)
- **Vehicle Type Distribution**: Pie chart showing earnings breakdown by vehicle type
- **Rides vs Earnings Comparison**: Bar chart comparing ride count and earnings
- **Growth Metrics**: Trend indicators showing performance improvements

### 📈 **Key Metrics Cards**

- **Total Earnings**: Complete earnings with growth percentage
- **Total Rides**: Total completed rides with trend
- **Average per Ride**: Earnings efficiency metric
- **Period Summary**: Current period earnings and ride count

### 🎨 **Professional Design**

- **Modern UI**: Clean, professional interface matching industry standards
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Supports both themes seamlessly
- **Interactive Charts**: Hover effects, tooltips, and smooth animations
- **Loading States**: Beautiful skeleton loading animations

### 🔄 **Time Filtering**

- **Daily View**: Day-by-day earnings breakdown
- **Weekly View**: Week-by-week performance analysis
- **Monthly View**: Monthly earnings overview
- **Dynamic Updates**: Real-time data updates with growth calculations

### 📱 **Recent Rides Summary**

- **Ride Details**: Pickup/destination locations
- **Fare Information**: Individual ride earnings
- **Distance Tracking**: Trip distance information
- **Status Indicators**: Visual completion status

## Technical Implementation

### API Integration

```typescript
// Redux API endpoint
GET /api/v1/ride/earnings

// Response structure
{
  "statusCode": 200,
  "success": true,
  "message": "Driver Earning History has been retrieve successfully",
  "data": {
    "totalRides": 11,
    "totalEarnings": 1790,
    "rides": [...]
  }
}
```

### Components Structure

```
src/
├── components/modules/Driver/
│   ├── EarningsDashboard.tsx          # Main dashboard component
│   └── EarningsDashboardDemo.tsx      # Demo component with sample data
├── pages/Driver/
│   └── DriverEarning.tsx              # Page component with API integration
├── redux/features/driver/
│   └── driver.api.ts                  # Redux API integration
└── types/
    └── driver.type.ts                 # TypeScript interfaces
```

### Chart Libraries Used

- **Recharts**: Professional charting library
  - AreaChart for earnings trends
  - PieChart for vehicle type distribution
  - BarChart for comparisons
  - ResponsiveContainer for mobile support

### Styling & UI

- **shadcn/ui**: Modern component library
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Framer Motion**: Smooth animations (if needed)

## Usage

### Basic Implementation

```tsx
import { useGetMyEarningSummaryDriverQuery } from "@/redux/features/driver/driver.api";
import EarningsDashboard from "@/components/modules/Driver/EarningsDashboard";

function DriverEarningPage() {
  const {
    data: earningsData,
    isLoading,
    error,
  } = useGetMyEarningSummaryDriverQuery();

  return (
    <EarningsDashboard earningsData={earningsData} isLoading={isLoading} />
  );
}
```

### Demo Mode

```tsx
import EarningsDashboardDemo from "@/components/modules/Driver/EarningsDashboardDemo";

// Shows dashboard with sample data
<EarningsDashboardDemo />;
```

## Data Processing

### Time-based Grouping

- **Daily**: Groups rides by completion date
- **Weekly**: Groups rides by week starting from Sunday
- **Monthly**: Groups rides by month and year

### Growth Calculations

- **Earnings Growth**: Percentage change in earnings between periods
- **Rides Growth**: Percentage change in ride count between periods
- **Trend Indicators**: Visual up/down arrows with color coding

### Vehicle Type Analysis

- **Earnings Distribution**: Total earnings per vehicle type
- **Ride Count**: Number of rides per vehicle type
- **Percentage Breakdown**: Visual percentage representation

## Error Handling

### Loading States

- Skeleton loading animations for cards
- Responsive loading indicators
- Smooth transitions between states

### Error States

- Network error handling
- Empty data state
- Retry functionality
- User-friendly error messages

### Edge Cases

- No rides completed
- Single ride scenarios
- Missing data handling
- Invalid date ranges

## Performance Optimizations

### Data Processing

- **useMemo**: Cached calculations for chart data
- **Efficient Grouping**: Optimized data transformation
- **Lazy Loading**: Charts load only when needed

### Rendering

- **ResponsiveContainer**: Efficient chart resizing
- **Virtual Scrolling**: For large ride lists (if needed)
- **Memoized Components**: Prevent unnecessary re-renders

## Customization

### Colors & Themes

```typescript
const COLORS = {
  primary: "#2563eb", // Blue
  secondary: "#16a34a", // Green
  accent: "#f59e0b", // Orange
  danger: "#dc2626", // Red
  success: "#059669", // Emerald
  warning: "#d97706", // Amber
  info: "#0891b2", // Cyan
  purple: "#7c3aed", // Purple
};
```

### Chart Configuration

- Customizable chart colors
- Configurable time periods
- Adjustable chart heights
- Custom tooltip content

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Responsiveness

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid Layout**: Responsive grid system
- **Touch Support**: Mobile-friendly interactions
- **Chart Scaling**: Automatic chart resizing

## Future Enhancements

- **Export Functionality**: PDF/Excel export
- **Advanced Filters**: Date range picker, vehicle type filters
- **Goal Setting**: Earnings targets and progress tracking
- **Notifications**: Earnings milestone alerts
- **Comparative Analysis**: Performance vs other drivers
- **Predictive Analytics**: Earnings forecasting

## Dependencies

```json
{
  "recharts": "^3.1.2",
  "@radix-ui/react-*": "Latest",
  "lucide-react": "^0.541.0",
  "tailwindcss": "^4.1.11"
}
```

## Installation

The dashboard is already integrated into the RideExpress project. No additional installation required.

## Support

For issues or questions regarding the earnings dashboard, please refer to the main project documentation or contact the development team.
