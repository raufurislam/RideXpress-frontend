import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useGetDriverRideHistoryQuery } from "@/redux/features/driver/driver.api";
import {
  MapPin,
  Car,
  Bike,
  Clock,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  User,
  Phone,
  Mail,
  Navigation,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { FaBangladeshiTakaSign as TakaIcon } from "react-icons/fa6";
import {
  type IRide,
  type RideStatus,
  type IUser,
  type IDriverRideHistoryQuery,
} from "@/types";
import { format } from "date-fns";

// Type for populated ride data
interface IPopulatedRide extends Omit<IRide, "riderId"> {
  riderId: IUser;
}

// Type guard to check if riderId is populated
const isPopulatedRide = (
  ride: IRide | IPopulatedRide
): ride is IPopulatedRide => {
  return typeof ride.riderId === "object" && ride.riderId !== null;
};

// Status configuration for badges and icons
const statusConfig: Record<
  RideStatus,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "pending";
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  REQUESTED: {
    label: "Requested",
    variant: "pending",
    icon: Clock,
    color: "text-blue-600",
  },
  ACCEPTED: {
    label: "Accepted",
    variant: "warning",
    icon: CheckCircle,
    color: "text-yellow-600",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600",
  },
  PICKED_UP: {
    label: "Picked Up",
    variant: "warning",
    icon: Navigation,
    color: "text-orange-600",
  },
  IN_TRANSIT: {
    label: "In Transit",
    variant: "warning",
    icon: Car,
    color: "text-purple-600",
  },
  COMPLETED: {
    label: "Completed",
    variant: "success",
    icon: CheckCircle,
    color: "text-green-600",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600",
  },
};

// Vehicle type configuration
const vehicleTypeConfig = {
  CAR: {
    label: "Car",
    icon: Car,
    color: "text-blue-600",
  },
  BIKE: {
    label: "Bike",
    icon: Bike,
    color: "text-green-600",
  },
};

// Status badge component
const StatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Vehicle type badge component
const VehicleTypeBadge: React.FC<{ vehicleType: "CAR" | "BIKE" }> = ({
  vehicleType,
}) => {
  const config = vehicleTypeConfig[vehicleType];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
};

