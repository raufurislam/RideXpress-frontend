// driver.api.ts
import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IDriver,
  IDriverApplication,
  IRide,
  IAvailability,
  IDriverProfile,
  IUpdateMyDriverProfile,
  IDriverEarnings,
  IDriverRideHistoryQuery,
  IDriverRideHistoryResponse,
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

    getRequestedRides: builder.query<IRide[], void>({
      query: () => ({
        url: "/ride/requested",
        method: "GET",
      }),
      providesTags: ["RIDE"],
      transformResponse: (response: IResponse<IRide[]>) => response.data,
    }),

    updateAvailability: builder.mutation<IResponse<IDriver>, IAvailability>({
      query: (userInfo) => ({
        url: "/driver/availability",
        method: "PATCH",
        data: userInfo,
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // GET my profile
    getDriverMyProfile: builder.query<IDriverProfile, void>({
      query: () => ({
        url: "/driver/my-profile",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
      transformResponse: (response: IResponse<IDriverProfile>) => response.data,
    }),

    // Get driver earnings
    getMyEarningSummaryDriver: builder.query<IDriverEarnings, void>({
      query: () => ({
        url: "/ride/earnings",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
      transformResponse: (response: IResponse<IDriverEarnings>) =>
        response.data,
    }),

    // PATCH update my profile
    updateMyProfile: builder.mutation<
      IResponse<IDriverProfile>,
      IUpdateMyDriverProfile
    >({
      query: (payload) => ({
        url: "/driver/update-my-profile",
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // GET Driver ride history
    getDriverRideHistory: builder.query<
      IResponse<IDriverRideHistoryResponse>,
      IDriverRideHistoryQuery
    >({
      query: (params: IDriverRideHistoryQuery = {}) => ({
        url: "/driver/my-ride-history",
        method: "GET",
        params,
      }),
      providesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useApplyDriverMutation,
  useDriverApplicationQuery,
  useGetAllRideQuery,
  useGetRequestedRidesQuery,
  useUpdateAvailabilityMutation,
  useGetDriverMyProfileQuery,
  useGetMyEarningSummaryDriverQuery,
  useUpdateMyProfileMutation,
  useGetDriverRideHistoryQuery,
} = driverApi;
