"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { NotificationSettings, PrivacySettings, Settings } from "@/lib/types";
import type { SessionUser } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const notificationLabels: { key: keyof NotificationSettings; label: string; desc: string }[] = [
  {
    key: "jobRecommendations",
    label: "Job recommendations",
    desc: "Personalised roles based on your profile and activity.",
  },
  {
    key: "savedSearchAlerts",
    label: "Saved search alerts",
    desc: "New jobs matching your saved searches.",
  },
  {
    key: "applicationUpdates",
    label: "Application updates",
    desc: "Status changes on jobs you've applied for.",
  },
  {
    key: "marketInsights",
    label: "Market insights",
    desc: "Salary trends and hiring activity in your field.",
  },
  { key: "productNews", label: "Product news", desc: "Occasional updates about new features." },
];

const privacyLabels: { key: keyof PrivacySettings; label: string; desc: string }[] = [
  {
    key: "visibleToRecruiters",
    label: "Visible to recruiters",
    desc: "Allow verified hirers to discover your profile in search.",
  },
  {
    key: "hideFromCurrentEmployer",
    label: "Hide from current employer",
    desc: "Prevent your listed current employer from seeing your profile.",
  },
];

export function SettingsPanel({
  initial,
  user,
}: {
  initial: Settings;
  user: SessionUser;
}) {
  const [settings, setSettings] = React.useState(initial);
  const router = useRouter();
  const { toast } = useToast();

  async function persist(next: Settings, message: string) {
    setSettings(next);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    toast({ title: message, variant: "success" });
  }

  function toggleNotification(key: keyof NotificationSettings, value: boolean) {
    void persist(
      { ...settings, notifications: { ...settings.notifications, [key]: value } },
      "Notification preferences saved",
    );
  }

  function togglePrivacy(key: keyof PrivacySettings, value: boolean) {
    void persist(
      { ...settings, privacy: { ...settings.privacy, [key]: value } },
      "Privacy settings saved",
    );
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your sign-in details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="acct-email">Email</Label>
              <Input id="acct-email" defaultValue={user.email} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acct-password">Password</Label>
              <Input id="acct-password" type="password" defaultValue="demo-password" readOnly />
            </div>
          </div>
          <p className="text-xs text-ink-muted">
            Demo mode — account details are read-only and not used for real authentication.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email preferences & notifications</CardTitle>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-line">
          {notificationLabels.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-seek-navy">{n.label}</p>
                <p className="text-sm text-ink-secondary">{n.desc}</p>
              </div>
              <Switch
                checked={settings.notifications[n.key]}
                onCheckedChange={(v) => toggleNotification(n.key, v)}
                aria-label={n.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & visibility</CardTitle>
          <CardDescription>Control who can see your profile.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-line">
          {privacyLabels.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-seek-navy">{p.label}</p>
                <p className="text-sm text-ink-secondary">{p.desc}</p>
              </div>
              <Switch
                checked={settings.privacy[p.key]}
                onCheckedChange={(v) => togglePrivacy(p.key, v)}
                aria-label={p.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>Sign out of this demo session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button variant="secondary" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
