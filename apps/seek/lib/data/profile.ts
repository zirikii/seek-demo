import type { Profile } from "@/lib/types";
import { readData, writeData } from "./store";

export async function getProfile(): Promise<Profile> {
  return readData<Profile>("profile");
}

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const next: Profile = { ...current, ...patch };
  await writeData("profile", next);
  return next;
}
