export type { IRegister, ILogin } from "./auth.type";
export type { IUser } from "./user.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
export type TRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "DRIVER";
