export const DRIVER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const AVAILABILITY = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const VEHICLE_TYPE = {
  CAR: "CAR",
  BIKE: "BIKE",
  VAN: "VAN",
} as const;

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];
export type Availability = (typeof AVAILABILITY)[keyof typeof AVAILABILITY];
export type VehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE];
