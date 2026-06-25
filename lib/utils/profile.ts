import type { Profile } from "@/lib/types";

export interface ProfileStrength {
  score: number; // 0-100
  label: string;
  completed: { key: string; label: string; done: boolean }[];
}

/** Compute a SEEK-style profile-strength score from completed sections. */
export function computeProfileStrength(profile: Profile): ProfileStrength {
  const checks: { key: string; label: string; done: boolean }[] = [
    {
      key: "personal",
      label: "Personal details",
      done: Boolean(profile.personal.firstName && profile.personal.lastName && profile.personal.email),
    },
    {
      key: "headline",
      label: "Professional headline",
      done: Boolean(profile.personal.headline),
    },
    {
      key: "summary",
      label: "Career summary",
      done: profile.personal.summary.trim().length > 40,
    },
    {
      key: "history",
      label: "Career history",
      done: profile.careerHistory.length > 0,
    },
    {
      key: "education",
      label: "Education",
      done: profile.education.length > 0,
    },
    {
      key: "skills",
      label: "Skills (3+)",
      done: profile.skills.length >= 3,
    },
    {
      key: "licences",
      label: "Licences & credentials",
      done: profile.licences.length > 0,
    },
    {
      key: "preferences",
      label: "Role preferences",
      done: profile.preferences.workTypes.length > 0 && profile.preferences.locations.length > 0,
    },
  ];

  const doneCount = checks.filter((c) => c.done).length;
  const score = Math.round((doneCount / checks.length) * 100);

  let label = "Getting started";
  if (score >= 100) label = "All star";
  else if (score >= 75) label = "Strong";
  else if (score >= 50) label = "Good progress";
  else if (score >= 25) label = "Basic";

  return { score, label, completed: checks };
}
