import type { AlertFrequency, SavedSearch, SearchFilters } from "@/lib/types";
import { createId, readData, writeData } from "./store";

export async function getSavedSearches(): Promise<SavedSearch[]> {
  return readData<SavedSearch[]>("searches");
}

export interface CreateSavedSearchInput {
  keywords: string;
  location: string;
  filters?: SearchFilters;
  frequency?: AlertFrequency;
}

export async function addSavedSearch(input: CreateSavedSearchInput): Promise<SavedSearch> {
  const searches = await getSavedSearches();
  const search: SavedSearch = {
    id: createId("search"),
    keywords: input.keywords,
    location: input.location,
    filters: input.filters ?? {},
    frequency: input.frequency ?? "daily",
    createdAt: new Date().toISOString(),
    newResults: 0,
  };
  await writeData("searches", [search, ...searches]);
  return search;
}

export async function updateSavedSearch(
  id: string,
  patch: Partial<Pick<SavedSearch, "keywords" | "location" | "filters" | "frequency">>,
): Promise<SavedSearch[]> {
  const searches = await getSavedSearches();
  const next = searches.map((s) => (s.id === id ? { ...s, ...patch } : s));
  await writeData("searches", next);
  return next;
}

export async function removeSavedSearch(id: string): Promise<SavedSearch[]> {
  const searches = await getSavedSearches();
  const next = searches.filter((s) => s.id !== id);
  await writeData("searches", next);
  return next;
}
