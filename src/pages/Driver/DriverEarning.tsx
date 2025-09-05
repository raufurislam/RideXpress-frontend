import { useGetMyEarningSummaryDriverQuery } from "@/redux/features/driver/driver.api";
import EarningsDashboard from "@/components/modules/Driver/EarningsDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverEarning() {
  const {
    data: earningsData,
    isLoading,
    error,
    refetch,
  } = useGetMyEarningSummaryDriverQuery();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to Load Earnings
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your earnings data. Please try again.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!earningsData && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Earnings Data</h3>
            <p className="text-muted-foreground">
              You haven't completed any rides yet. Start driving to see your
              earnings here!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <EarningsDashboard
        earningsData={
          earningsData || { totalRides: 0, totalEarnings: 0, rides: [] }
        }
        isLoading={isLoading}
      />
    </div>
  );
}
