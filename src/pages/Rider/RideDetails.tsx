import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Car,
  Bike,
  DollarSign,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Navigation,
  Route,
} from "lucide-react";
// import { useLazyGetSingleRideRiderQuery } from "@/redux/features/ride/ride.api";
import type { IRide } from "@/types";

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

export default function RideDetails() {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<IRide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [getRide] = useLazyGetSingleRideRiderQuery();

  useEffect(() => {
    if (rideId) {
      fetchRideDetails();
    }
  }, [rideId]);

  const fetchRideDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, using mock data since the API endpoint needs rideId parameter
      // In real implementation, you would call: const result = await getRide(rideId).unwrap();

      // Mock data for demonstration
      const mockRide: IRide = {
        _id: rideId || "mock-ride-id",
        riderId: "rider123",
        driverId: "driver456",
        pickupLocation: {
          type: "Point",
          coordinates: [40.7589, -73.9851],
          name: "Times Square, New York, NY",
        },
        destinationLocation: {
          type: "Point",
          coordinates: [40.7505, -73.9934],
          name: "Madison Square Garden, New York, NY",
        },
        fare: 28.5,
        distance: 2.8,
        status: "COMPLETED",
        vehicleType: "CAR",
        timestamps: {
          requestedAt: new Date("2024-01-15T14:00:00Z"),
          acceptedAt: new Date("2024-01-15T14:03:00Z"),
          pickedUpAt: new Date("2024-01-15T14:15:00Z"),
          completedAt: new Date("2024-01-15T14:35:00Z"),
        },
        createdAt: "2024-01-15T14:00:00Z",
        updatedAt: "2024-01-15T14:35:00Z",
      };

      setRide(mockRide);
    } catch (err) {
      setError("Failed to load ride details");
      console.error("Error fetching ride details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "REQUESTED":
  //       return "🔵";
  //     case "ACCEPTED":
  //       return "🟢";
  //     case "PICKED_UP":
  //       return "🟣";
  //     case "IN_TRANSIT":
  //       return "🔵";
  //     case "COMPLETED":
  //       return "✅";
  //     case "CANCELLED":
  //       return "❌";
  //     case "REJECTED":
  //       return "❌";
  //     default:
  //       return "⚪";
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Ride not found"}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ride Details</h1>
          <p className="text-muted-foreground">
            Complete information about your ride #{ride._id.slice(-6)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ride Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Ride Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      statusConfig[ride.status as keyof typeof statusConfig]
                        ?.color
                    }`}
                  >
                    {
                      statusConfig[ride.status as keyof typeof statusConfig]
                        ?.label
                    }
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Vehicle Type
                  </label>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      vehicleTypeConfig[
                        ride.vehicleType as keyof typeof vehicleTypeConfig
                      ]?.color
                    }`}
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
                </div>
              </div>

              {/* Route Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Route Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-green-900">
                        Pickup Location
                      </div>
                      <div className="text-sm text-green-700">
                        {ride.pickupLocation.name}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Coordinates:{" "}
                        {ride.pickupLocation.coordinates.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <MapPin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">
                        Destination
                      </div>
                      <div className="text-sm text-red-700">
                        {ride.destinationLocation.name}
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        Coordinates:{" "}
                        {ride.destinationLocation.coordinates.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ride Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ride Timeline</h3>
                <div className="space-y-4">
                  {ride.timestamps.requestedAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Ride Requested</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(ride.timestamps.requestedAt)}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">
                        {formatTime(ride.timestamps.requestedAt)}
                      </div>
                    </div>
                  )}

                  {ride.timestamps.acceptedAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Driver Accepted</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(ride.timestamps.acceptedAt)}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">
                        {formatTime(ride.timestamps.acceptedAt)}
                      </div>
                    </div>
                  )}

                  {ride.timestamps.pickedUpAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Passenger Picked Up</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(ride.timestamps.pickedUpAt)}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">
                        {formatTime(ride.timestamps.pickedUpAt)}
                      </div>
                    </div>
                  )}

                  {ride.timestamps.completedAt && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Ride Completed</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(ride.timestamps.completedAt)}
                        </div>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">
                        {formatTime(ride.timestamps.completedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    Driver #{ride.driverId.slice(-6)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Professional driver with excellent rating
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-muted-foreground">
                        +1 (555) 123-4567
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-muted-foreground">
                        driver@rideexpress.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ride Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Ride Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    ${ride.fare.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-700">Total Faresfdsf</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {ride.distance.toFixed(1)}
                  </div>
                  <div className="text-xs text-blue-700">Distance (km)</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ride ID</span>
                  <span className="font-mono text-sm font-medium">
                    #{ride._id.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Requested
                  </span>
                  <span className="text-sm font-medium">
                    {ride.timestamps.requestedAt
                      ? formatDate(ride.timestamps.requestedAt)
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="text-sm font-medium">
                    {ride.timestamps.completedAt
                      ? formatDate(ride.timestamps.completedAt)
                      : "—"}
                  </span>
                </div>
                {ride.timestamps.requestedAt && ride.timestamps.completedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Duration
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (new Date(ride.timestamps.completedAt).getTime() -
                          new Date(ride.timestamps.requestedAt).getTime()) /
                          (1000 * 60)
                      )}{" "}
                      min
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Driver
              </Button>
              <Button className="w-full" variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                View Route
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Similar Ride
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
