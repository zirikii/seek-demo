import { SESSION_COOKIE } from "@/lib/constants";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
