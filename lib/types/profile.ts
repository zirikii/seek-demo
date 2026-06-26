import type { WorkType } from "./common";

export interface CareerHistoryItem {
  id: string;
  title: string;
  company: string;
  location: string;
  /** "Mar 2021" style label. */
  startDate: string;
  /** "Present" or "Jun 2024" style label. */
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  /** Completion year, e.g. "2018". */
  completed: string;
}

export interface LicenceItem {
  id: string;
  name: string;
  /** "Verified" | "Expires 2027" style label. */
  detail: string;
}

export interface RolePreferences {
  workTypes: WorkType[];
  locations: string[];
  /** Annual salary expectation in AUD. */
  salaryExpectation: number;
  classification: string;
  /** Whether the profile is visible to recruiters. */
  openToWork: boolean;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
}

export interface Profile {
  userId: string;
  personal: PersonalDetails;
  careerHistory: CareerHistoryItem[];
  education: EducationItem[];
  skills: string[];
  licences: LicenceItem[];
  preferences: RolePreferences;
}

export interface NotificationSettings {
  jobRecommendations: boolean;
  savedSearchAlerts: boolean;
  applicationUpdates: boolean;
  marketInsights: boolean;
  productNews: boolean;
}

export interface PrivacySettings {
  /** Profile is discoverable/visible to recruiters. */
  visibleToRecruiters: boolean;
  /** Hide profile from the candidate's current employer. */
  hideFromCurrentEmployer: boolean;
}

export interface Settings {
  userId: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}
