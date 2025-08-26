// driver.api.ts
import { baseApi } from "@/redux/baseApi";
import type { IResponse, IDriver, IDriverApplication } from "@/types";

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
  }),
});

export const { useApplyDriverMutation, useDriverApplicationQuery } = driverApi;
