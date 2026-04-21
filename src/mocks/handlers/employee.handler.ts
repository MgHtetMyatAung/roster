import { http, HttpResponse } from "msw";
import { employees } from "../data/employees";

export const employeeHandlers = [
  http.get("/api/employees", () => {
    return HttpResponse.json(employees);
  }),
];
