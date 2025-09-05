/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllRideQuery,
  useGetDriverMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/features/driver/driver.api";
import { useUpdateRideStatusMutation } from "@/redux/features/ride/ride.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  MapPin,
  Car,
  Bike,
  CheckCircle,
  Clock,
  Navigation,
  Flag,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { FaBangladeshiTakaSign as TakaIcon } from "react-icons/fa6";
import { toast } from "sonner";
import { type IRide, type RideStatus } from "@/types";

const statusConfig: Record<
  RideStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    nextStatus: RideStatus | null;
    nextLabel: string | null;
    description: string;
  }
> = {
  REQUESTED: {
    label: "Requested",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    nextStatus: null,
    nextLabel: null,
    description: "Ride requested, waiting for driver",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
    nextStatus: "PICKED_UP",
    nextLabel: "Mark as Picked Up",
    description: "Ride accepted, heading to pickup location",
  },
  PICKED_UP: {
    label: "Picked Up",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Navigation,
    nextStatus: "IN_TRANSIT",
    nextLabel: "Start Trip",
    description: "Passenger picked up, starting journey",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: Navigation,
    nextStatus: "COMPLETED",
    nextLabel: "Complete Trip",
    description: "Currently transporting passenger",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Flag,
    nextStatus: null,
    nextLabel: null,
    description: "Ride completed successfully",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Flag,
    nextStatus: null,
    nextLabel: null,
    description: "Ride was rejected",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Flag,
    nextStatus: null,
    nextLabel: null,
    description: "Ride was cancelled",
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

export default function ActiveRides() {
  const {
    data: allRides = [],
    isLoading,
    error,
    refetch,
  } = useGetAllRideQuery();

  const [updateRideStatus] = useUpdateRideStatusMutation();
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const { data: driverProfile, refetch: refetchDriver } =
    useGetDriverMyProfileQuery();
  const { data: me } = useUserInfoQuery();

  // Filter rides to show only active ones (not REQUESTED or REJECTED)
  // const activeRides = useMemo(() => {
  //   return allRides.filter(
  //     (ride) =>
  //       ride.status !== "REQUESTED" &&
  //       ride.status !== "REJECTED" &&
  //       ride.status !== "CANCELLED"
  //   );
  // }, [allRides]);

  const activeRides = useMemo(() => {
    const userId = me?.data?._id;
    return allRides
      .filter((ride) => ride.driverId === userId)
      .filter(
        (ride) =>
          ride.status !== "REQUESTED" &&
          ride.status !== "REJECTED" &&
          ride.status !== "CANCELLED"
      )
      .sort((a, b) => {
        if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
        if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
        if (a.status === "ACCEPTED" && b.status !== "ACCEPTED") return -1;
        if (b.status === "ACCEPTED" && a.status !== "ACCEPTED") return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [allRides, me?.data?._id]);

  // Check if driver has any active rides
  const hasActiveRides = activeRides.length > 0;

  useEffect(() => {
    if (!hasActiveRides) {
      updateMyProfile({ availability: "AVAILABLE" });
    }
  }, [hasActiveRides, updateMyProfile]);

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

  const handleUpdateRideStatus = async (ride: IRide, newStatus: RideStatus) => {
    try {
      await updateRideStatus({
        rideId: (ride as any)._id,
        rideStatus: newStatus,
      }).unwrap();

      toast.success(`Ride status updated to ${statusConfig[newStatus]?.label}`);

      if (newStatus === "PICKED_UP" || newStatus === "IN_TRANSIT") {
        await updateMyProfile({ availability: "ON_TRIP" }).unwrap();
        await refetchDriver();
        toast.info("You are now on a trip.");
      }

      if (newStatus === "COMPLETED") {
        await updateMyProfile({ availability: "AVAILABLE" }).unwrap();
        await refetchDriver();
        toast.success("Ride completed! You are now available for new rides.");
      }

      refetch(); // refresh rides
    } catch (error: any) {
      const message =
        error?.data?.message ||
        "Failed to update ride status. Please follow the required sequence.";
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
            Failed to load active rides. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!hasActiveRides) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No Active Rides
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            You are currently available for new ride requests. Check the "Get
            Ride" page to find available rides.
          </p>
          <div className="flex items-center gap-2 justify-center text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Status: Available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Rides</h1>
          <p className="text-muted-foreground">
            Manage your current rides and update their status
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
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <p className="text-2xl font-bold">{activeRides.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle
                  className={`h-5 w-5 ${
                    driverProfile?.availability === "AVAILABLE"
                      ? "text-green-600"
                      : driverProfile?.availability === "ON_TRIP"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${
                    driverProfile?.availability === "AVAILABLE"
                      ? "text-green-600"
                      : driverProfile?.availability === "ON_TRIP"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {driverProfile?.availability}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      driverProfile?.availability === "AVAILABLE"
                        ? "bg-green-500"
                        : driverProfile?.availability === "ON_TRIP"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      driverProfile?.availability === "AVAILABLE"
                        ? "text-green-600"
                        : driverProfile?.availability === "ON_TRIP"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {driverProfile?.availability === "AVAILABLE"
                      ? "Available"
                      : driverProfile?.availability === "ON_TRIP"
                      ? "On Trip"
                      : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle button (only show if not ON_TRIP) */}
            {driverProfile?.availability !== "ON_TRIP" && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={async () => {
                    const newStatus =
                      driverProfile?.availability === "AVAILABLE"
                        ? "UNAVAILABLE"
                        : "AVAILABLE";
                    await updateMyProfile({ availability: newStatus }).unwrap();
                    await refetchDriver();
                    toast.success(
                      `You are now marked as ${
                        newStatus === "AVAILABLE" ? "Available" : "Unavailable"
                      }.`
                    );
                  }}
                >
                  {driverProfile?.availability === "AVAILABLE"
                    ? "Set Unavailable"
                    : "Set Available"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Navigation className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Action</p>
                <p className="text-lg font-semibold text-purple-600">
                  {activeRides[0]?.status === "COMPLETED"
                    ? "Completed"
                    : "Update Status"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Rides List */}
      <div className="space-y-4">
        {activeRides.map((ride: IRide) => {
          const currentStatus =
            statusConfig[ride.status as keyof typeof statusConfig];
          const canUpdate =
            currentStatus?.nextStatus && ride.status !== "COMPLETED";

          return (
            <Card key={(ride as any)._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Ride #
                        {String((ride as any)._id)
                          .slice(-6)
                          .toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {currentStatus?.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={currentStatus?.color}>
                    {currentStatus?.icon && (
                      <currentStatus.icon className="h-3 w-3 mr-1" />
                    )}
                    {currentStatus?.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Ride Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Locations */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Route</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-xs">
                          <div className="font-medium text-green-700">From</div>
                          <div className="text-muted-foreground">
                            {ride.pickupLocation.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-xs">
                          <div className="font-medium text-red-700">To</div>
                          <div className="text-muted-foreground">
                            {ride.destinationLocation.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fare & Distance */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TakaIcon className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-lg">
                          {ride.fare.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ride.distance.toFixed(1)} km
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Date */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Info</h4>
                    <div className="space-y-2">
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
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(ride.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {canUpdate && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() =>
                        handleUpdateRideStatus(ride, currentStatus.nextStatus!)
                      }
                      className="w-full sm:w-auto"
                    >
                      {currentStatus.icon && (
                        <currentStatus.icon className="h-4 w-4 mr-2" />
                      )}
                      {currentStatus.nextLabel}
                    </Button>
                  </div>
                )}

                {/* Completed Ride Message */}
                {ride.status === "COMPLETED" && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Ride completed! You are now available for new rides.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
