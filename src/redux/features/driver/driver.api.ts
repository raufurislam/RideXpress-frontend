// driver.api.ts
import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IDriver,
  IDriverApplication,
  IRide,
  IAvailability,
} from "@/types";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyDriver: builder.mutation<IResponse<IDriver>, IDriverApplication>({
      query: (driverInfo) => ({
        url: "/driver/apply-driver",
        method: "POST",
        data: driverInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    driverApplication: builder.query<
      IResponse<{ data: IDriver[]; meta?: unknown }>,
      void
    >({
      query: () => ({
        url: "/driver/driver-application",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getAllRide: builder.query<IRide[], void>({
      query: () => ({
        url: "/ride",
        method: "GET",
      }),
      providesTags: ["RIDE"],
      transformResponse: (response: IResponse<IRide[]>) => response.data,
    }),

    updateAvailability: builder.mutation<IResponse<IDriver>, IAvailability>({
      query: (userInfo) => ({
        url: "/driver/update-availability",
        method: "PATCH",
        data: userInfo,
      }),
      // providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useApplyDriverMutation,
  useDriverApplicationQuery,
  useGetAllRideQuery,
} = driverApi;
