"use client";

import * as React from "react";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import type { JobWithEmployer } from "@/lib/types";
import { useAppData } from "@/components/providers/AppDataProvider";
import { formatLocation, formatSalary } from "@/lib/utils/format";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmployerLogo } from "@/components/common/EmployerLogo";

interface QuickApplyDrawerProps {
  job: JobWithEmployer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickApplyDrawer({ job, open, onOpenChange }: QuickApplyDrawerProps) {
  const { apply, isApplied } = useAppData();
  const [coverNote, setCoverNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const alreadyApplied = isApplied(job.id);

  async function onSubmit() {
    setSubmitting(true);
    await apply(job.id, { coverNote });
    setSubmitting(false);
    setDone(true);
  }

  // Reset transient state when the drawer is re-opened for a job.
  React.useEffect(() => {
    if (open) {
      setDone(false);
      setCoverNote("");
    }
  }, [open, job.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Quick apply</SheetTitle>
          <SheetDescription>
            Apply with your saved SEEK profile and resume. (Demo — no real application is sent.)
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {done || alreadyApplied ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-14 w-14 text-tone-positive" />
              <h3 className="mt-4 text-lg font-semibold text-seek-navy">Application submitted</h3>
              <p className="mt-1 max-w-sm text-sm text-ink-secondary">
                Your application for <strong>{job.title}</strong> at {job.employer.name} has been
                recorded. Track it under Applied jobs.
              </p>
            </div>
          ) : (
            <div className="space-y-5 py-2">
              <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-subtle p-4">
                <EmployerLogo src={job.employer.logo} name={job.employer.name} size={48} />
                <div className="min-w-0">
                  <p className="font-semibold text-seek-navy">{job.title}</p>
                  <p className="text-sm text-ink-secondary">{job.employer.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {formatLocation(job.location)} &middot; {formatSalary(job.salary)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-line p-4">
                <p className="text-sm font-medium text-seek-navy">Resume</p>
                <div className="mt-2 flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2.5 text-sm">
                  <FileText className="h-4 w-4 text-seek-pink" />
                  <span className="text-ink">My_SEEK_Profile.pdf</span>
                  <span className="ml-auto text-xs text-ink-muted">Default</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coverNote">
                  Note to the hirer <span className="text-ink-muted">(optional)</span>
                </Label>
                <Textarea
                  id="coverNote"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Add a short message about why you're a great fit…"
                  rows={5}
                />
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          {done || alreadyApplied ? (
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Done
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit application
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
