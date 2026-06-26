export interface User {
  id: string;
  email: string;
  name: string;
  /**
   * Demo-only password store. This is a throwaway local demo with no real auth;
   * in demo mode ANY credentials are accepted, so this is purely illustrative.
   */
  password: string;
  createdAt: string;
}

/** Shape stored in the signed session cookie. */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
}
