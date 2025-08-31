// redux/features/auth/auth.api.ts
import { baseApi } from "@/redux/baseApi";
import type {
  IChangePassword,
  ILogin,
  IRegister,
  IResponse,
  IResponseWithMeta,
  ISetPassword,
  IUser,
} from "@/types";

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

    getAllUsers: builder.query<
      { data: IUser[]; meta: { page: number; limit: number; total: number } },
      {
        search?: string;
        searchTerm?: string;
        role?: string;
        isActive?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params,
      }),
      transformResponse: (response: IResponseWithMeta<IUser[]>) => {
        return { data: response.data, meta: response.meta };
      },
      providesTags: ["USER"],
    }),

    // getAllUsers: builder.query<
    //   { data: IUser[]; meta: { page: number; limit: number; total: number } },
    //   {
    //     search?: string;
    //     role?: string;
    //     isActive?: string;
    //     sortBy?: string;
    //     sortOrder?: "asc" | "desc";
    //     page?: number;
    //     limit?: number;
    //   }
    // >({
    //   query: (params) => ({
    //     url: "/user/all-users",
    //     method: "GET",
    //     params, // axiosBaseQuery will send these as querystring
    //   }),
    //   transformResponse: (response: IResponseWithMeta<IUser[]>) => {
    //     return { data: response.data, meta: response.meta };
    //   },
    //   providesTags: ["USER"],
    // }),

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

    resetPassword: builder.mutation<IResponse<unknown>, IChangePassword>({
      query: (userInfo) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<IResponse<unknown>, IChangePassword>({
      query: (userInfo) => ({
        url: "/auth/change-password",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    setPassword: builder.mutation<IResponse<unknown>, ISetPassword>({
      query: (userInfo) => ({
        url: "/auth/set-password", // google login user later can set his password with this api
        method: "POST",
        data: userInfo,
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
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useSetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
