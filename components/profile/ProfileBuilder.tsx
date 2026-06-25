"use client";

import * as React from "react";
import {
  Award,
  Briefcase,
  GraduationCap,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type {
  CareerHistoryItem,
  EducationItem,
  LicenceItem,
  Profile,
  WorkType,
} from "@/lib/types";
import { WORK_TYPES, CLASSIFICATIONS } from "@/lib/constants/taxonomy";
import { computeProfileStrength } from "@/lib/utils/profile";
import { formatAud } from "@/lib/utils/format";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ProfileBuilder({ initial }: { initial: Profile }) {
  const [profile, setProfile] = React.useState(initial);
  const { toast } = useToast();
  const strength = computeProfileStrength(profile);

  const persist = React.useCallback(
    async (next: Profile, message = "Profile updated") => {
      setProfile(next);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      toast({ title: message, variant: "success" });
    },
    [toast],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <PersonalSection profile={profile} onSave={persist} />
        <CareerHistorySection profile={profile} onSave={persist} />
        <EducationSection profile={profile} onSave={persist} />
        <SkillsSection profile={profile} onSave={persist} />
        <LicencesSection profile={profile} onSave={persist} />
        <PreferencesSection profile={profile} onSave={persist} />
      </div>

      <aside>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Profile strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-seek-navy">{strength.label}</span>
                <span className="text-sm font-semibold text-seek-pink">{strength.score}%</span>
              </div>
              <Progress value={strength.score} className="mt-2" />
            </div>
            <p className="text-sm text-ink-secondary">
              A complete profile helps hirers find you and speeds up your applications.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------ personal */
function PersonalSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(profile.personal);

  React.useEffect(() => {
    if (open) setForm(profile.personal);
  }, [open, profile.personal]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-seek-pink" /> Personal details
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-seek-navy">
          {profile.personal.firstName} {profile.personal.lastName}
        </p>
        <p className="text-sm font-medium text-seek-pink">{profile.personal.headline}</p>
        <p className="mt-1 text-sm text-ink-secondary">
          {profile.personal.email} &middot; {profile.personal.phone} &middot;{" "}
          {profile.personal.location}
        </p>
        <p className="mt-3 text-sm text-ink-secondary">{profile.personal.summary}</p>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit personal details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </Field>
              <Field label="Last name">
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Headline">
              <Input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>
            <Field label="Career summary">
              <Textarea
                rows={4}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onSave({ ...profile, personal: form });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------- career history */
function CareerHistorySection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const empty: CareerHistoryItem = {
    id: "",
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "Present",
    description: "",
  };
  const [form, setForm] = React.useState(empty);

  function add() {
    const item = { ...form, id: genId("ch") };
    void onSave({ ...profile, careerHistory: [item, ...profile.careerHistory] });
    setOpen(false);
    setForm(empty);
  }

  function remove(id: string) {
    void onSave({
      ...profile,
      careerHistory: profile.careerHistory.filter((c) => c.id !== id),
    });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-seek-pink" /> Career history
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.careerHistory.length === 0 ? (
          <p className="text-sm text-ink-muted">Add your work experience.</p>
        ) : (
          profile.careerHistory.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-3 border-l-2 border-line pl-4">
              <div>
                <p className="font-semibold text-seek-navy">{c.title}</p>
                <p className="text-sm text-ink-secondary">
                  {c.company} &middot; {c.location}
                </p>
                <p className="text-xs text-ink-muted">
                  {c.startDate} – {c.endDate}
                </p>
                <p className="mt-1 text-sm text-ink-secondary">{c.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(c.id)}
                aria-label="Remove role"
                className="text-ink-muted hover:text-tone-critical"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Job title">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company">
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </Field>
              <Field label="Location">
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <Input
                  placeholder="e.g. Mar 2021"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End date">
                <Input
                  placeholder="Present"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!form.title || !form.company}>
              Add role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ----------------------------------------------------------- education */
function EducationSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const empty: EducationItem = { id: "", qualification: "", institution: "", completed: "" };
  const [form, setForm] = React.useState(empty);

  function add() {
    void onSave({
      ...profile,
      education: [{ ...form, id: genId("ed") }, ...profile.education],
    });
    setOpen(false);
    setForm(empty);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-seek-pink" /> Education
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {profile.education.length === 0 ? (
          <p className="text-sm text-ink-muted">Add your qualifications.</p>
        ) : (
          profile.education.map((e) => (
            <div key={e.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-seek-navy">{e.qualification}</p>
                <p className="text-sm text-ink-secondary">
                  {e.institution} &middot; {e.completed}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onSave({ ...profile, education: profile.education.filter((x) => x.id !== e.id) })
                }
                aria-label="Remove qualification"
                className="text-ink-muted hover:text-tone-critical"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add education</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Qualification">
              <Input
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              />
            </Field>
            <Field label="Institution">
              <Input
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
              />
            </Field>
            <Field label="Year completed">
              <Input
                value={form.completed}
                onChange={(e) => setForm({ ...form, completed: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!form.qualification}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* -------------------------------------------------------------- skills */
function SkillsSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [value, setValue] = React.useState("");

  function add() {
    const skill = value.trim();
    if (!skill || profile.skills.includes(skill)) return;
    void onSave({ ...profile, skills: [...profile.skills, skill] });
    setValue("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-seek-pink" /> Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-seek-pink-light px-3 py-1 text-sm font-medium text-seek-pink-dark"
            >
              {skill}
              <button
                type="button"
                onClick={() =>
                  onSave({ ...profile, skills: profile.skills.filter((s) => s !== skill) })
                }
                aria-label={`Remove ${skill}`}
                className="rounded-full hover:bg-seek-pink/20"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Add a skill and press Enter"
          />
          <Button variant="secondary" onClick={add}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------ licences */
function LicencesSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const empty: LicenceItem = { id: "", name: "", detail: "" };
  const [form, setForm] = React.useState(empty);

  function add() {
    void onSave({ ...profile, licences: [{ ...form, id: genId("lic") }, ...profile.licences] });
    setOpen(false);
    setForm(empty);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-seek-pink" /> Licences & credentials
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {profile.licences.length === 0 ? (
          <p className="text-sm text-ink-muted">Add any licences or credentials.</p>
        ) : (
          profile.licences.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-seek-navy">{l.name}</p>
                <p className="text-xs text-ink-muted">{l.detail}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onSave({ ...profile, licences: profile.licences.filter((x) => x.id !== l.id) })
                }
                aria-label="Remove licence"
                className="text-ink-muted hover:text-tone-critical"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add licence or credential</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Detail">
              <Input
                placeholder="e.g. Verified, Expires 2027"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!form.name}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* --------------------------------------------------------- preferences */
function PreferencesSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (next: Profile) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(profile.preferences);

  React.useEffect(() => {
    if (open) setForm(profile.preferences);
  }, [open, profile.preferences]);

  function toggleWorkType(wt: WorkType) {
    setForm((f) => ({
      ...f,
      workTypes: f.workTypes.includes(wt)
        ? f.workTypes.filter((x) => x !== wt)
        : [...f.workTypes, wt],
    }));
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Role preferences</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-ink-secondary">
        <p>
          <span className="font-medium text-seek-navy">Work types:</span>{" "}
          {profile.preferences.workTypes.join(", ") || "—"}
        </p>
        <p>
          <span className="font-medium text-seek-navy">Locations:</span>{" "}
          {profile.preferences.locations.join(", ") || "—"}
        </p>
        <p>
          <span className="font-medium text-seek-navy">Salary expectation:</span>{" "}
          {formatAud(profile.preferences.salaryExpectation)}
        </p>
        <p>
          <span className="font-medium text-seek-navy">Classification:</span>{" "}
          {profile.preferences.classification}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Badge tone={profile.preferences.openToWork ? "positive" : "neutral"}>
            {profile.preferences.openToWork ? "Open to work" : "Not currently looking"}
          </Badge>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit role preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Work types</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {WORK_TYPES.map((wt) => (
                  <label key={wt} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.workTypes.includes(wt)}
                      onCheckedChange={() => toggleWorkType(wt)}
                    />
                    {wt}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Preferred locations (comma separated)">
              <Input
                value={form.locations.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    locations: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Salary expectation (AUD / year)">
              <Input
                type="number"
                value={form.salaryExpectation}
                onChange={(e) =>
                  setForm({ ...form, salaryExpectation: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <div>
              <Label>Preferred classification</Label>
              <Select
                value={form.classification}
                onValueChange={(v) => setForm({ ...form, classification: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSIFICATIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center justify-between rounded-md border border-line p-3">
              <span className="text-sm font-medium text-seek-navy">Open to work</span>
              <Switch
                checked={form.openToWork}
                onCheckedChange={(v) => setForm({ ...form, openToWork: v })}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onSave({ ...profile, preferences: form });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* -------------------------------------------------------------- shared */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
