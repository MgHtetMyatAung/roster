import { baseApi } from "./base-api";
import type { EmployeeType } from "@/features/employee/type";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeType[], void>({
      query: () => "/employees",
      providesTags: ["Employee"],
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;
