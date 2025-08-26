/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.api.ts
import { baseApi } from "@/redux/baseApi";
import type { IResponse, IDriver, DriverStatus } from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query<
      IResponse<{ data: IDriver[]; meta: any }>,
      void
    >({
      query: () => ({
        url: "/driver/driver-application",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    updateDriverStatus: builder.mutation<
      IResponse<IDriver>,
      { driverId: string; driverStatus: DriverStatus }
    >({
      query: ({ driverId, driverStatus }) => ({
        url: `/driver/driver-application/status/${driverId}`,
        method: "PATCH",
        data: { driverStatus },
      }),
      invalidatesTags: ["DRIVER"],
    }),
  }),
});

export const { useGetAllDriversQuery, useUpdateDriverStatusMutation } =
  adminApi;
