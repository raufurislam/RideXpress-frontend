/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MultiLineChartProps {
  rides?: { ridesLast7Days?: number; ridesLast30Days?: number };
  revenue?: { revenueLast7Days?: number; revenueLast30Days?: number };
  users?: { newUsersLast7Days?: number; newUsersLast30Days?: number };
}

export default function MultiLineChart({
  rides,
  revenue,
  users,
}: MultiLineChartProps) {
  const chartData = [
    {
      label: "Last 7 Days",
      rides: rides?.ridesLast7Days ?? 0,
      revenue: revenue?.revenueLast7Days ?? 0,
      users: users?.newUsersLast7Days ?? 0,
    },
    {
      label: "Last 30 Days",
      rides: rides?.ridesLast30Days ?? 0,
      revenue: revenue?.revenueLast30Days ?? 0,
      users: users?.newUsersLast30Days ?? 0,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth & Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4" stroke="#444" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fill: "#aaa" }} />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#aaa" }}
              label={{
                value: "Users & Rides",
                angle: -90,
                position: "insideLeft",
                fill: "#aaa",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#aaa" }}
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideRight",
                fill: "#aaa",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="center" />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rides"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive
              name="Rides"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive
              name="New Users"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
