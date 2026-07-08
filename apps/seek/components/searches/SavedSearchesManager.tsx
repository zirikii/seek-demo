"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Plus, Trash2 } from "lucide-react";
import type { AlertFrequency, SavedSearch } from "@/lib/types";
import { ALERT_FREQUENCIES } from "@/lib/constants/taxonomy";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function filterSummary(search: SavedSearch): string[] {
  const out: string[] = [];
  if (search.filters.classification) out.push(search.filters.classification);
  if (search.filters.workType) out.push(search.filters.workType);
  if (search.filters.salaryMin) out.push(`$${(search.filters.salaryMin / 1000).toFixed(0)}k+`);
  return out;
}

export function SavedSearchesManager({ initial }: { initial: SavedSearch[] }) {
  const [searches, setSearches] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const [keywords, setKeywords] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [frequency, setFrequency] = React.useState<AlertFrequency>("daily");
  const { toast } = useToast();

  async function updateFrequency(id: string, freq: AlertFrequency) {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, frequency: freq } : s)));
    await fetch("/api/searches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, frequency: freq }),
    });
    toast({ title: "Alert updated", description: `Frequency set to ${freq}.`, variant: "success" });
  }

  async function remove(id: string) {
    setSearches((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/searches?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    toast({ title: "Saved search deleted" });
  }

  async function create() {
    const res = await fetch("/api/searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, location: location || "All Australia", frequency }),
    });
    const data = await res.json();
    if (data.search) {
      setSearches((prev) => [data.search, ...prev]);
      toast({ title: "Job alert created", variant: "success" });
    }
    setOpen(false);
    setKeywords("");
    setLocation("");
    setFrequency("daily");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Create job alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a job alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="alert-keywords">Keywords</Label>
                <Input
                  id="alert-keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alert-location">Location</Label>
                <Input
                  id="alert-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sydney NSW"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Alert frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as AlertFrequency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALERT_FREQUENCIES.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={create}>Create alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {searches.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-seek-pink" />
                  <p className="font-semibold text-seek-navy">{s.keywords || "All jobs"}</p>
                  {s.newResults > 0 ? (
                    <Badge tone="brand">{s.newResults} new</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-ink-secondary">{s.location}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {filterSummary(s).map((f) => (
                    <Badge key={f} tone="neutral">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-[130px]">
                  <Select
                    value={s.frequency}
                    onValueChange={(v) => updateFrequency(s.id, v as AlertFrequency)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_FREQUENCIES.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/jobs?keywords=${encodeURIComponent(s.keywords)}&location=${encodeURIComponent(s.location)}`}
                  >
                    View results
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(s.id)}
                  aria-label="Delete saved search"
                  className="text-ink-muted hover:text-tone-critical"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
