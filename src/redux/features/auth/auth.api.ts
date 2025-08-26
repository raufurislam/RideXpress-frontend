// auth.api.ts
import { baseApi } from "@/redux/baseApi";
import type { ILogin, IRegister, IResponse, IUser } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IUser>, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    login: builder.mutation<IResponse<IUser>, ILogin>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),

    userInfo: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUser: builder.mutation<
      IResponse<IUser>,
      { userId: string; payload: Partial<IUser> }
    >({
      query: ({ userId, payload }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useLazyUserInfoQuery,
  useUpdateUserMutation,
} = authApi;
