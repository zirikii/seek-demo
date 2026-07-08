"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";

interface AppDataContextValue {
  savedIds: Set<string>;
  appliedIds: Set<string>;
  isSaved: (jobId: string) => boolean;
  isApplied: (jobId: string) => boolean;
  toggleSave: (jobId: string, jobTitle?: string) => Promise<void>;
  apply: (jobId: string, payload?: { coverNote?: string; resumeName?: string }) => Promise<void>;
  savedCount: number;
  appliedCount: number;
}

const AppDataContext = React.createContext<AppDataContextValue | null>(null);

export function AppDataProvider({
  initialSavedIds,
  initialAppliedIds,
  children,
}: {
  initialSavedIds: string[];
  initialAppliedIds: string[];
  children: React.ReactNode;
}) {
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set(initialSavedIds));
  const [appliedIds, setAppliedIds] = React.useState<Set<string>>(new Set(initialAppliedIds));
  const { toast } = useToast();

  const isSaved = React.useCallback((jobId: string) => savedIds.has(jobId), [savedIds]);
  const isApplied = React.useCallback((jobId: string) => appliedIds.has(jobId), [appliedIds]);

  const toggleSave = React.useCallback(
    async (jobId: string, jobTitle?: string) => {
      const currentlySaved = savedIds.has(jobId);
      // Optimistic update.
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.delete(jobId);
        else next.add(jobId);
        return next;
      });

      try {
        if (currentlySaved) {
          await fetch(`/api/saved?jobId=${encodeURIComponent(jobId)}`, { method: "DELETE" });
          toast({ title: "Removed from saved", description: jobTitle });
        } else {
          await fetch("/api/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId }),
          });
          toast({ title: "Job saved", description: jobTitle, variant: "success" });
        }
      } catch {
        // Roll back on failure.
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (currentlySaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
        toast({ title: "Something went wrong", variant: "destructive" });
      }
    },
    [savedIds, toast],
  );

  const apply = React.useCallback(
    async (jobId: string, payload?: { coverNote?: string; resumeName?: string }) => {
      setAppliedIds((prev) => new Set(prev).add(jobId));
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
      try {
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, ...payload }),
        });
        toast({ title: "Application submitted", variant: "success" });
      } catch {
        toast({ title: "Could not submit application", variant: "destructive" });
      }
    },
    [toast],
  );

  const value = React.useMemo<AppDataContextValue>(
    () => ({
      savedIds,
      appliedIds,
      isSaved,
      isApplied,
      toggleSave,
      apply,
      savedCount: savedIds.size,
      appliedCount: appliedIds.size,
    }),
    [savedIds, appliedIds, isSaved, isApplied, toggleSave, apply],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = React.useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return ctx;
}
