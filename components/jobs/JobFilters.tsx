"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { WorkType } from "@/lib/types";
import {
  CLASSIFICATIONS,
  DATE_LISTED_OPTIONS,
  SALARY_RANGES,
  WORK_TYPES,
} from "@/lib/constants/taxonomy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ALL = "__all__";

export function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const classification = params.get("classification") ?? "";
  const workType = params.get("workType") ?? "";
  const salaryMin = params.get("salaryMin") ?? "";
  const dateListed = params.get("dateListed") ?? "any";

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === ALL || value === "any" || value === "0") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`/jobs?${next.toString()}`);
  }

  function clearAll() {
    const next = new URLSearchParams();
    const k = params.get("keywords");
    const l = params.get("location");
    if (k) next.set("keywords", k);
    if (l) next.set("location", l);
    router.push(`/jobs${next.toString() ? `?${next.toString()}` : ""}`);
  }

  const hasFilters = Boolean(classification || workType || salaryMin || (dateListed && dateListed !== "any"));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={classification || ALL} onValueChange={(v) => update("classification", v)}>
        <SelectTrigger className="h-10 w-auto min-w-[180px]">
          <SelectValue placeholder="Classification" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All classifications</SelectItem>
          {CLASSIFICATIONS.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={workType || ALL} onValueChange={(v) => update("workType", v)}>
        <SelectTrigger className="h-10 w-auto min-w-[150px]">
          <SelectValue placeholder="Work type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All work types</SelectItem>
          {WORK_TYPES.map((w: WorkType) => (
            <SelectItem key={w} value={w}>
              {w}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={salaryMin || "0"} onValueChange={(v) => update("salaryMin", v)}>
        <SelectTrigger className="h-10 w-auto min-w-[140px]">
          <SelectValue placeholder="Salary" />
        </SelectTrigger>
        <SelectContent>
          {SALARY_RANGES.map((s) => (
            <SelectItem key={s.min} value={String(s.min)}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={dateListed} onValueChange={(v) => update("dateListed", v)}>
        <SelectTrigger className="h-10 w-auto min-w-[140px]">
          <SelectValue placeholder="Date listed" />
        </SelectTrigger>
        <SelectContent>
          {DATE_LISTED_OPTIONS.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="h-4 w-4" /> Clear filters
        </Button>
      ) : null}
    </div>
  );
}
