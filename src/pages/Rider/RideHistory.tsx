/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useGetAllRideRiderQuery } from "@/redux/features/ride/ride.api";
import { RefreshCw } from "lucide-react";

export default function RideHistory() {
  const { data: rides = [], isLoading, error } = useGetAllRideRiderQuery();
  console.log(rides);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading rides</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ride History</h1>
          <p className="text-muted-foreground">
            Manage and monitor all ride history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            // onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {rides.length} of {rides.length} rides
        </p>
      </div>

      {/* Render rides */}
      <ul className="mt-4 space-y-2">
        {rides.map((ride: any, idx: number) => (
          <li key={idx} className="p-4 border rounded-md">
            {JSON.stringify(ride)}
          </li>
        ))}
      </ul>
    </div>
  );
}
