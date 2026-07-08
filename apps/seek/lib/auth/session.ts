import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "@/lib/types";

const ISSUER = "seek-demo";
const AUDIENCE = "seek-demo-candidate";

function getSecretKey(): Uint8Array {
  const secret = process.env.DEMO_AUTH_SECRET ?? "change-me";
  return new TextEncoder().encode(secret);
}

/**
 * Encode a session payload into a signed JWT (HS256).
 * This is mock auth for a local demo — do not use for real authentication.
 */
export async function encodeSession(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/** Verify + decode a session token. Returns null when invalid/expired. */
export async function decodeSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { id: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
