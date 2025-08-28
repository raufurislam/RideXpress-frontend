// auth.api.ts
import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IDriver,
  DriverStatus,
  IResponseWithMeta,
} from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query<
      { data: IDriver[]; meta: { page: number; limit: number; total: number } },
      {
        search?: string;
        searchTerm?: string;
        status?: string;
        availability?: string;
        vehicleType?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/driver/driver-application",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IResponseWithMeta<
          IDriver[] | { data: IDriver[]; meta?: unknown }
        >
      ) => {
        // Handle both shapes:
        // 1) { data: IDriver[], meta }
        // 2) { data: { data: IDriver[], meta }, meta? }
        const rawData = response.data as unknown;
        if (Array.isArray(rawData)) {
          return {
            data: rawData,
            meta: response.meta as {
              page: number;
              limit: number;
              total: number;
            },
          };
        }
        const nested = rawData as { data?: IDriver[]; meta?: unknown };
        const data = Array.isArray(nested?.data) ? nested.data : [];
        const meta =
          (nested?.meta as { page: number; limit: number; total: number }) ||
          (response.meta as { page: number; limit: number; total: number });
        return { data, meta };
      },
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
