import { http, HttpResponse } from "msw";
import { employees } from "../data/employees";

export const employeeHandlers = [
  http.get("/api/employees", () => {
    return HttpResponse.json(employees);
  }),
  http.post("/api/employees", async ({ request }) => {
    const newEmployee = (await request.json()) as any;
    return HttpResponse.json(
      { ...newEmployee, id: Math.random().toString(36).substr(2, 9) },
      { status: 201 }
    );
  }),
];
