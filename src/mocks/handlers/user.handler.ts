import { http, HttpResponse } from "msw";
import { users } from "../data/users";

export const userHandlers = [
  http.get("/api/users", () => {
    return HttpResponse.json(users);
  }),
];
