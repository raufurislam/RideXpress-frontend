export interface IRide {
  _id: string;
  riderId: string;
  driverId: string;
  pickupLocation: PickupLocation;
  destinationLocation: DestinationLocation;
  fare: number;
  distance: number;
  status: RideStatus;
  vehicleType: "CAR" | "BIKE";
  timestamps: IRideTimestamps;
  createdAt: string;
  updatedAt: string;
}

// Ride Status
export type RideStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface IRideRequest {
  pickupLocation: PickupLocation;
  destinationLocation: DestinationLocation;
  vehicleType: string;
}

export interface PickupLocation {
  type: string;
  coordinates: number[];
  name: string;
}

export interface DestinationLocation {
  type: string;
  coordinates: number[];
  name: string;
}

export interface IRideTimestamps {
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  in_transit?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  rejectedAt?: Date;
}
