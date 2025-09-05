/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";
import {
  useCancelRideMutation,
  useGetActiveRideRiderQuery,
} from "@/redux/features/ride/ride.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ActiveRideRider() {
  const {
    data: activeRide,
    isFetching,
    refetch,
  } = useGetActiveRideRiderQuery();
  const [cancelRide, { isLoading }] = useCancelRideMutation();

  const handleCancel = async () => {
    if (!activeRide?._id) return;
    try {
      const res = await cancelRide({ rideId: activeRide._id }).unwrap();
      toast.success(res.message || "Ride cancelled");
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to cancel ride");
    }
  };

  const canCancel = activeRide && ["REQUESTED"].includes(activeRide.status);

  if (isFetching) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Active ride</CardTitle>
          </CardHeader>
          <CardContent>Loading...</CardContent>
        </Card>
      </div>
    );
  }

  if (!activeRide) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>No active ride</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You are not currently on any ride.
            </p>
            <Button asChild>
              <Link to="/rider/request-ride">Request a ride</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Active ride</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Pickup</div>
              <div className="font-medium">
                {activeRide.pickupLocation?.name}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="font-medium">
                {activeRide.destinationLocation?.name}
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className="font-semibold">
                {activeRide.status.replaceAll("_", " ")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Fare</div>
              <div className="font-semibold">৳ {activeRide.fare ?? 0}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Distance</div>
              <div className="font-semibold">
                {activeRide.distance?.toFixed?.(2) ?? activeRide.distance} km
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Vehicle</div>
              <div className="font-semibold">{activeRide.vehicleType}</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {canCancel && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel ride"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
