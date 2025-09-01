import { baseApi } from "@/redux/baseApi";
import type { IResponse, IRide, IRideRequest, RideStatus } from "@/types";

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

    updateRideStatus: builder.mutation<
      IResponse<IRide>,
      { rideId: string; rideStatus: RideStatus }
    >({
      query: ({ rideId, rideStatus }) => ({
        url: `/ride/rideStatus/${rideId}`,
        method: "PATCH",
        data: { rideStatus },
      }),
      invalidatesTags: ["RIDE"],
    }),
  }),
});

export const {
  useRideRequestMutation,
  useGetAllRideRiderQuery,
  useLazyGetSingleRideRiderQuery,
  useUpdateRideStatusMutation,
} = rideApi;
