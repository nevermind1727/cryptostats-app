import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginUserParams, UserResponse } from "../utils/types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3001/auth/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<UserResponse, LoginUserParams>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
