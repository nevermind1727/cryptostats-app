import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateUserParams, UserResponse } from "../utils/types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3001/users/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<UserResponse, CreateUserParams>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<UserResponse, undefined>({
      query: () => ({ url: "/" }),
    }),
  }),
});

export const { useCreateUserMutation, useGetUserQuery } = usersApi;
