import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  redirect: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  redirect: z.string().optional(),
});

export const saveJobSchema = z.object({
  jobId: z.string().min(1),
});

export const saveNoteSchema = z.object({
  jobId: z.string().min(1),
  note: z.string().max(2000),
});

export const applySchema = z.object({
  jobId: z.string().min(1),
  resumeName: z.string().optional(),
  coverNote: z.string().max(4000).optional(),
});

const workType = z.enum(["Full time", "Part time", "Contract/Temp", "Casual/Vacation"]);
const frequency = z.enum(["off", "daily", "weekly"]);

export const createSearchSchema = z.object({
  keywords: z.string().default(""),
  location: z.string().default("All Australia"),
  filters: z
    .object({
      classification: z.string().optional(),
      workType: workType.optional(),
      salaryMin: z.number().optional(),
      dateListed: z.string().optional(),
    })
    .optional(),
  frequency: frequency.optional(),
});

export const updateSearchSchema = z.object({
  id: z.string().min(1),
  keywords: z.string().optional(),
  location: z.string().optional(),
  frequency: frequency.optional(),
  filters: z
    .object({
      classification: z.string().optional(),
      workType: workType.optional(),
      salaryMin: z.number().optional(),
      dateListed: z.string().optional(),
    })
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
