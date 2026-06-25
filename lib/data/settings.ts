import type { Settings } from "@/lib/types";
import { readData, writeData } from "./store";

export async function getSettings(): Promise<Settings> {
  return readData<Settings>("settings");
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = {
    ...current,
    ...patch,
    notifications: { ...current.notifications, ...patch.notifications },
    privacy: { ...current.privacy, ...patch.privacy },
  };
  await writeData("settings", next);
  return next;
}
