import { useMemo } from "react";
import {
  useGetDashboardStatsQuery,
  useGetDriverStatsQuery,
  useGetRevenueStatsQuery,
  useGetRideStatsQuery,
  useGetUserStatsQuery,
} from "@/redux/features/admin/stats.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import MultiLineChart from "@/redux/features/admin/MultiLineChart";

type KV = { _id: string | number; count?: number; total?: number };

function numberFmt(n: number | undefined | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function BarList({
  data,
  unit = "",
  max,
}: {
  data: KV[];
  unit?: string;
  max?: number;
}) {
  const maxVal = useMemo(
    () => max ?? Math.max(1, ...data.map((d) => d.count ?? d.total ?? 0)),
    [data, max]
  );
  return (
    <div className="space-y-2">
      {data.map((d) => {
        const val = (d.count ?? d.total ?? 0) as number;
        const pct = Math.min(100, Math.round((val / maxVal) * 100));
        return (
          <div key={String(d._id)} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate max-w-[60%]">
                {String(d._id)}
              </span>
              <span className="font-medium">
                {numberFmt(val)}
                {unit}
              </span>
            </div>
            <div className="h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const { data: dashboard, isLoading: isDashboardLoading } =
    useGetDashboardStatsQuery();
  const { data: rides, isLoading: isRidesLoading } = useGetRideStatsQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUserStatsQuery();
  const { data: drivers, isLoading: isDriversLoading } =
    useGetDriverStatsQuery();
  const { data: revenue, isLoading: isRevenueLoading } =
    useGetRevenueStatsQuery();

  const overview =
    (dashboard as { overview?: Record<string, number> } | undefined)
      ?.overview ?? ({} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isDashboardLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={numberFmt(overview.totalUsers)}
            />
            <StatCard
              label="Total Rides"
              value={numberFmt(overview.totalRides)}
            />
            <StatCard
              label="Total Drivers"
              value={numberFmt(overview.totalDrivers)}
            />
            <StatCard
              label="Total Revenue"
              value={`৳ ${numberFmt(overview.totalRevenue)}`}
            />
            <StatCard
              label="Active Rides"
              value={numberFmt(overview.activeRides)}
            />
            <StatCard
              label="Completed Today"
              value={numberFmt(overview.completedRidesToday)}
            />
            <StatCard
              label="New Users (7d)"
              value={numberFmt(overview.newUsersThisWeek)}
            />
            <StatCard
              label="New Drivers (7d)"
              value={numberFmt(overview.newDriversThisWeek)}
            />
          </>
        )}
      </div>

      <MultiLineChart rides={rides} revenue={revenue} users={users} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rides by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isRidesLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <BarList data={(rides?.ridesByStatus as KV[]) ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rides by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            {isRidesLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <BarList data={(rides?.ridesByVehicleType as KV[]) ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isRevenueLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <BarList
                data={(revenue?.revenueByStatus as KV[]) ?? []}
                unit="৳"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            {isRevenueLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <BarList
                data={(revenue?.revenueByVehicleType as KV[]) ?? []}
                unit="৳"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isUsersLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Users</div>
                  <div className="font-semibold">
                    {numberFmt(users?.totalUsers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Riders</div>
                  <div className="font-semibold">
                    {numberFmt(users?.totalRiders as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Drivers</div>
                  <div className="font-semibold">
                    {numberFmt(users?.totalDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Admins</div>
                  <div className="font-semibold">
                    {numberFmt(users?.totalAdmins as number)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Active</div>
                  <div className="font-semibold">
                    {numberFmt(users?.activeUsers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Blocked</div>
                  <div className="font-semibold">
                    {numberFmt(users?.blockedUsers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Suspended</div>
                  <div className="font-semibold">
                    {numberFmt(users?.suspendedUsers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Verified</div>
                  <div className="font-semibold">
                    {numberFmt(users?.verifiedUsers as number)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDriversLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.totalDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Approved</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.approvedDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Pending</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.pendingDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Rejected</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.rejectedDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Suspended</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.suspendedDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Available</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.availableDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Unavailable</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.unavailableDrivers as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">On Trip</div>
                  <div className="font-semibold">
                    {numberFmt(drivers?.onTripDrivers as number)}
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {isDriversLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <div>
                <div className="mb-2 text-sm font-medium">
                  Top earning drivers
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(
                      (
                        drivers as
                          | {
                              topEarningDrivers?: {
                                driverName: string;
                                vehicleType: string;
                                vehicleModel: string;
                                earnings: number;
                                status: string;
                              }[];
                            }
                          | undefined
                      )?.topEarningDrivers ?? []
                    ).map(
                      (d: {
                        driverName: string;
                        vehicleType: string;
                        vehicleModel: string;
                        earnings: number;
                        status: string;
                      }) => (
                        <TableRow key={`${d.driverName}-${d.vehicleModel}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span>{d.driverName}</span>
                              <Badge variant="secondary">{d.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {d.vehicleType} · {d.vehicleModel}
                          </TableCell>
                          <TableCell className="text-right">
                            ৳ {numberFmt(d.earnings as number)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ride Totals</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {isRidesLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <>
                <div>
                  <div className="text-muted-foreground">Total distance</div>
                  <div className="font-semibold">
                    {numberFmt(rides?.totalDistance as number)} km
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg distance</div>
                  <div className="font-semibold">
                    {numberFmt(rides?.avgDistance as number)} km
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total fare</div>
                  <div className="font-semibold">
                    ৳ {numberFmt(rides?.totalFare as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg fare</div>
                  <div className="font-semibold">
                    ৳ {numberFmt(rides?.avgFare as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-semibold">
                    {numberFmt(rides?.completedRides as number)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Cancelled</div>
                  <div className="font-semibold">
                    {numberFmt(rides?.cancelledRides as number)}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isRidesLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <>
                <div>
                  <div className="mb-2 text-sm font-medium">Top Pickup</div>
                  <BarList data={(rides?.topPickupLocations as KV[]) ?? []} />
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium">
                    Top Destination
                  </div>
                  <BarList
                    data={(rides?.topDestinationLocations as KV[]) ?? []}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
