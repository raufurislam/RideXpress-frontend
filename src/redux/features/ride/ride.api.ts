import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IRide, IRideRequest, RideStatus } from "@/types/ride.type";

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

    getSingleRideRider: builder.query<IResponse<IRide>, string>({
      query: (rideId) => ({
        url: `/ride/rideHistory/${rideId}`,
        method: "GET",
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
    cancelRide: builder.mutation<IResponse<IRide>, { rideId: string }>({
      query: ({ rideId }) => ({
        url: `/ride/cancel/${rideId}`,
        method: "PATCH",
        data: { rideStatus: "CANCELLED" as RideStatus },
      }),
      invalidatesTags: ["RIDE"],
    }),

    getActiveRideRider: builder.query<IRide | null, void>({
      query: () => ({
        url: "/ride/rideHistory",
        method: "GET",
      }),
      providesTags: ["RIDE"],
      transformResponse: (response: IResponse<IRide[]>) => {
        const active = (response.data || []).find((r) =>
          ["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"].includes(
            r.status
          )
        );
        return active ?? null;
      },
    }),
  }),
});

export const {
  useRideRequestMutation,
  useGetAllRideRiderQuery,
  useLazyGetSingleRideRiderQuery,
  useUpdateRideStatusMutation,
  useCancelRideMutation,
  useGetActiveRideRiderQuery,
} = rideApi;
