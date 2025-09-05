export interface IDriverApplication {
  vehicleType: string;
  vehicleModel: string;
  licenseNumber: string;
  vehicleNumber: string;
}

export interface IDriver {
  _id: string;
  userId: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPEND";
  availability: "AVAILABLE" | "UNAVAILABLE" | "ON_TRIP";
  appliedAt: Date;
  approvedAt?: Date;
  earnings: number;
}

export const VEHICLE_TYPE = {
  CAR: "CAR",
  BIKE: "BIKE",
  VAN: "VAN",
} as const;

export type VehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE];

export const DRIVER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPEND: "SUSPEND",
} as const;

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export interface IAvailability {
  availability: "AVAILABLE" | "UNAVAILABLE" | "ON_TRIP";
}

export const AVAILABILITY = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
  ON_TRIP: "ON_TRIP",
} as const;

export type Availability = (typeof AVAILABILITY)[keyof typeof AVAILABILITY];

// Driver update payload
export interface IUpdateMyDriverProfile {
  vehicleType?: VehicleType;
  vehicleModel?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  availability?: Availability;
}

// Driver profile response
export interface IDriverProfile {
  _id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DriverStatus;
  availability: Availability;
  appliedAt: Date;
  approvedAt?: Date;
  earnings: number;
}

// Driver Earnings Types
export interface IDriverEarnings {
  totalRides: number;
  totalEarnings: number;
  rides: IDriverEarningRide[];
}

export interface IDriverEarningRide {
  _id: string;
  riderId: string;
  driverId: string;
  pickupLocation: {
    type: string;
    coordinates: number[];
    name: string;
  };
  destinationLocation: {
    type: string;
    coordinates: number[];
    name: string;
  };
  fare: number;
  distance: number;
  status: string;
  vehicleType: string;
  timestamps: {
    requestedAt: string;
    acceptedAt: string;
    pickedUpAt: string;
    in_transit: string;
    completedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Driver Ride History Query Parameters
export interface IDriverRideHistoryQuery {
  page?: number;
  limit?: number;
  status?: string;
  vehicleType?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Driver Ride History Response Meta
export interface IDriverRideHistoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Driver Ride History Response
export interface IDriverRideHistoryResponse {
  data: any[]; // Will be populated rides
  meta: IDriverRideHistoryMeta;
}
