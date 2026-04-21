import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "/api",
    prepareHeaders: (headers) => {
      //   const token = (getState() as any).auth.accessToken;
      //   if (token) {
      //     headers.set("authorization", `Bearer ${token}`);
      //   }
      return headers;
    },
  }),
  tagTypes: ["User", "Payrolls", "Employee"],
  endpoints: () => ({}),
});
