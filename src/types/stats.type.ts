// types.ts
export interface IPublicStats {
  totalCompletedRides: number;
  totalApprovedDrivers: number;
  vehicleTypes: string[];
  mostPopularPickup: { location: string; rides: number } | null;
  communityMilestone: number;
  activeRiders: number;
}
