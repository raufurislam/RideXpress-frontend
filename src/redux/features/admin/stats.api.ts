import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

type AnyObject = Record<string, unknown>;

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/dashboard", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
    getRideStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/rides", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
    getUserStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/users", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
    getDriverStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/drivers", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
    getRevenueStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/revenue", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
    getPublicStats: builder.query<AnyObject, void>({
      query: () => ({ url: "/stats/public", method: "GET" }),
      transformResponse: (res: IResponse<AnyObject>) => res.data,
      providesTags: ["STATS"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRideStatsQuery,
  useGetUserStatsQuery,
  useGetDriverStatsQuery,
  useGetRevenueStatsQuery,
  useGetPublicStatsQuery,
} = statsApi;
