import { baseApi } from "./base-api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Payroll {
  id: string;
  userId: string;
  amount: number;
  status: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getPayrolls: builder.query<Payroll[], void>({
      query: () => "/payrolls",
      providesTags: ["Payrolls"],
    }),
  }),
});

export const { useGetUsersQuery, useGetPayrollsQuery } = userApi;
