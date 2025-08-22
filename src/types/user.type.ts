// user.types.ts
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  password?: string;
  phone?: string;
  address?: string;
  auths: IAuthProvider[];
  role: "RIDER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN";
  isDeleted?: string;
  isActive?: "ACTIVE" | "BLOCK" | "SUSPENDED";
  isVerified?: boolean;
  rides?: string[];
}
