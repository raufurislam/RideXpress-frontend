import { baseApi } from "@/redux/baseApi";
import type { IResponse, IRide, IRideRequest } from "@/types";
import type { IRideTimestamps } from "@/types/ride.type";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rideRequest: builder.mutation<IResponse<IRide>, IRideRequest>({
      query: (userInfo) => ({
        url: "/ride",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["RIDE"],
    }),

    getAllRideRider: builder.query<IRide[], void>({
      query: () => ({
        url: "/ride/rideHistory",
        method: "GET",
      }),
      providesTags: ["RIDE"],
      transformResponse: (response: IResponse<IRide[]>) => response.data,
    }),

    getSingleRideRider: builder.query<IResponse<IRide>, void>({
      query: (userInfo) => ({
        url: "/ride/rideHistory/:rideId",
        method: "GET",
        data: userInfo,
      }),
      providesTags: ["RIDE"],
    }),

    updateRideStatus: builder.mutation<IResponse<IRide>, IRideTimestamps>({
      query: (userInfo) => ({
        url: "/ride/rideStatus/:rideId",
        method: "PATCH",
        data: userInfo,
      }),
      // providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useRideRequestMutation,
  useGetAllRideRiderQuery,
  useLazyGetSingleRideRiderQuery,
  useUpdateRideStatusMutation,
} = rideApi;
