export interface IRide {
  _id: string;
  riderId: string;
  driverId: string | null;
  pickupLocation: IRideLocation;
  destinationLocation: IRideLocation;
  fare: number;
  distance: number;
  status: RideStatus;
  vehicleType: "CAR" | "BIKE";
  timestamps: IRideTimestamps;
  cancellationReason?: string;
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
  pickupLocation: IRideLocation;
  destinationLocation: IRideLocation;
  vehicleType: string;
}

export interface IRideLocation {
  type: "Point";
  coordinates: [number, number]; // GeoJSON: [lng, lat]
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
