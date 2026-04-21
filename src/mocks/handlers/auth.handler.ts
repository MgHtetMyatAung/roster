import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    if (body.email === "admin@mail.com" && body.password === "123456") {
      return HttpResponse.json({
        accessToken: "fake.access.token",
        refreshToken: "fake.refresh.token",
        user: { id: 1, role: "admin", name: "Admin User" },
      });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),
];
