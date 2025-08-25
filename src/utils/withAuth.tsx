// // withAuth.ts
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import type { TRole } from "@/types";
// import type { ComponentType } from "react";
// import { Navigate } from "react-router";

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
//   return function AuthWrapper() {
//     const { data, isLoading } = useUserInfoQuery(undefined);

//     if (!isLoading && !data?.data?.email) {
//       return <Navigate to="/login" />;
//     }

//     if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
//       return <Navigate to="/unauthorized" />;
//     }

//     // console.log("Inside withAuth", data);
//     return <Component />;
//   };
// };

// src/utils/withAuth.ts
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading, isFetching } = useUserInfoQuery(undefined);

    // Wait for the auth check to complete to avoid flicker/false redirect
    if (isLoading || isFetching) {
      return null;
    }

    if (!data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};
