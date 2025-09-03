import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  MapPin,
  Car,
  Bike,
  Eye,
  Calendar,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAllRideRiderQuery } from "@/redux/features/ride/ride.api";
import { type IRide } from "@/types";

const statusConfig = {
  REQUESTED: {
    label: "Requested",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  PICKED_UP: {
    label: "Picked Up",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
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

export default function RideHistory() {
  const [filters, setFilters] = useState<{
    search: string;
    status: string | "all";
    vehicleType: string | "all";
    fareRange: string | "all";
    dateRange: string | "all";
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({
    search: "",
    status: "all",
    vehicleType: "all",
    fareRange: "all",
    dateRange: "all",
    page: 1,
    limit: 10,
  });

  const [selectedRide, setSelectedRide] = useState<IRide | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    data: rides = [],
    isLoading,
    error,
    refetch,
  } = useGetAllRideRiderQuery();

  // Ensure rides is always an array
  const ridesArray = Array.isArray(rides) ? rides : [];

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
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

  // Client-side filtering
  const filteredRides = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return ridesArray.filter((ride: IRide) => {
      const matchesSearch =
        term === "" ||
        ride.pickupLocation.name.toLowerCase().includes(term) ||
        ride.destinationLocation.name.toLowerCase().includes(term) ||
        ride.driverId.toLowerCase().includes(term);

      const matchesStatus =
        filters.status === "all" || ride.status === filters.status;
      const matchesVehicleType =
        filters.vehicleType === "all" ||
        ride.vehicleType === filters.vehicleType;

      let matchesFareRange = true;
      if (filters.fareRange !== "all") {
        const fare = ride.fare;
        switch (filters.fareRange) {
          case "low":
            matchesFareRange = fare < 199;
            break;
          case "medium":
            matchesFareRange = fare >= 200 && fare < 499;
            break;
          case "high":
            matchesFareRange = fare >= 500;
            break;
        }
      }

      let matchesDateRange = true;
      if (filters.dateRange !== "all") {
        const rideDate = new Date(ride.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - rideDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case "today":
            matchesDateRange = diffDays <= 1;
            break;
          case "week":
            matchesDateRange = diffDays <= 7;
            break;
          case "month":
            matchesDateRange = diffDays <= 30;
            break;
          case "year":
            matchesDateRange = diffDays <= 365;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVehicleType &&
        matchesFareRange &&
        matchesDateRange
      );
    });
  }, [
    rides,
    filters.search,
    filters.status,
    filters.vehicleType,
    filters.fareRange,
    filters.dateRange,
  ]);

  // Client-side sorting
  const sortedRides = useMemo(() => {
    if (!filters.sortBy) return filteredRides;

    const sortKey = filters.sortBy as keyof IRide;
    const direction = filters.sortOrder === "asc" ? 1 : -1;

    const copy = [...filteredRides];

    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1 * direction;
      if (bVal == null) return -1 * direction;

      if (sortKey === "createdAt" || sortKey === "updatedAt") {
        const aNum = new Date(aVal as string).getTime();
        const bNum = new Date(bVal as string).getTime();
        if (aNum < bNum) return -1 * direction;
        if (aNum > bNum) return 1 * direction;
        return 0;
      }

      if (sortKey === "fare" || sortKey === "distance") {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (aNum < bNum) return -1 * direction;
        if (aNum > bNum) return 1 * direction;
        return 0;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return -1 * direction;
      if (aStr > bStr) return 1 * direction;
      return 0;
    });

    return copy;
  }, [filteredRides, filters.sortBy, filters.sortOrder]);

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

  const handleViewDetails = (ride: IRide) => {
    setSelectedRide(ride);
    setShowDetailsModal(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading ride history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading ride history</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ride History</h1>
          <p className="text-muted-foreground">
            View and manage your complete ride history
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
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, status: value, page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, vehicleType: value, page: 1 }))
                }
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
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, fareRange: value, page: 1 }))
                }
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
              <label className="text-sm font-medium">Date Range</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, dateRange: value, page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
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
          Showing {startIndex + 1}-{Math.min(endIndex, sortedRides.length)} of{" "}
          {sortedRides.length} rides
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Total rides: {ridesArray.length}
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
                  paginatedRides.map((ride: IRide) => (
                    <tr
                      key={ride._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      {/* Ride Info */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {/* <div className="font-medium text-sm">
                            #{ride._id.slice(-6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Driver: {ride.driverId.slice(-6)}
                          </div> */}

                          <div className="font-medium text-sm">
                            #{ride._id ? ride._id.slice(-6) : "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Driver:{" "}
                            {ride.driverId ? ride.driverId.slice(-6) : "N/A"}
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
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(ride)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Details
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Ride Details Modal */}
      {showDetailsModal && selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Ride Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Ride ID
                    </label>
                    {/* <p className="font-mono text-sm">
                      #{selectedRide._id.slice(-6)}
                    </p> */}

                    <p className="font-mono text-sm">
                      #{selectedRide._id ? selectedRide._id.slice(-6) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <Badge
                      variant="outline"
                      className={
                        statusConfig[
                          selectedRide.status as keyof typeof statusConfig
                        ]?.color
                      }
                    >
                      {
                        statusConfig[
                          selectedRide.status as keyof typeof statusConfig
                        ]?.label
                      }
                    </Badge>
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Route Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Pickup Location
                      </label>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {selectedRide.pickupLocation.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Coordinates:{" "}
                          {selectedRide.pickupLocation.coordinates.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Destination
                      </label>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="font-medium">
                            {selectedRide.destinationLocation.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Coordinates:{" "}
                          {selectedRide.destinationLocation.coordinates.join(
                            ", "
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <FaBangladeshiTakaSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="flex items-center justify-center gap-1">
                      <FaBangladeshiTakaSign />
                      <div className="text-2xl font-bold">
                        {selectedRide.fare.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Fare
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {selectedRide.distance.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Distance (km)
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    {selectedRide.vehicleType === "CAR" ? (
                      <Car className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    ) : (
                      <Bike className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    )}
                    <div className="text-lg font-bold">
                      {
                        vehicleTypeConfig[
                          selectedRide.vehicleType as keyof typeof vehicleTypeConfig
                        ]?.label
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vehicle Type
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ride Timeline</h3>
                  <div className="space-y-3">
                    {selectedRide.timestamps.requestedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Ride Requested</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(selectedRide.timestamps.requestedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedRide.timestamps.acceptedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Driver Accepted</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(selectedRide.timestamps.acceptedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedRide.timestamps.pickedUpAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Passenger Picked Up</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(selectedRide.timestamps.pickedUpAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedRide.timestamps.completedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Ride Completed</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(selectedRide.timestamps.completedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Driver Info */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Driver ID
                  </label>
                  <p className="font-mono text-sm bg-muted/50 p-2 rounded">
                    {selectedRide.driverId}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
