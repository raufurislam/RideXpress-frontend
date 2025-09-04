import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Car,
  Bike,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllDriversQuery,
  useUpdateDriverStatusMutation,
} from "@/redux/features/admin/admin.api";
import {
  type IDriver,
  type DriverStatus,
  type Availability,
  DRIVER_STATUS,
  AVAILABILITY,
  VEHICLE_TYPE,
} from "@/types/driver.type";

// Use the existing types from the types file
type Driver = IDriver;

interface FilterState {
  search: string;
  status: string | "all";
  availability: string | "all";
  vehicleType: string | "all";
}

interface SortConfig {
  key: keyof Driver;
  direction: "asc" | "desc";
}

// API integration - no more mock data needed

const AllDriver: React.FC = () => {
  // API integration
  const emptyParams = {} as const;
  const {
    data: driversResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllDriversQuery(emptyParams);
  const [updateDriverStatus, { isLoading: isUpdating }] =
    useUpdateDriverStatusMutation();

  // State management
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    availability: "all",
    vehicleType: "all",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Extract drivers from API response (normalized to array)
  const rawDrivers = (driversResponse?.data ?? null) as unknown;
  const drivers: Driver[] = Array.isArray(rawDrivers)
    ? (rawDrivers as Driver[])
    : rawDrivers &&
      typeof rawDrivers === "object" &&
      Array.isArray((rawDrivers as { data?: Driver[] }).data)
    ? ((rawDrivers as { data?: Driver[] }).data as Driver[]) ?? []
    : [];

  // Filter and sort drivers
  const filteredAndSortedDrivers = useMemo(() => {
    const filtered = drivers.filter((driver: Driver) => {
      const matchesSearch =
        filters.search === "" ||
        driver.vehicleModel
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        driver.vehicleNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        driver.licenseNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || driver.status === filters.status;
      const matchesAvailability =
        filters.availability === "all" ||
        driver.availability === filters.availability;
      const matchesVehicleType =
        filters.vehicleType === "all" ||
        driver.vehicleType === filters.vehicleType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAvailability &&
        matchesVehicleType
      );
    });

    // Sort drivers
    if (sortConfig) {
      const sorted = [...filtered].sort((a: Driver, b: Driver) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
      return sorted;
    }

    return filtered;
  }, [drivers, filters, sortConfig]);

  // Handlers
  const handleSort = (key: keyof Driver) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const handleStatusUpdate = async (
    driverId: string,
    newStatus: DriverStatus
  ) => {
    try {
      await updateDriverStatus({
        driverId,
        driverStatus: newStatus,
      }).unwrap();

      toast.success(`Driver status updated to ${newStatus}`);
      // Refetch data to get the latest state
      refetch();
    } catch (error) {
      toast.error("Failed to update driver status");
      console.error("Error updating driver status:", error);
    }
  };

  const getStatusBadgeVariant = (status: DriverStatus) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "PENDING":
        return "pending";
      case "SUSPEND":
        return "warning";
      default:
        return "default";
    }
  };

  const getAvailabilityBadgeVariant = (availability: Availability) => {
    switch (availability) {
      case "AVAILABLE":
        return "available";
      case "UNAVAILABLE":
        return "unavailable";
      default:
        return "default";
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "CAR":
        return <Car className="h-4 w-4" />;
      case "BIKE":
        return <Bike className="h-4 w-4" />;
      case "VAN":
        return <Truck className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      availability: "all",
      vehicleType: "all",
    });
    setSortConfig(null);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };

  const formatCurrency = (amount: number) => {
    return `৳${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Error Loading Drivers</h3>
              <p className="text-sm text-muted-foreground">
                Failed to load driver data. Please try again later.
              </p>
              <Button
                onClick={() => refetch()}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Drivers</h1>
          <p className="text-muted-foreground">
            Manage and monitor all driver applications
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

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(DRIVER_STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select
                value={filters.availability}
                onValueChange={(value) =>
                  setFilters({ ...filters, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  {Object.entries(AVAILABILITY).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) =>
                  setFilters({ ...filters, vehicleType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Vehicle Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicle Types</SelectItem>
                  {Object.entries(VEHICLE_TYPE).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedDrivers.length} of {drivers.length} drivers
        </p>
        {sortConfig && (
          <p className="text-sm text-muted-foreground">
            Sorted by {sortConfig.key} ({sortConfig.direction})
          </p>
        )}
      </div>

      {/* Drivers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("vehicleType")}
                >
                  <div className="flex items-center gap-2">
                    Vehicle Type
                    {sortConfig?.key === "vehicleType" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("vehicleModel")}
                >
                  <div className="flex items-center gap-2">
                    Model
                    {sortConfig?.key === "vehicleModel" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("vehicleNumber")}
                >
                  <div className="flex items-center gap-2">
                    Vehicle Number
                    {sortConfig?.key === "vehicleNumber" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>License Number</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortConfig?.key === "status" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("availability")}
                >
                  <div className="flex items-center gap-2">
                    Availability
                    {sortConfig?.key === "availability" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("appliedAt")}
                >
                  <div className="flex items-center gap-2">
                    Applied Date
                    {sortConfig?.key === "appliedAt" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("earnings")}
                >
                  <div className="flex items-center gap-2">
                    Earnings
                    {sortConfig?.key === "earnings" && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8" />
                      <p>No drivers found matching your criteria</p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedDrivers.map((driver) => (
                  <TableRow
                    key={driver._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(driver.vehicleType)}
                        <span className="font-medium">
                          {driver.vehicleType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {driver.vehicleModel}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.vehicleNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {driver.licenseNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(driver.status)}>
                        {driver.status === "PENDING" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {driver.status === "APPROVED" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {driver.status === "REJECTED" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {driver.status === "SUSPEND" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getAvailabilityBadgeVariant(
                          driver.availability
                        )}
                      >
                        {driver.availability}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(driver.appliedAt)}</TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {formatCurrency(driver.earnings)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {driver.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "APPROVED")
                                }
                                className="text-green-600 focus:text-green-600"
                                disabled={isUpdating}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Approve"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "REJECTED")
                                }
                                className="text-red-600 focus:text-red-600"
                                disabled={isUpdating}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Reject"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "SUSPEND")
                                }
                                className="text-yellow-600 focus:text-yellow-600"
                                disabled={isUpdating}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Suspend"}
                              </DropdownMenuItem>
                            </>
                          )}
                          {driver.status === "APPROVED" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "REJECTED")
                                }
                                className="text-red-600 focus:text-red-600"
                                disabled={isUpdating}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Revoke Approval"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "SUSPEND")
                                }
                                className="text-yellow-600 focus:text-yellow-600"
                                disabled={isUpdating}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Suspend"}
                              </DropdownMenuItem>
                            </>
                          )}
                          {driver.status === "REJECTED" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "APPROVED")
                                }
                                className="text-green-600 focus:text-green-600"
                                disabled={isUpdating}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Approve"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "SUSPEND")
                                }
                                className="text-yellow-600 focus:text-yellow-600"
                                disabled={isUpdating}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Suspend"}
                              </DropdownMenuItem>
                            </>
                          )}
                          {driver.status === "SUSPEND" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "APPROVED")
                                }
                                className="text-green-600 focus:text-green-600"
                                disabled={isUpdating}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Approve"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(driver._id, "REJECTED")
                                }
                                className="text-red-600 focus:text-red-600"
                                disabled={isUpdating}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {isUpdating ? "Updating..." : "Reject"}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllDriver;
