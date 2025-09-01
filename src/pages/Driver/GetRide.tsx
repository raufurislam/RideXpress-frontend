/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllRideQuery,
  useGetDriverMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/features/driver/driver.api";
import { useUpdateRideStatusMutation } from "@/redux/features/ride/ride.api";

import {
  ArrowUpDown,
  Bike,
  Calendar,
  Car,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "sonner";
import { type IRide } from "@/types";
import { Switch } from "@/components/ui/switch";

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

type FareRange = {
  label: string;
  min?: number;
  max?: number;
};

const fareRangeConfig: Record<string, FareRange> = {
  low: { label: "Low (<৳199)", max: 199 },
  medium: { label: "Medium (৳200-৳499)", min: 200, max: 499 },
  high: { label: "High (>৳500)", min: 500 },
};

export default function GetRide() {
  const navigate = useNavigate();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const {
    data: allRides = [],
    isLoading,
    error,
    refetch,
  } = useGetAllRideQuery();
  const [updateRideStatus] = useUpdateRideStatusMutation();

  const { data: driverProfile, refetch: refetchDriver } =
    useGetDriverMyProfileQuery();

  // const [updateAvailability] = useUpdateAvailabilityMutation();

  const [filters, setFilters] = useState({
    search: "",
    vehicleType: "all" as string | "all",
    fareRange: "all" as string | "all",
    page: 1,
    limit: 10,
    sortBy: "createdAt" as string,
    sortOrder: "desc" as "asc" | "desc",
  });

  // Filter rides to show only REQUESTED status
  const requestedRides = useMemo(() => {
    return allRides.filter((ride: IRide) => ride.status === "REQUESTED");
  }, [allRides]);

  // Apply filters and sorting
  const filteredAndSortedRides = useMemo(() => {
    let filtered = requestedRides;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (ride: IRide) =>
          ride.pickupLocation.name.toLowerCase().includes(searchLower) ||
          ride.destinationLocation.name.toLowerCase().includes(searchLower)
      );
    }

    // Vehicle type filter
    if (filters.vehicleType !== "all") {
      filtered = filtered.filter(
        (ride: IRide) => ride.vehicleType === filters.vehicleType
      );
    }

    // Fare range filter
    if (filters.fareRange !== "all") {
      const range =
        fareRangeConfig[filters.fareRange as keyof typeof fareRangeConfig];
      if (range) {
        filtered = filtered.filter((ride: IRide) => {
          if (range.min !== undefined && range.max !== undefined) {
            return ride.fare >= range.min && ride.fare <= range.max;
          } else if (range.max !== undefined) {
            return ride.fare < range.max;
          } else if (range.min !== undefined) {
            return ride.fare > range.min;
          }
          return true;
        });
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = (a as any)[filters.sortBy as keyof typeof a];
      const bValue = (b as any)[filters.sortBy as keyof typeof b];

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [requestedRides, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRides.length / filters.limit);
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const paginatedRides = filteredAndSortedRides.slice(startIndex, endIndex);

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      vehicleType: "all",
      fareRange: "all",
      page: 1,
    }));
  };

  const handleSort = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder:
        prev.sortBy === key && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.min(Math.max(1, nextPage), totalPages),
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

  const [updateMyProfile] = useUpdateMyProfileMutation();

  const handleAcceptRide = async (ride: IRide) => {
    try {
      await updateRideStatus({
        rideId: (ride as any)._id,
        rideStatus: "ACCEPTED",
      }).unwrap();

      await updateMyProfile({ availability: "ON_TRIP" }).unwrap();
      toast.success(
        "Ride accepted successfully! Redirecting to Active Rides..."
      );
      setTimeout(() => navigate("/driver/active-ride"), 800);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        "Failed to accept ride. Please ensure you meet the requirements.";
      toast.error(message);
    }
  };

  const handleRejectRide = async (ride: IRide) => {
    try {
      await updateRideStatus({
        rideId: (ride as any)._id,
        rideStatus: "REJECTED",
      }).unwrap();
      toast.success("Ride rejected successfully!");
      refetch();
    } catch (error: any) {
      const message = error?.data?.message || "Failed to reject ride.";
      toast.error(message);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Rides
          </h3>
          <p className="text-gray-600 mb-4">
            Failed to load ride requests. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleAvailability = async (isChecked: boolean) => {
    if (isChecked) {
      await updateMyProfile({ availability: "AVAILABLE" }).unwrap();
      await refetchDriver();
      toast.success("You are now online and available for rides.");
    } else {
      setShowOfflineModal(true); // confirm before going offline
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Get Ride</h1>
          <p className="text-muted-foreground">
            Available ride requests. Accept to start earning!
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
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
        </div> */}

        <div className="flex flex-wrap items-center gap-3">
          {/* Availability Toggle */}
          <div className="flex items-center gap-3 border rounded-md px-3 py-2 bg-card shadow-sm">
            <Switch
              checked={driverProfile?.availability === "AVAILABLE"}
              onCheckedChange={handleToggleAvailability}
              disabled={driverProfile?.availability === "ON_TRIP"}
            />
            <label
              className={`text-sm font-medium ${
                driverProfile?.availability === "AVAILABLE"
                  ? "text-green-600"
                  : driverProfile?.availability === "ON_TRIP"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {driverProfile?.availability === "ON_TRIP"
                ? "On Trip"
                : driverProfile?.availability === "AVAILABLE"
                ? "Available"
                : "Unavailable"}
            </label>
          </div>

          {/* Refresh Button */}
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

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pickup/destination..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
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
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    vehicleType: value,
                    page: 1,
                  }))
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
                  setFilters((prev) => ({ ...prev, fareRange: value, page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Fares" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fares</SelectItem>
                  {Object.entries(fareRangeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Per Page</label>
              <Select
                value={String(filters.limit)}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    limit: Number(value),
                    page: 1,
                  }))
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredAndSortedRides.length)} of{" "}
          {filteredAndSortedRides.length} requested rides
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Total available: {requestedRides.length}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Ride Info</th>
                  <th className="px-4 py-3 font-medium">Locations</th>
                  <th className="px-4 py-3 font-medium">Fare & Distance</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-muted/60 transition-colors"
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
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          Loading available rides...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRides.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Search className="h-12 w-12" />
                        <p className="text-lg font-medium">
                          No ride requests found
                        </p>
                        <p className="text-sm">
                          Try adjusting your filters or check back later.
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRides.map((ride: IRide) => (
                    <tr
                      key={(ride as any)._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      {/* Ride Info */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-sm">
                            #
                            {String((ride as any)._id)
                              .slice(-6)
                              .toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Rider: {String((ride as any).riderId).slice(-6)}
                          </div>
                        </div>
                      </td>

                      {/* Locations */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <div className="text-xs">
                              <div className="font-medium text-green-700">
                                From
                              </div>
                              <div className="text-muted-foreground truncate max-w-[150px]">
                                {ride.pickupLocation.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <div className="text-xs">
                              <div className="font-medium text-red-700">To</div>
                              <div className="text-muted-foreground truncate max-w-[150px]">
                                {ride.destinationLocation.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Fare & Distance */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <FaBangladeshiTakaSign className="h-3 w-3 text-green-600" />
                            <span className="font-semibold text-lg">
                              {ride.fare.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ride.distance.toFixed(1)} km
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={statusConfig.REQUESTED.color}
                        >
                          {statusConfig.REQUESTED.label}
                        </Badge>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-4">
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
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate((ride as any).createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRide(ride)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRide(ride)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accept
                          </Button>
                        </div>
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <Dialog open={showOfflineModal} onOpenChange={setShowOfflineModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Go Offline?</DialogTitle>
            <DialogDescription>
              If you go offline, you will stop receiving new ride requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOfflineModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                await updateMyProfile({ availability: "UNAVAILABLE" }).unwrap();
                await refetchDriver();
                toast.info("You are currently offline.");
                setShowOfflineModal(false);
              }}
            >
              Go Offline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
