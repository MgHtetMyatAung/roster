import { baseApi } from "./base-api";
import type { EmployeeType } from "@/features/employee/type";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeType[], void>({
      query: () => "/employees",
      providesTags: ["Employee"],
    }),
    createEmployee: builder.mutation<EmployeeType, Partial<EmployeeType>>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const { useGetEmployeesQuery, useCreateEmployeeMutation } = employeeApi;