// Ride details component
const RideDetails: React.FC<{ ride: IRide | IPopulatedRide }> = ({ ride }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Pickup</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 p-0"
        >
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {ride.pickupLocation.name}
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Destination</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {ride.destinationLocation.name}
          </div>

          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Distance</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {ride.distance.toFixed(2)} km
          </div>

          {ride.timestamps && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Timeline</span>
              </div>
              {ride.timestamps.requestedAt && (
                <div className="flex justify-between text-xs">
                  <span>Requested</span>
                  <span>
                    {format(
                      new Date(ride.timestamps.requestedAt),
                      "MMM dd, HH:mm"
                    )}
                  </span>
                </div>
              )}
              {ride.timestamps.acceptedAt && (
                <div className="flex justify-between text-xs">
                  <span>Accepted</span>
                  <span>
                    {format(
                      new Date(ride.timestamps.acceptedAt),
                      "MMM dd, HH:mm"
                    )}
                  </span>
                </div>
              )}
              {ride.timestamps.pickedUpAt && (
                <div className="flex justify-between text-xs">
                  <span>Picked Up</span>
                  <span>
                    {format(
                      new Date(ride.timestamps.pickedUpAt),
                      "MMM dd, HH:mm"
                    )}
                  </span>
                </div>
              )}
              {ride.timestamps.completedAt && (
                <div className="flex justify-between text-xs">
                  <span>Completed</span>
                  <span>
                    {format(
                      new Date(ride.timestamps.completedAt),
                      "MMM dd, HH:mm"
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Main component
export default function RideHistoryDriver() {
  const [filters, setFilters] = useState<IDriverRideHistoryQuery>({
    page: 1,
    limit: 10,
    status: "",
    vehicleType: "",
    searchTerm: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Update search term when debounced value changes
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  // Clean query parameters - remove empty strings and undefined values
  const cleanQueryParams = useMemo(() => {
    const cleaned = { ...filters };

    // Remove empty strings and undefined values
    Object.keys(cleaned).forEach((key) => {
      if (
        cleaned[key as keyof IDriverRideHistoryQuery] === "" ||
        cleaned[key as keyof IDriverRideHistoryQuery] === undefined
      ) {
        delete cleaned[key as keyof IDriverRideHistoryQuery];
      }
    });

    // Convert page and limit to numbers
    if (cleaned.page) cleaned.page = Number(cleaned.page);
    if (cleaned.limit) cleaned.limit = Number(cleaned.limit);

    return cleaned;
  }, [filters]);

  const { data, isLoading, error, refetch } =
    useGetDriverRideHistoryQuery(cleanQueryParams);

  const handleFilterChange = useCallback(
    (key: keyof IDriverRideHistoryQuery, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: 1, // Reset to first page when filters change
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      status: "",
      vehicleType: "",
      searchTerm: "",
    });
    setSearchInput("");
  }, []);

  const rides: (IRide | IPopulatedRide)[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(filters.status || filters.vehicleType || filters.searchTerm);
  }, [filters.status, filters.vehicleType, filters.searchTerm]);

  // Generate pagination items with improved UX
  const generatePaginationItems = useCallback(() => {
    if (!meta) return [];

    const items = [];
    const currentPage = meta.page;
    const totalPages = meta.totalPage;

    // Show simplified pagination for small page counts
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={
            currentPage <= 1
              ? "pointer-events-none opacity-50"
              : "cursor-pointer hover:bg-muted"
          }
        />
      </PaginationItem>
    );

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 4) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          className={
            currentPage >= totalPages
              ? "pointer-events-none opacity-50"
              : "cursor-pointer hover:bg-muted"
          }
        />
      </PaginationItem>
    );

    return items;
  }, [meta, handlePageChange]);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load ride history</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ride History</h1>
          <p className="text-muted-foreground">
            Paginated and filterable past ride records
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rides..."
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
                {isLoading && searchInput !== debouncedSearchTerm && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) =>
                  handleFilterChange("status", value === "ALL" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="REQUESTED">Requested</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select
                value={filters.vehicleType || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "vehicleType",
                    value === "ALL" ? "" : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All vehicles</SelectItem>
                  <SelectItem value="CAR">Car</SelectItem>
                  <SelectItem value="BIKE">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Rides</span>
              </div>
              <div className="text-2xl font-bold">{meta.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {
                  rides.filter(
                    (ride: IRide | IPopulatedRide) =>
                      ride.status === "COMPLETED"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Cancelled</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {
                  rides.filter(
                    (ride: IRide | IPopulatedRide) =>
                      ride.status === "CANCELLED"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TakaIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {rides
                  .filter(
                    (ride: IRide | IPopulatedRide) =>
                      ride.status === "COMPLETED"
                  )
                  .reduce(
                    (sum: number, ride: IRide | IPopulatedRide) =>
                      sum + ride.fare,
                    0
                  )
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rides Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ride Records</CardTitle>
        </CardHeader>
        <CardContent>
          {rides.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rides found</h3>
              <p className="text-muted-foreground">
                {filters.searchTerm || filters.status || filters.vehicleType
                  ? "No rides match your current filters"
                  : "You haven't completed any rides yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ride Details</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.map((ride: IRide | IPopulatedRide) => (
                    <TableRow key={ride._id}>
                      <TableCell>
                        <RideDetails ride={ride} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {isPopulatedRide(ride)
                                ? (ride as IPopulatedRide).riderId.name
                                : "Unknown"}
                            </span>
                          </div>
                          {isPopulatedRide(ride) && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {(ride as IPopulatedRide).riderId.phone ||
                                  "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {(ride as IPopulatedRide).riderId.email}
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ride.status} />
                      </TableCell>
                      <TableCell>
                        <VehicleTypeBadge vehicleType={ride.vehicleType} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          <TakaIcon className="h-4 w-4" />
                          {ride.fare.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {format(new Date(ride.createdAt), "MMM dd, yyyy")}
                          </div>
                          <div className="text-muted-foreground">
                            {format(new Date(ride.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta && meta.totalPage > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                      {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                      {meta.total} rides
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">
                        Per page:
                      </label>
                      <Select
                        value={filters.limit?.toString() || "10"}
                        onValueChange={(value) =>
                          handleFilterChange("limit", Number(value))
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      {generatePaginationItems()}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
