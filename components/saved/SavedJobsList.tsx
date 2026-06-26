"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MapPin, Trash2, Wallet } from "lucide-react";
import type { JobWithEmployer } from "@/lib/types";
import { formatLocation, formatPostedAt, formatSalary } from "@/lib/utils/format";
import { useAppData } from "@/components/providers/AppDataProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmployerLogo } from "@/components/common/EmployerLogo";
import { QuickApplyDrawer } from "@/components/jobs/QuickApplyDrawer";

export interface SavedJobView {
  job: JobWithEmployer;
  savedAt: string;
  note: string;
}

function SavedJobItem({ item, onRemove }: { item: SavedJobView; onRemove: (id: string) => void }) {
  const { job } = item;
  const { toggleSave, isApplied } = useAppData();
  const { toast } = useToast();
  const [note, setNote] = React.useState(item.note);
  const [savingNote, setSavingNote] = React.useState(false);
  const [applyOpen, setApplyOpen] = React.useState(false);
  const applied = isApplied(job.id);

  async function saveNote() {
    setSavingNote(true);
    await fetch("/api/saved", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id, note }),
    });
    setSavingNote(false);
    toast({ title: "Note saved", variant: "success" });
  }

  async function remove() {
    await toggleSave(job.id, job.title); // currently saved -> removes
    onRemove(job.id);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <EmployerLogo src={job.employer.logo} name={job.employer.name} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-lg font-semibold text-seek-navy hover:text-seek-pink"
                >
                  {job.title}
                </Link>
                <p className="text-sm text-ink-secondary">{job.employer.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={remove}
                aria-label={`Remove ${job.title} from saved`}
                className="text-ink-muted hover:text-tone-critical"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ink-muted" />
                {formatLocation(job.location)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-ink-muted" />
                {formatSalary(job.salary)}
              </span>
              <Badge tone="neutral">{job.workType}</Badge>
            </div>

            <p className="mt-1 text-xs text-ink-muted">{formatPostedAt(job.postedAt)}</p>

            <div className="mt-4">
              <label
                htmlFor={`note-${job.id}`}
                className="text-sm font-medium text-seek-navy"
              >
                Private note
              </label>
              <Textarea
                id={`note-${job.id}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note (only visible to you)…"
                rows={2}
                className="mt-1.5"
              />
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={saveNote} disabled={savingNote}>
                  {savingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save note
                </Button>
                <Button size="sm" onClick={() => setApplyOpen(true)} disabled={applied}>
                  {applied ? "Applied" : "Start application"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <QuickApplyDrawer job={job} open={applyOpen} onOpenChange={setApplyOpen} />
      </CardContent>
    </Card>
  );
}

export function SavedJobsList({ initial }: { initial: SavedJobView[] }) {
  const [items, setItems] = React.useState(initial);

  function onRemove(jobId: string) {
    setItems((prev) => prev.filter((i) => i.job.id !== jobId));
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <SavedJobItem key={item.job.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}
