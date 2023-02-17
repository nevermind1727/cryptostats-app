import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coinbaseApi = createApi({
  reducerPath: "coinbaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3001/coinbase/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getPrimaryAccountTransactions: builder.query<any, undefined>({
      query: () => ({
        url: "/",
      }),
    }),
  }),
});

export const { useGetPrimaryAccountTransactionsQuery } = coinbaseApi;
