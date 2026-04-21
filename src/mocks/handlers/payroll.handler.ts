import { http, HttpResponse } from "msw";
import { payrolls } from "../data/pay-roll";

export const payrollHandlers = [
  http.get("/api/payrolls", () => {
    return HttpResponse.json(payrolls);
  }),
];
