/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Calendar,
  MapPin,
  Clock,
  Award,
} from "lucide-react";
import type { IDriverEarnings } from "@/types";

interface EarningsDashboardProps {
  earningsData: IDriverEarnings;
  isLoading?: boolean;
}

// ✅ Define earnings entry type
interface IEarningsEntry {
  date?: string;
  week?: string;
  month?: string;
  earnings: number;
  rides: number;
}

interface IVehicleTypeSlice {
  name: string;
  value: number;
  rides: number;
  color: string;
}

interface IEarningsGroups {
  daily: IEarningsEntry[];
  weekly: IEarningsEntry[];
  monthly: IEarningsEntry[];
  vehicleTypeData: IVehicleTypeSlice[];
}

type TimeFilter = "daily" | "weekly" | "monthly";

const COLORS = {
  primary: "#2563eb",
  secondary: "#16a34a",
  accent: "#f59e0b",
  danger: "#dc2626",
  success: "#059669",
  warning: "#d97706",
  info: "#0891b2",
  purple: "#7c3aed",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border text-foreground p-3 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} style={{ color: item.color }} className="text-sm">
            {item.name}: ৳{item.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border text-foreground p-3 rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">৳{data.value?.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          {(
            (data.value /
              payload.reduce((sum: number, item: any) => sum + item.value, 0)) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
    );
  }
  return null;
};

export default function EarningsDashboard({
  earningsData,
  isLoading,
}: EarningsDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");

  // Process data for different chart types
  const processedData = useMemo<IEarningsGroups>(() => {
    if (!earningsData?.rides)
      return { daily: [], weekly: [], monthly: [], vehicleTypeData: [] };

    const rides = earningsData.rides;

    // Group by date for daily earnings
    const dailyEarnings = rides.reduce((acc: any, ride) => {
      const date = new Date(ride.timestamps.completedAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, earnings: 0, rides: 0 };
      }
      acc[date].earnings += ride.fare;
      acc[date].rides += 1;
      return acc;
    }, {});

    // Group by week
    const weeklyEarnings = rides.reduce((acc: any, ride) => {
      const date = new Date(ride.timestamps.completedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toLocaleDateString();

      if (!acc[weekKey]) {
        acc[weekKey] = { week: weekKey, earnings: 0, rides: 0 };
      }
      acc[weekKey].earnings += ride.fare;
      acc[weekKey].rides += 1;
      return acc;
    }, {});

    // Group by month
    const monthlyEarnings = rides.reduce((acc: any, ride) => {
      const date = new Date(ride.timestamps.completedAt);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, earnings: 0, rides: 0 };
      }
      acc[monthKey].earnings += ride.fare;
      acc[monthKey].rides += 1;
      return acc;
    }, {});

    // Vehicle type distribution
    const vehicleTypeData = rides.reduce((acc: any, ride) => {
      const existing = acc.find((item: any) => item.name === ride.vehicleType);
      if (existing) {
        existing.value += ride.fare;
        existing.rides += 1;
      } else {
        acc.push({
          name: ride.vehicleType,
          value: ride.fare,
          rides: 1,
          color:
            ride.vehicleType === "BIKE" ? COLORS.primary : COLORS.secondary,
        });
      }
      return acc;
    }, []);

    const daily = Object.values(
      dailyEarnings as Record<string, IEarningsEntry>
    ).sort(
      (a, b) =>
        new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    );

    const weekly = Object.values(
      weeklyEarnings as Record<string, IEarningsEntry>
    ).sort(
      (a, b) =>
        new Date(a.week || 0).getTime() - new Date(b.week || 0).getTime()
    );

    const monthly = Object.values(
      monthlyEarnings as Record<string, IEarningsEntry>
    ).sort(
      (a, b) =>
        new Date(a.month || 0).getTime() - new Date(b.month || 0).getTime()
    );

    return {
      daily,
      weekly,
      monthly,
      vehicleTypeData,
    };
  }, [earningsData]);

  const currentDataMap: Record<TimeFilter, IEarningsEntry[]> = {
    daily: processedData.daily,
    weekly: processedData.weekly,
    monthly: processedData.monthly,
  };
  const currentData = currentDataMap[timeFilter];
  const totalRides = earningsData?.totalRides || 0;
  const totalEarnings = earningsData?.totalEarnings || 0;
  const averageEarningsPerRide =
    totalRides > 0 ? totalEarnings / totalRides : 0;

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    if (currentData.length < 2) return { earningsGrowth: 0, ridesGrowth: 0 };

    const latest = currentData[currentData.length - 1] as IEarningsEntry;
    const previous = currentData[currentData.length - 2] as IEarningsEntry;

    const earningsGrowth =
      previous.earnings > 0
        ? ((latest.earnings - previous.earnings) / previous.earnings) * 100
        : 0;

    const ridesGrowth =
      previous.rides > 0
        ? ((latest.rides - previous.rides) / previous.rides) * 100
        : 0;

    return { earningsGrowth, ridesGrowth };
  }, [currentData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Earnings Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your driving performance and earnings
          </p>
        </div>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold">
                  ৳{totalEarnings.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {growthMetrics.earningsGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      growthMetrics.earningsGrowth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Math.abs(growthMetrics.earningsGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Rides
                </p>
                <p className="text-2xl font-bold">{totalRides}</p>
                <div className="flex items-center mt-1">
                  {growthMetrics.ridesGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      growthMetrics.ridesGrowth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Math.abs(growthMetrics.ridesGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. per Ride
                </p>
                <p className="text-2xl font-bold">
                  ৳{averageEarningsPerRide.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Earnings efficiency
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This{" "}
                  {timeFilter === "daily"
                    ? "Day"
                    : timeFilter === "weekly"
                    ? "Week"
                    : "Month"}
                </p>
                <p className="text-2xl font-bold">
                  ৳
                  {currentData.length > 0
                    ? (
                        currentData[currentData.length - 1] as IEarningsEntry
                      ).earnings?.toLocaleString() || 0
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentData.length > 0
                    ? (currentData[currentData.length - 1] as IEarningsEntry)
                        .rides || 0
                    : 0}{" "}
                  rides
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Earnings Trend ({timeFilter})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient
                      id="earningsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey={
                      timeFilter === "daily"
                        ? "date"
                        : timeFilter === "weekly"
                        ? "week"
                        : "month"
                    }
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickFormatter={(value) => `৳${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Earnings by Vehicle Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData.vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(((percent ?? 0) as number) * 100).toFixed(
                        0
                      )}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {processedData.vehicleTypeData.map(
                      (entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )
                    )}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {processedData.vehicleTypeData.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ৳{item.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.rides} rides
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rides vs Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Rides vs Earnings Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.3}
                />
                <XAxis
                  dataKey={
                    timeFilter === "daily"
                      ? "date"
                      : timeFilter === "weekly"
                      ? "week"
                      : "month"
                  }
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="rides"
                  fill={COLORS.accent}
                  name="Rides"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="earnings"
                  fill={COLORS.secondary}
                  name="Earnings (৳)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Rides Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Rides Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earningsData?.rides?.slice(0, 5).map((ride) => (
              <div
                key={ride._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {ride.pickupLocation.name} →{" "}
                        {ride.destinationLocation.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {ride.vehicleType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          ride.timestamps.completedAt
                        ).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ride.distance.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">৳{ride.fare}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
