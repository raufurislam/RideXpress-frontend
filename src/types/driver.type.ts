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
} as const;

export type Availability = (typeof AVAILABILITY)[keyof typeof AVAILABILITY];
