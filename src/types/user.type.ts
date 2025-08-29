// user.types.ts
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

// ✅ Role fixed with const assertion
export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  RIDER: "RIDER",
  DRIVER: "DRIVER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// ✅ IsActive already correct, just kept same style
export const IsActive = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
} as const;

export type IsActive = (typeof IsActive)[keyof typeof IsActive];

export interface IUser {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  password?: string;
  phone?: string;
  address?: string;
  auths: IAuthProvider[];
  role: Role; // uses our new Role type
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  rides?: string[];
  createdAt?: string;
}
