// utils/mappers.ts
import { Car, Bike, ShieldCheck, UserCog, Ban } from "lucide-react";
import { IsActive, Role } from "@/types";
import type { JSX } from "react";

export const roleMapper: Record<
  Role,
  { label: string; icon: JSX.Element; color: string }
> = {
  [Role.SUPER_ADMIN]: {
    label: "Super Admin",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700",
  },
  [Role.ADMIN]: {
    label: "Admin",
    icon: <UserCog className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700",
  },
  [Role.DRIVER]: {
    label: "Driver",
    icon: <Car className="h-4 w-4" />,
    color: "bg-emerald-100 text-emerald-700",
  },
  [Role.RIDER]: {
    label: "Rider",
    icon: <Bike className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-700",
  },
};

export const statusMapper: Record<
  IsActive,
  { label: string; color: string; icon: JSX.Element }
> = {
  [IsActive.ACTIVE]: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  [IsActive.SUSPENDED]: {
    label: "Suspended",
    color: "bg-amber-100 text-amber-700",
    icon: <UserCog className="h-4 w-4" />,
  },
  [IsActive.BLOCKED]: {
    label: "Blocked",
    color: "bg-red-100 text-red-700",
    icon: <Ban className="h-4 w-4" />,
  },
};
