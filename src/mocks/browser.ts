import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handler";
import { userHandlers } from "./handlers/user.handler";
import { payrollHandlers } from "./handlers/payroll.handler";
import { employeeHandlers } from "./handlers/employee.handler";

export const worker = setupWorker(
  ...authHandlers,
  ...userHandlers,
  ...payrollHandlers,
  ...employeeHandlers,
);
