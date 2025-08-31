import { CiCircleCheck } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllRideQuery } from "@/redux/features/driver/driver.api";
import {
  ArrowUpDown,
  Badge,
  Bike,
  Calendar,
  Car,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useUpdateRideStatusMutation } from "@/redux/features/ride/ride.api";

const statusConfig = {
  REQUESTED: {
    label: "Requested",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

const vehicleTypeConfig = {
  CAR: {
    label: "Car",
    icon: Car,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  BIKE: {
    label: "Bike",
    icon: Bike,
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

export default function GetRide() {
  const { data: rides = [], isLoading, error, refetch } = useGetAllRideQuery();
  const [updateRideStatus] = useUpdateRideStatusMutation();
  console.log(rides);

  const [filters, setFilters] = useState<{
    search: string;
    vehicleType: string | "all";
    fareRange: string | "all";
    dateRange: string | "all";
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({
    search: "",
    vehicleType: "all",
    fareRange: "all",
    dateRange: "all",
    page: 1,
    limit: 10,
  });

  const clearFilters = () => {
    setFilters({
      search: "",
      vehicleType: "all",
      fareRange: "all",
      dateRange: "all",
      page: 1,
      limit: filters.limit,
    });
  };

  const handleSort = (key: string) => {
    setFilters((f) => ({
      ...f,
      sortBy: key,
      sortOrder: f.sortBy === key && f.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Pagination
  const totalPages = Math.ceil(sortedRides.length / filters.limit);
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const paginatedRides = sortedRides.slice(startIndex, endIndex);

  const handlePageChange = (nextPage: number) => {
    setFilters((f) => ({
      ...f,
      page: Math.min(Math.max(1, nextPage), totalPages),
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Get Ride</h1>
          <p className="text-muted-foreground">
            All Active requested ride. Accept to start a ride.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations, drivers..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select
                value={filters.vehicleType}
                // onValueChange={(value) =>
                //   setFilters((f) => ({ ...f, vehicleType: value, page: 1 }))
                // }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {Object.entries(vehicleTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fare Range</label>
              <Select
                value={filters.fareRange}
                // onValueChange={(value) =>
                //   setFilters((f) => ({ ...f, fareRange: value, page: 1 }))
                // }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Fares" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fares</SelectItem>
                  <SelectItem value="low">Low (&lt;৳199)</SelectItem>
                  <SelectItem value="medium">Medium (৳200-৳499)</SelectItem>
                  <SelectItem value="high">High (&gt;৳500)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Per Page</label>
              <Select
                value={String(filters.limit)}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, limit: Number(value), page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between mt-6 mb-3">
        <p className="text-sm text-muted-foreground">
          {/* Showing {startIndex + 1}-{Math.min(endIndex, sortedRides.length)} of{" "}
          {sortedRides.length} rides */}
          showing
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Total rides: {rides.length} // show only requested ride status length
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3">Ride Info</th>
                  <th className="px-4 py-3">Locations</th>
                  <th className="px-4 py-3">Fare & Distance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Date
                      {filters.sortBy === "createdAt" ? (
                        <span className="text-xs">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRides.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8" />
                        <p>No rides found. Try adjusting filters.</p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRides.map((ride) => (
                    <tr
                      key={ride._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      {/* Ride Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-sm">
                            #{ride._id.slice(-6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Driver: {ride.driverId.slice(-6)}
                          </div>
                        </div>
                      </td>

                      {/* Locations */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                            <div className="text-xs">
                              <div className="font-medium">From</div>
                              <div className="text-muted-foreground truncate max-w-[150px]">
                                {ride.pickupLocation.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
                            <div className="text-xs">
                              <div className="font-medium">To</div>
                              <div className="text-muted-foreground truncate max-w-[150px]">
                                {ride.destinationLocation.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Fare & Distance */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <FaBangladeshiTakaSign className="h-3 w-3 text-green-600" />
                            <span className="font-medium">
                              {ride.fare.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ride.distance.toFixed(1)} km
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            statusConfig[
                              ride.status as keyof typeof statusConfig
                            ]?.color
                          }
                        >
                          {
                            statusConfig[
                              ride.status as keyof typeof statusConfig
                            ]?.label
                          }
                        </Badge>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            vehicleTypeConfig[
                              ride.vehicleType as keyof typeof vehicleTypeConfig
                            ]?.color
                          }
                        >
                          {ride.vehicleType === "CAR" ? (
                            <Car className="h-3 w-3 mr-1" />
                          ) : (
                            <Bike className="h-3 w-3 mr-1" />
                          )}
                          {
                            vehicleTypeConfig[
                              ride.vehicleType as keyof typeof vehicleTypeConfig
                            ]?.label
                          }
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(ride.createdAt)}
                        date
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <CiCircleCheck className="h-4 w-4" />
                          Accept Ride
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
