export * from "./user.type";

// types/types.ts
import type { ComponentType } from "react";

export type { IRegister, ILogin } from "./auth.type";
export type { IUser } from "./user.type";
export type {
  IDriverApplication,
  IDriver,
  Availability,
  DriverStatus,
  VehicleType,
} from "./driver.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: [];
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IResponseWithMeta<T> extends IResponse<T> {
  meta: IMeta;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "DRIVER";
