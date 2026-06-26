// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { decodeSession, encodeSession } from "../session";

beforeAll(() => {
  process.env.DEMO_AUTH_SECRET = "test-secret-for-vitest";
});

describe("session encode/decode", () => {
  it("round-trips a valid session", async () => {
    const user = { id: "user_1", email: "candidate@example.com", name: "Alex Taylor" };
    const token = await encodeSession(user);
    expect(typeof token).toBe("string");

    const decoded = await decodeSession(token);
    expect(decoded).toEqual(user);
  });

  it("returns null for a missing token", async () => {
    expect(await decodeSession(undefined)).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const token = await encodeSession({ id: "1", email: "a@b.com", name: "A" });
    const tampered = `${token}tamper`;
    expect(await decodeSession(tampered)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await encodeSession({ id: "1", email: "a@b.com", name: "A" });
    process.env.DEMO_AUTH_SECRET = "a-completely-different-secret";
    const decoded = await decodeSession(token);
    process.env.DEMO_AUTH_SECRET = "test-secret-for-vitest";
    expect(decoded).toBeNull();
  });
});
